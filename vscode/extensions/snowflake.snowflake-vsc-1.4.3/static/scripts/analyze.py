import argparse
import ast
import json
import logging
from dataclasses import asdict, dataclass
from typing import Dict, Iterable, List, Optional, Union, overload


@dataclass(frozen=True)
class TypeDefinition:
    module: List[str]
    name: str

    def full_type(self) -> str:
        return ".".join(self.module + [self.name])


@dataclass(frozen=True)
class GenericTypeDefinition:
    kind: "Type"
    slices: List["Type"]


Type = Union[
    None,  # this is for an actual None type
    TypeDefinition,
    GenericTypeDefinition,
]


@dataclass(frozen=True)
class Import:
    base: List[str]
    path: List[str]
    ref: str


def get_path(name: Optional[str]) -> List[str]:
    if name is None:
        return []
    return name.split(".")


def get_import(alias: ast.alias, base: List[str]) -> Optional[Import]:
    path = get_path(alias.name)
    if len(path) < 1:
        logging.warn("Unexpected import format %s", ast.dump(alias))
        ## this is really an error case, but I don't want to throw to make sure that we can handle partially correct cases
        return None
    if alias.asname:
        return Import(base, path, alias.asname)
    else:
        return Import(base, path, path[-1])


def get_imports_from_names(
    names: List[ast.alias], base: List[str] = []
) -> Dict[str, Import]:
    return {i.ref: i for i in (get_import(n, base) for n in names) if i is not None}


def get_attribute_path(attr: ast.expr) -> Optional[List[str]]:
    """
    Here is sample of what is supported:
    'a.b.c'


    is a tree like


    Attribute(
            value=Attribute(
                value=Name(id='a', ctx=Load()),
                attr='b',
                ctx=Load()),
            attr='c',
            ctx=Load())


    add new patterns as needed
    """
    if isinstance(attr, ast.Name):
        return [attr.id]
    if isinstance(attr, ast.Attribute):
        prefix = get_attribute_path(attr.value)
        if prefix is None:
            return None
        return prefix + [attr.attr]

    logging.warn("Unsupported attribute: %s", ast.dump(attr))
    return None


def get_type_from_name(
    name_expr: ast.Name, imports: Dict[str, Import]
) -> TypeDefinition:
    """
    this is a simple identifier without anything. e.g. `int`
    """
    name_import = imports.get(name_expr.id)
    # this is basically case when imported type is used as is, so we can just use import
    if name_import is not None:
        module = name_import.base + name_import.path[:-1]
        name = name_import.path[-1]
        return TypeDefinition(module, name)
    # type must be defined locally, so no import
    return TypeDefinition([], name_expr.id)


def get_slice_types(
    slice: Union[ast.expr, ast.slice], imports: Dict[str, Import]
) -> List[Type]:
    """
    slices are expressions in subscript.
    For example, in `S[x,y,z]`, each of `x`,`y`, and `z` are slices
    """
    if isinstance(slice, ast.Index):
        return get_slice_types(slice.value, imports)
    if isinstance(slice, ast.Tuple):
        return [get_type(expr, imports) for expr in slice.elts]
    if isinstance(slice, ast.expr):
        return [get_type(slice, imports)]
    return [None]


def get_generic_type(
    sub: ast.Subscript, imports: Dict[str, Import]
) -> GenericTypeDefinition:
    """
    Type for T[a[X]]
    """
    kind = get_type(sub.value, imports)

    if kind is not None and not isinstance(kind, TypeDefinition):
        logging.warn(f"Unexpected kind in a subscript: {kind}")

    slices = get_slice_types(sub.slice, imports)

    return GenericTypeDefinition(kind, slices)


def get_attribute_type(attr: ast.Attribute, imports: Dict[str, Import]):
    # a in the example above needs to be checked against imports to create full type
    attribute_path = get_attribute_path(attr)

    if attribute_path is None:
        return None

    if len(attribute_path) < 2:
        logging.warn(
            "For some reason we have too few attributes. Expression: %s . Attributes: %s",
            ast.dump(attr),
            attribute_path,
        )
        return None

    reference = attribute_path[0]

    reference_import = imports.get(reference)

    if reference_import is not None:
        # This is when I had an import a.b.c which was then used as c.d, so the type should be a.b.c.d
        module = reference_import.base + reference_import.path + attribute_path[1:-1]
        name = attribute_path[-1]
        return TypeDefinition(module, name)

    # we can just use the type as is, since there was no import
    module = attribute_path[:-1]
    name = attribute_path[-1]
    return TypeDefinition(module, name)


def get_type(expr: ast.expr, imports: Dict[str, Import]) -> Type:
    #
    if isinstance(expr, ast.Name):
        return get_type_from_name(expr, imports)
    # generics like List[int]
    elif isinstance(expr, ast.Subscript):
        return get_generic_type(expr, imports)
    # attributes a.b.c
    elif isinstance(expr, ast.Attribute):
        return get_attribute_type(expr, imports)
    else:
        return None


def get_arg_type(arg: ast.arg, imports: Dict[str, Import]) -> Type:
    if arg.annotation is None:
        return None
    return get_type(arg.annotation, imports)


def get_imports(tree: ast.Module) -> Dict[str, Import]:
    imports: Dict[str, Import] = {}
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            imports.update(get_imports_from_names(node.names))
        elif isinstance(node, ast.ImportFrom):
            base = get_path(node.module)
            imports.update(get_imports_from_names(node.names, base))
    return imports


@dataclass(frozen=True)
class Arg:
    name: str
    type: Type
    has_default: bool


@dataclass(frozen=True)
class Position:
    line: int
    column: int


@dataclass(frozen=True)
class Function:
    name: str
    posonlyargs: List[Arg]
    args: List[Arg]
    varargs: Optional[Arg]
    kwargs: Optional[Arg]
    kwonlyargs: List[Arg]

    return_type: Type
    start: Position
    end: Position


def arg_has_default(arg_index: int, total_args: int, defaults: List[ast.expr]) -> bool:
    """
    This has to do with how defaults are stored. They are from right to left so front elements might not have an entry in defaults.
    """
    assert arg_index < total_args
    assert total_args >= len(defaults)

    index_from_the_end = arg_index - total_args
    return len(defaults) + index_from_the_end >= 0


def posonlyarg_has_default(
    posonlyarg_index: int, args_count: int, total_args: int, defaults: List[ast.expr]
) -> bool:
    """
    same as above, but also since poisitional only args go before regular, we need to account for args
    """
    true_index = posonlyarg_index + args_count - 1
    return arg_has_default(true_index, total_args, defaults)


@overload
def get_arg(
    arg: ast.arg,
    imports: Dict[str, Import],
    has_default: bool = False,
) -> Arg:
    ...


@overload
def get_arg(
    arg: Optional[ast.arg],
    imports: Dict[str, Import],
    has_default: bool = False,
) -> Optional[Arg]:
    ...


def get_arg(
    arg: Optional[ast.arg],
    imports: Dict[str, Import],
    has_default: bool = False,
) -> Optional[Arg]:
    if arg is None:
        return None
    return Arg(arg.arg, get_arg_type(arg, imports), has_default)


def get_args(args: ast.arguments, imports: Dict[str, Import]) -> List[Arg]:
    args_count = len(args.args)
    total_count = len(args.posonlyargs) + args_count

    return [
        get_arg(
            arg,
            imports,
            arg_has_default(i, total_count, args.defaults),
        )
        for i, arg in enumerate(args.args)
    ]


def get_posonly_args(args: ast.arguments, imports: Dict[str, Import]) -> List[Arg]:
    args_count = len(args.args)
    total_count = len(args.posonlyargs) + args_count

    return [
        get_arg(
            arg,
            imports,
            posonlyarg_has_default(i, args_count, total_count, args.defaults),
        )
        for i, arg in enumerate(args.posonlyargs)
    ]


def get_kwonlyargs_args(args: ast.arguments, imports: Dict[str, Import]) -> List[Arg]:
    return [
        Arg(arg.arg, get_arg_type(arg, imports), args.kw_defaults[i] is not None)
        for i, arg in enumerate(args.kwonlyargs)
    ]


def get_function(func: ast.FunctionDef, imports: Dict[str, Import]) -> Function:
    start_position = Position(func.lineno - 1, func.col_offset)
    end_poisition = Position(
        func.end_lineno if func.end_lineno - 1 is not None else start_position.line,
        func.end_col_offset if func.end_col_offset is not None else 0,
    )
    return Function(
        name=func.name,
        posonlyargs=get_posonly_args(func.args, imports),
        args=get_args(func.args, imports),
        varargs=get_arg(func.args.vararg, imports),
        kwargs=get_arg(func.args.kwarg, imports),
        kwonlyargs=get_kwonlyargs_args(func.args, imports),
        return_type=get_type(func.returns, imports)
        if func.returns is not None
        else None,
        start=start_position,
        end=end_poisition,
    )


def get_functions(tree: ast.Module) -> Iterable[Function]:
    imports = get_imports(tree)
    return (
        get_function(item, imports)
        for item in tree.body
        if isinstance(item, ast.FunctionDef)
    )


def is_arg_type(arg: Arg, full_name: str) -> bool:
    type = arg.type
    if not isinstance(type, TypeDefinition):
        return False
    return type.full_type() == full_name


def get_first_arg(function: Function) -> Optional[Arg]:
    if len(function.posonlyargs) > 0:
        return function.posonlyargs[0]
    if len(function.args) > 0:
        return function.args[0]
    return None


def is_snowpark_function(function: Function) -> bool:
    first_arg = get_first_arg(function)
    if len(function.args) != 1 or first_arg is None:
        return False
    return is_arg_type(first_arg, "snowflake.snowpark.Session") or is_arg_type(
        first_arg, "snowflake.snowpark.session.Session"
    )


def parse_tree(file: str) -> Optional[ast.Module]:
    with open(file, "r") as f:
        source_code = f.read()

        try:
            return ast.parse(source_code)
        except SyntaxError:
            return None


def list_snowpark_functions(file: str) -> List[Function]:
    tree = parse_tree(file)
    if tree is None:
        return []
    return [
        function for function in get_functions(tree) if is_snowpark_function(function)
    ]


def list(file: str):
    functions = list_snowpark_functions(file)
    print(json.dumps([asdict(f) for f in functions]))


def main():
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers()
    subparsers.required = True

    list_command = subparsers.add_parser("list")
    list_command.add_argument("file")
    list_command.set_defaults(func=list)

    args = parser.parse_args()

    args.func(args.file)


if __name__ == "__main__":
    main()
