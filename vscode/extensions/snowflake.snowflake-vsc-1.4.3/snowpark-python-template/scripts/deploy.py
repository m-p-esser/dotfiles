import glob
import importlib
import importlib.util
import logging
import os
import re
import shutil
import sys
import tempfile
from pathlib import Path
from typing import Callable, ParamSpec, TypeVar

import toml
from snowflake.snowpark import functions
from snowflake.snowpark._internal.type_utils import convert_sp_to_sf_type
from snowflake.snowpark._internal.udf_utils import (UDFColumn,
                                                    extract_return_input_types)
from snowflake.snowpark._internal.utils import TempObjectType
from snowflake.snowpark.session import Session
from snowflake.snowpark.types import StructType

from utils import get_module_name_from_file, get_session

P = ParamSpec("P")
R = TypeVar("R")

"""
Because we import py files during deployment, we don't want sproc or udf decorators
to run, so we replace them noop decorators that just return the original function.
"""
def noop_decorator(*args, **kwargs) -> Callable[[Callable[P, R]], Callable[P, R]]:
    def wrapped_fn(f: Callable[P, R]) -> Callable[P, R]:
        def inner(*args: P.args, **kwargs: P.kwargs) -> R:
            return f(*args, **kwargs)
        return inner
    return wrapped_fn

functions.sproc = noop_decorator
functions.udf = noop_decorator

def get_udfs_and_procs(
    config,
) -> list:
    """
    Returns a list of stored procedures and udfs to create by recursively 
    checking all py files in src that are wrapped in @register decorators
    """
    udfs = []
    sprocs = []

    for file in glob.iglob(Path.cwd().joinpath('src', '**', '*.py').as_posix(), recursive=True):
        if (os.path.basename(file) == '__init__.py'):
            continue
        name = get_module_name_from_file(file)
        spec = importlib.util.spec_from_file_location(name, file)
        module = importlib.util.module_from_spec(spec)
        spec.loader.exec_module(module)
        functions = [fn for fn in dir(module) if callable(getattr(module, fn))]
        for fn in functions:
            opts = getattr(getattr(module, fn), '__register_opts__', None)
            if opts is not None:
                entry = {
                    'local_path': file,
                    'module_name': name,
                    'function_name': fn,
                    'name': opts['name'],
                    'original_function': opts['original_function'],
                    'stage_location': opts['stage_location'] if opts['stage_location'] is not None else config.get('context', {}).get('stage', ''),
                    'return_type': opts['return_type'],
                    'input_types': opts['input_types'],
                    'imports': opts['imports'],
                    'packages': opts['packages'],
                    'statement_params': opts['statement_params'],
                    'execute_as': opts['execute_as'],
                    'strict': opts['strict'],
                    'source_code_display': opts['source_code_display']
                }
                if (opts['type'] == 'sproc'):
                    sprocs.append(entry)
                else:
                    udfs.append(entry)

    return [sprocs, udfs]

def create_udf_sproc(session: Session, stage_archive: str, sproc: dict = None, udf: dict = None) -> None:

    obj = sproc if sproc is not None else udf

    if obj is None:
        raise Exception("Must specify either sproc or udf")
 
    type = TempObjectType.PROCEDURE if sproc is not None else TempObjectType.FUNCTION

    # Dependency on _internal Snowpark function to identify return/input types from type hints
    is_pandas_udf, is_dataframe_input, return_type, input_types = extract_return_input_types(obj['original_function'], obj['return_type'], obj['input_types'], type)

    replace = True
    if_not_exists = False
    is_temporary = False

    packages = obj.get('packages')
    name = obj.get('name')

    if re.search(r"[ \n]", name):
        raise Exception("Name parameter cannot contain spaces.")

    module_name = obj.get('module_name')
    function_name = obj.get('function_name')
    execute_as = obj.get('execute_as')
    strict = obj.get('strict', False)
    secure = obj.get('secure', False)

    arg_names = ["session"] + [f"arg{i+1}" for i in range(len(input_types))]
    input_args = [
        UDFColumn(dt, arg_name) for dt, arg_name in zip(input_types, arg_names[1:])
    ]

    if isinstance(return_type, StructType):
        return_sql = f'RETURNS TABLE ({",".join(f"{field.name} {convert_sp_to_sf_type(field.datatype)}" for field in return_type.fields)})'
    else:
        return_sql = f"RETURNS {convert_sp_to_sf_type(return_type)}"
    input_sql_types = [convert_sp_to_sf_type(arg.datatype) for arg in input_args]
    sql_func_args = ",".join(
        [f"{a.name} {t}" for a, t in zip(input_args, input_sql_types)]
    )

    # resolve packages
    resolved_packages = (
        session._resolve_packages(packages, include_pandas=is_pandas_udf)
        if packages is not None
        else session._resolve_packages(
            [], session._packages, validate_package=False, include_pandas=is_pandas_udf
        )
    )
    all_packages = ",".join([f"'{package}'" for package in resolved_packages])

    packages_in_sql = f"PACKAGES=({all_packages})" if all_packages else ""

    execute_as_sql = "" if (execute_as is None or type == TempObjectType.FUNCTION) else f"EXECUTE AS {execute_as.upper()}"
    strict_as_sql = "\nSTRICT" if strict else ""
    create_query = ' '.join([
        f'CREATE{" OR REPLACE " if replace else ""}',
        f'{"TEMPORARY " if is_temporary else ""} {"SECURE " if secure else ""} {type.value} ',
        f'{"IF NOT EXISTS" if if_not_exists else ""} {name if isinstance(name, str) else ".".join(name)}({sql_func_args})',
        f'{return_sql}',
        f'LANGUAGE PYTHON {strict_as_sql}',
        f'RUNTIME_VERSION={sys.version_info[0]}.{sys.version_info[1]}',
        f"IMPORTS=('{stage_archive}')",
        f'{packages_in_sql}',
        f"HANDLER='{module_name}.{function_name}' {execute_as_sql}"
    ])

    session._run_query(create_query, is_ddl_on_temp_object=is_temporary)

if __name__ == '__main__':
    logging.basicConfig(level=logging.ERROR)
    print('Creating Snowflake session...')
    session: Session = get_session()

    pyproject_data = toml.load('pyproject.toml')
    dependencies = pyproject_data.get('project', {}).get('dependencies', [])

    config = toml.load('deployment.toml')
    stage = config.get('context', {}).get('stage', '')

    print('Scanning src...')
    (sprocs, udfs) = get_udfs_and_procs(config)

    for dependency in dependencies:
        # The connector's pandas is required for running locally but not for the deployed procedure.
        if dependency != 'snowflake-connector-python[pandas]':
            session.add_packages(dependency)
        
    with tempfile.TemporaryDirectory() as tmpdir:
        basename = os.path.basename(Path.cwd())
        archive_path = Path(tmpdir).joinpath(basename)

        print('Creating archive...')

        shutil.make_archive( 
            archive_path,
            'zip', 
            Path.cwd().joinpath('src')
        )

        print('Uploading archive...')
        session._conn.upload_file(
            path=f"{archive_path}.zip",
            stage_location=stage,
            compress_data=False,
            overwrite=True,
            skip_upload_on_content_match=True,
        )

        sproc_count = len(sprocs)   
        if sproc_count > 0:
            print('Creating stored procedures...')
        for i in range(sproc_count):
            sproc = sprocs[i]
            sys.stdout.write(f"\r  [{i + 1}/{sproc_count}] {sproc['name']}")
            sys.stdout.flush()
            create_udf_sproc(session=session, sproc=sproc, stage_archive=f'{stage}/{basename}.zip')

        print('')

        udf_count = len(udfs)   
        if udf_count > 0:
            print('Creating UDFs...')
        for i in range(udf_count):
            udf = udfs[i]
            sys.stdout.write(f"\r  [{i + 1}/{udf_count}] {udf['name']}")
            sys.stdout.flush()
            create_udf_sproc(session=session, udf=udf, stage_archive=f'{stage}/{basename}.zip')
