# Steps

1. Right-click the environment.yml file and select Create Snowpark Environment.
2. When the prompt about using the newly-created environment comes up, click yes.
3. If you've previously logged in through the Snowflake extension, the deployment.toml should be mostly pre-filled with connection information. Finish filling out needed information.
4. Write your code and use the corresponding Python decorators to decorate functions that will be deployed as UDFs or stored procedures.
5. To run locally, click the Run Locally button above the decorated Python function in your file. If parameters need to be passed in, either make them default parameters or wrap it in another function. You may also call the scripts/run.py file with your code's filepath and function name. For example, from within the root folder, `python scripts/run.py <entry_point_filepath> <function_name> <arg1> [<arg2> ...]`
6. To deploy, run `python scripts/deploy.py` in your terminal.
7. To call your deployed UDFs or procedures, execute `call <udf_or_procedure_name>` in the resources.sql file through the Snowflake extension.
