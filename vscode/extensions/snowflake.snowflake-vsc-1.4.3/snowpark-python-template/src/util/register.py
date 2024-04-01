from types import ModuleType
from typing import Dict, Iterable, List, Callable, Literal, Optional, ParamSpec, Tuple, TypeVar, Union
from snowflake.snowpark.types import DataType

P = ParamSpec("P")
R = TypeVar("R")

def register_sproc(
    return_type: Optional[DataType] = None,
    input_types: Optional[List[DataType]] = None,
    name: Optional[Union[str, Iterable[str]]] = None,
    stage_location: Optional[str] = None,
    imports: Optional[List[Union[str, Tuple[str, str]]]] = None,
    packages: Optional[List[Union[str, ModuleType]]] = None,
    statement_params: Optional[Dict[str, str]] = None,
    execute_as: Literal["caller", "owner"] = "owner",
    strict: bool = False,
    source_code_display: bool = True,
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def wrapped_fn(f: Callable[P, R]) -> Callable[P, R]:
        def inner(*args: P.args, **kwargs: P.kwargs) -> R:
            return f(*args, **kwargs)
        inner.__register_opts__: P.args_ = {
            "type": "sproc",
            "original_function": f,
            "return_type": return_type,
            "input_types": input_types,
            "name": name,
            "stage_location": stage_location,
            "imports": imports,
            "packages": packages,
            "statement_params": statement_params,
            "execute_as": execute_as,
            "strict": strict,
            "source_code_display": source_code_display
        }
        return inner
    return wrapped_fn

def register_udf(
    return_type: Optional[DataType] = None,
    input_types: Optional[List[DataType]] = None,
    name: Optional[Union[str, Iterable[str]]] = None,
    stage_location: Optional[str] = None,
    imports: Optional[List[Union[str, Tuple[str, str]]]] = None,
    packages: Optional[List[Union[str, ModuleType]]] = None,
    statement_params: Optional[Dict[str, str]] = None,
    execute_as: Literal["caller", "owner"] = "owner",
    strict: bool = False,
    secure: bool = False,
    source_code_display: bool = True,
) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def wrapped_fn(f: Callable[P, R]) -> Callable[P, R]:
        def inner(*args: P.args, **kwargs: P.kwargs) -> R:
            return f(*args, **kwargs)
        inner.__register_opts__: P.args_ = {
            "type": "udf",
            "original_function": f,
            "return_type": return_type,
            "input_types": input_types,
            "name": name,
            "stage_location": stage_location,
            "imports": imports,
            "packages": packages,
            "statement_params": statement_params,
            "execute_as": execute_as,
            "strict": strict,
            "secure": secure,
            "source_code_display": source_code_display
        }
        return inner
    return wrapped_fn
