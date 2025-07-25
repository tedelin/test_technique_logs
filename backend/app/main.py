from typing import Union
from opensearchpy import OpenSearch
from app.models.log import Log
from fastapi import FastAPI, Body, Query, WebSocket, WebSocketDisconnect, Response
from datetime import datetime
from typing import Annotated
from fastapi.middleware.cors import CORSMiddleware
from typing import Any
import json
import os

app = FastAPI()
origins = [
    f"{os.getenv('FRONT_URL')}:{os.getenv('VITE_PORT')}"
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

class ConnectionManager:
    def __init__(self):
        self.active_connections: list[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        self.active_connections.remove(websocket)

    async def broadcast(self, message: Any):
        serialized = json.dumps(message, default=self._default_serializer)
        for connection in self.active_connections:
            await connection.send_text(serialized)

    def _default_serializer(self, obj):
        if isinstance(obj, datetime):
            return obj.isoformat()
        raise TypeError(f"Type {type(obj)} not serializable")

manager = ConnectionManager()

@app.websocket("/ws")
async def websocket_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            await websocket.receive_text()
    except WebSocketDisconnect:
        manager.disconnect(websocket)

@app.post("/logs/")
async def create_logs(log: Annotated[Log, Body(embed=True)]):
    index = f"logs-{log.timestamp.year}.{log.timestamp.month}.{log.timestamp.day}"
    log_dict = log.dict()
    response = client.index(index=index, body=log_dict)
    log_dict["id"] = response["_id"]
    await manager.broadcast({"event": "newLog", "log": log_dict})
    return {"log": log_dict}


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
        'size': 20,
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

@app.get("/logs/levels")
async def get_log_counts():
    body = {
        "size": 0,
        "aggs": {
            "levels": {
                "terms": {
                    "field": "level.keyword",
                    "size": 10
                }
            }
        }
    }
    resp = client.search(index="logs-*", body=body)
    levels = ["ERROR", "WARNING", "DEBUG", "INFO"]
    if not resp.get("aggregations") or not resp["aggregations"].get("levels"):
        return Response(status_code=200)
    buckets = resp["aggregations"]["levels"].get("buckets", [])
    result = {bucket["key"]: bucket["doc_count"] for bucket in buckets}
    counts = {level: result.get(level, 0) for level in levels}
    return counts
