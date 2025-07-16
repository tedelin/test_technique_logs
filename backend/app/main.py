from typing import Union
from opensearchpy import OpenSearch
from app.models.log import Log
from fastapi import FastAPI, Body, Query
from datetime import datetime
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
import os

app = FastAPI()
front_port = os.getenv("VITE_PORT")
print(front_port)
origins = [
    f"http://localhost:{front_port}",
    f"https://frontend:{front_port}",
]
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["GET", "POST"],
    allow_headers=["*"],
)
host = f"{os.getenv('OPENSEARCH_HOST')}:{os.getenv('OPENSEARCH_PORT')}"
client = OpenSearch(hosts=[host])

@app.post("/logs/")
async def create_logs(log: Annotated[Log, Body(embed=True)]):
    index = f"logs-{log.timestamp.year}.{log.timestamp.month}.{log.timestamp.day}"
    response = client.index(index=index, body=log.dict())
    return {"log": log, "id": response["_id"]}


@app.get("/logs/search")
def search_logs(q: Union[str, None] = None, level: Union[str, None] = None, service: Union[str, None] = None):
    must_clauses = []
    filter_clauses = []
    if q:
        must_clauses.append({
            "match": {
                "message": q
            }
        })
    if level:
        filter_clauses.append({
            "term": {
                "level.keyword": level
            }
        })
    if service:
        filter_clauses.append({
            "term": {
                "service.keyword": service
            }
        })
    query = {
        "query": {
            "bool": {
                "must": must_clauses,
                "filter": filter_clauses
            }
        },
        "sort": [
            {"timestamp": {"order": "desc"}}
        ]
    }
    response = client.search(
        index="logs-*",
        body=query
    )
    results = [
        {
            "id": hit["_id"],
            "timestamp": hit["_source"]["timestamp"],
            "message": hit["_source"]["message"],
            "level": hit["_source"].get("level"),
            "service": hit["_source"].get("service"),
        }
        for hit in response["hits"]["hits"]
    ]
    return results