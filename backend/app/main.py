from typing import Union
from opensearchpy import OpenSearch
from app.models.log import Log
from fastapi import FastAPI, Body
from datetime import datetime
from typing import Annotated
import os

app = FastAPI()
host = os.getenv("OPENSEARCH_HOST", "http://opensearch-node:9200")
client = OpenSearch(hosts=[host])

@app.post("/logs/")
async def create_logs(log: Annotated[Log, Body(embed=True)]):
    dt = datetime.fromisoformat(log.timestamp.replace("Z", "+00:00"))
    index = f"logs-{dt.year}.{dt.month}.{dt.day}"
    response = client.index(index=index, body=log.dict())
    print(log, response)
    return {"log": log, "id": response["_id"]}