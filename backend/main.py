from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from auth import router as auth_router

from salesforce import (
    get_records,
    create_record,
    update_record,
    delete_record
)


app = FastAPI(
    title="CloudVandana Salesforce CRUD API"
)


# =========================
# CORS
# =========================

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# =========================
# AUTH
# =========================

app.include_router(auth_router)


# =========================
# HOME
# =========================

@app.get("/")
def home():
    return {
        "message": "CloudVandana Salesforce CRUD Backend is running"
    }


# =========================
# GET RECORDS
# =========================

@app.get("/api/objects/{object_name}")
def get_object_records(
    object_name: str,
    limit: int = 20,
    offset: int = 0
):

    return get_records(
        object_name,
        limit,
        offset
    )


# =========================
# CREATE
# =========================

class RecordData(BaseModel):
    data: dict


@app.post("/api/objects/{object_name}")
def create_object_record(
    object_name: str,
    record: RecordData
):

    return create_record(
        object_name,
        record.data
    )


# =========================
# UPDATE
# =========================

@app.put("/api/objects/{object_name}/{record_id}")
def update_object_record(
    object_name: str,
    record_id: str,
    record: RecordData
):

    return update_record(
        object_name,
        record_id,
        record.data
    )


# =========================
# DELETE
# =========================

@app.delete("/api/objects/{object_name}/{record_id}")
def delete_object_record(
    object_name: str,
    record_id: str
):

    return delete_record(
        object_name,
        record_id
    )