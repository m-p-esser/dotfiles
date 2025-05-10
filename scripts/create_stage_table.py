import pandas as pd
import pathlib
import re
import pprint
import json
from io import StringIO
import sys

root_dir = pathlib.Path.cwd()
data_catalog_file_path = root_dir / "analytics_data_catalog_v2.xlsm"

df_data_catalog = pd.read_excel(data_catalog_file_path)
df_data_catalog_filtered = df_data_catalog \
   .loc[:, [
      "Snowflake INBOX Tabelle", "Snowflake INBOX Feld",
      "Snowflake STAGE Tabelle", "Snowflake STAGE Feld"
      ]]

def create_rename_mapping(stage_table_name: str):

   df = df_data_catalog_filtered[
      df_data_catalog_filtered["Snowflake STAGE Tabelle"] == stage_table_name
      ]
   
   df_rename_mapping = df[["Snowflake STAGE Feld", "Snowflake INBOX Feld"]]
   dict_rename_mapping = dict(df_rename_mapping.to_records(index=False))
   dict_rename_mapping = dict((k.lower(), v) for k, v in dict_rename_mapping.items())


   with open(root_dir / "templates" / "stag.sql", "r") as fp:
      
      lines = fp.readlines()

      for idx, line in enumerate(lines):
         if "transformed_columns" in line:
            transf_col_line = idx
         
      with open(root_dir / "test.sql", "w") as fp:
         for idx, line in enumerate(lines):
            if idx in [transf_col_line+2]:
               pass
            elif idx == transf_col_line+1:
               fp.write(json.dumps(dict_rename_mapping, indent=4))
            else:
               fp.write(line)

if __name__ == "__main__":
   create_rename_mapping(stage_table_name="STAG_NIELSEN__ARTICLE_CHARACTERISTICS")