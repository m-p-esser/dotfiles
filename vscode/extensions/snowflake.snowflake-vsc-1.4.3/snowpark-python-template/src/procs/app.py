"""
An example stored procedure.
"""

from snowflake.snowpark.session import Session
from snowflake.snowpark.dataframe import col, DataFrame
from util import register_sproc
from snowflake.snowpark.functions import udf

@register_sproc(name="snowpark_example_procedure")
def run(snowpark_session: Session) -> DataFrame:
    """
    A sample stored procedure which creates a small DataFrame, prints it to the
    console, and returns the DataFrame.
    """

    @udf(is_permanent=False)
    def combine(string_a: str, string_b: str) -> str:
        """
        A sample UDF implementation
        """
        return string_a + string_b

    schema = ["col_1", "col_2"]

    data = [
        ("Welcome to ", "Snowflake!"),
        ("Learn more: ", "https://www.snowflake.com/snowpark/"),
    ]

    df: DataFrame = snowpark_session.create_dataframe(data, schema)

    df2 = df.select(
        combine(
            col("col_1"), 
            col("col_2")
        ).as_("Hello world")).sort(
        "Hello world", ascending=False
    )

    df2.show()
    return df2
