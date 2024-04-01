import argparse
import importlib
import importlib.util
import os
import sys
from pathlib import Path
from typing import Any, Optional

from analyze import Function, list_snowpark_functions
from snowflake import connector
from snowflake.snowpark import Session
import warnings

warnings.filterwarnings("ignore")


def create_session(connection_name: str) -> Session:
    session_token = os.environ.get("SESSION_TOKEN")
    master_token = os.environ.get("MASTER_TOKEN")
    account = os.environ.get("SF_ACCOUNT")
    host = os.environ.get("SF_HOST")
    port = os.environ.get("SF_PORT")
    protocol = os.environ.get("SF_PROTOCOL")

    if connection_name:
        conn = connector.connect(connection_name=connection_name)
        return Session.builder.configs({"connection": conn}).create()
    elif session_token and master_token:
        try:
            conn = connector.connect(
                account=account, 
                host=host, 
                port=port, 
                protocol=protocol,
                session_token=session_token, 
                master_token=master_token
        )
        except connector.ProgrammingError as e:
            error_message = str(e)
            # "251005: User is empty" indicates the session token parameter doesn't exist on the current snowflake-python-connector version
            if "251005" in error_message:
                raise connector.ProgrammingError("Failed to use the active connection from the Snowflake extension. Requires snowflake-python-connector version 3.6.0 or higher.")
            else:
                raise
        return Session.builder.configs({"connection": conn}).create()
    else:    
        conn = connector.connect()
        return Session.builder.configs({"connection": conn}).create()


def get_snowpark_function(file: str, function: str) -> Optional[Function]:
    return next((f for f in list_snowpark_functions(file) if f.name == function), None)


def run(file: str, function: str, connection_name: str) -> Any:
    definition = get_snowpark_function(file, function)

    if definition is None:
        return None

    # Add the directory of the file to sys.path
    directory = Path(file).parent.resolve()
    if str(directory) not in sys.path:
        sys.path.insert(0, str(directory))

    spec = importlib.util.spec_from_file_location("module.name", file)

    if spec is None:
        return None

    module = importlib.util.module_from_spec(spec)
    if spec.loader is None:
        return None
    spec.loader.exec_module(module)

    invoker = getattr(module, function)

    session = create_session(connection_name)
    invoker(session)


def main():
    parser = argparse.ArgumentParser()

    subparsers = parser.add_subparsers()
    subparsers.required = True

    run_command = subparsers.add_parser("run")
    run_command.add_argument("file")
    run_command.add_argument("function")
    run_command.add_argument("connection_name")

    run_command.set_defaults(func=run)

    args = parser.parse_args()

    args.func(args.file, args.function, args.connection_name)


if __name__ == "__main__":
    main()
