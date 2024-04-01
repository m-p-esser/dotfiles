import importlib
import importlib.util
import inspect
import sys
import logging

from utils import get_session, get_module_name_from_file

def call_entry_point(entry_point_file, function_name, *argument_values):
    name = get_module_name_from_file(entry_point_file)
    spec = importlib.util.spec_from_file_location(name, entry_point_file)
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    function = getattr(module, function_name)

    opts = getattr(function, '__register_opts__', None)
    function_signature = inspect.signature(opts['original_function'])
    function_args = list(function_signature.parameters.items())

    session = get_session()
    args=[session] if opts['type'] == 'sproc' else []

    j=0
    for i, p in enumerate(function_args):
        if opts["type"] == "sproc" and i == 0:
            continue
        param = p[1]
        if (j < len(argument_values)):
            args.append(argument_values[j])
        else:
            if param.default is param.empty:
                print("Argument " + param.name + " must have a default value specified to run locally.", file=sys.stderr)
                return
        j += 1

    result = function(*args)
    return result

if __name__ == "__main__":
    if len(sys.argv) < 3:
        print(
            "Usage: python run.py <entry_point_filepath> <function_name> <arg1> [<arg2> ...]"
        )
        sys.exit(1)

    entry_point_file = sys.argv[1]
    function_name = sys.argv[2]
    argument_values = sys.argv[3:]
    result = call_entry_point(entry_point_file, function_name, *argument_values)
