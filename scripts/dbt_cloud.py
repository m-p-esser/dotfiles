from dbtc import dbtCloudClient
import os

CLOUD_ACCOUNT_ID = os.environ.get("DBTERD_DBT_CLOUD_ACCOUNT_ID")
SERVICE_TOKEN = os.environ.get("DBTDBT_CLOUD_SERVICE_TOKEN")
client = dbtCloudClient(
   service_token=SERVICE_TOKEN,
   use_beta_endpoint=False
)

result = client.metadata.column_lineage(
   environment_id=187545,
   node_unique_id="model.lekkerland_analytics_dwh.hub_article",
)
print(result)