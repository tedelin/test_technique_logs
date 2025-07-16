from typing import Union
from opensearchpy import OpenSearch
from app.models.log import Log
from fastapi import FastAPI, Body
from datetime import datetime
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
origins = [
    "http://localhost:5173",
    "https://frontend:5173",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
host = os.getenv("OPENSEARCH_HOST", "http://opensearch-node:9200")
client = OpenSearch(hosts=[host])

@app.post("/logs/")
async def create_logs(log: Annotated[Log, Body(embed=True)]):
    index = f"logs-{log.timestamp.year}.{log.timestamp.month}.{log.timestamp.day}"
    response = client.index(index=index, body=log.dict())
    return {"log": log, "id": response["_id"]}