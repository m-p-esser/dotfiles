import configparser
import logging
from os import environ
from pathlib import Path

import toml
from snowflake.snowpark.session import Session

snowsql_config_file_mapping = {
    "accountname": "account",
    "username": "user",
    "password": "password",
    "rolename": "role",
    "dbname": "database",
    "schemaname": "schema",
    "warehousename": "warehouse",
    "authenticator": "authenticator",
}


def get_session(
    config_path: Path = Path.cwd().joinpath("deployment.toml"),
    query_tag=None,
) -> Session:
    """
    Returns a session object
    """
    config_dict = {}
    config_dict.update(get_env_var_config())
    if not config_dict["password"] or not config_dict["authenticator"]:
        logging.info(
            "Environment variables for Snowflake Connection not found. "
            + "Falling back to deployment.toml"
        )
        config_dict.update(get_toml_config(config_path))
    # The connector will fail to connect if authenticator is provided in key with empty value
    if not config_dict["authenticator"]:
        del config_dict["authenticator"]
    logging.info(config_dict)
    session = Session.builder.configs(config_dict).create()
    session.query_tag = query_tag
    return session


def get_env_var_config() -> dict:
    """
    Returns a dictionary of the connection parameters using the SnowSQL CLI
    environment variables.
    """
    pw = environ.get("SNOWSQL_PWD")
    authenticator = environ.get("SNOWSQL_AUTHENTICATOR")
    if pw or authenticator:
        return {
            "user": environ.get("SNOWSQL_USER"),
            "password": pw,
            "account": environ.get("SNOWSQL_ACCOUNT"),
            "role": environ.get("SNOWSQL_ROLE"),
            "warehouse": environ.get("SNOWSQL_WAREHOUSE"),
            "database": environ.get("SNOWSQL_DATABASE"),
            "schema": environ.get("SNOWSQL_SCHEMA"),
            "authenticator": authenticator,
        }
    else:
        return {
            "user": environ.get("SNOWFLAKE_USER"),
            "password": environ.get("SNOWFLAKE_PASSWORD"),
            "account": environ.get("SNOWFLAKE_ACCOUNT"),
            "role": environ.get("SNOWFLAKE_ROLE"),
            "warehouse": environ.get("SNOWFLAKE_WAREHOUSE"),
            "database": environ.get("SNOWFLAKE_DATABASE"),
            "schema": environ.get("SNOWFLAKE_SCHEMA"),
            "authenticator": environ.get("SNOWFLAKE_AUTHENTICATOR"),
        }


def get_toml_config(
    toml_config_path: Path = Path.cwd().joinpath("deployment.toml"),
) -> dict:
    """
    Returns a dictionary of the connection parameters using the deployment.toml
    in the project root.
    """
    try:
        loaded_config = toml.load(toml_config_path)
        config = configparser.ConfigParser(inline_comment_prefixes="#")
        snowsql_config_path = loaded_config["snowsql_config_path"]

        if not snowsql_config_path:
            session_config_dict = {
                k: v for k, v in loaded_config.get("connection").items() if v
            }
            session_config_dict.update(
                {k: v for k, v in loaded_config.get("context").items() if v}
            )
        else:
            config.read(snowsql_config_path)
            section_name = loaded_config["snowsql_connection_name"]
            snowsql_config_key = "connections" + (
                "." + section_name if section_name else ""
            )
            if snowsql_config_key in config:
                session_config = config[snowsql_config_key]
                session_config_dict = {
                    snowsql_config_file_mapping[k.lower()]: v.strip('"')
                    for k, v in session_config.items()
                }
        return session_config_dict
    except Exception as exc:
        raise EnvironmentError(
            "Error creating snowpark session - be sure you have a valid deployment.toml file",
        ) from exc
