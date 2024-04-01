from util import register_udf

@register_udf(name="snowpark_example_udf")
def mod5(x: int) -> int:
    return x % 5