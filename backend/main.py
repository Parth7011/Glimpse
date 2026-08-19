from fastapi import FastAPI

from pydantic import BaseModel
from typing import Optional
import uuid

app = FastAPI(title="Glimpse API", version="0.1.0")

# In-memory store for events
events_db = {}

class EventCreate(BaseModel):
    name: str
    description: Optional[str] = None
    date: Optional[str] = None

class EventResponse(BaseModel):
    id: str
    name: str
    description: Optional[str] = None
    date: Optional[str] = None

@app.get("/")
def read_root():
    return {"message": "Welcome to Glimpse API"}



@app.get("/health")
def health_check():
    return {"status": "ok"}

@app.post("/events", response_model=EventResponse)
def create_event(event: EventCreate):
    event_id = str(uuid.uuid4())
    new_event = EventResponse(
        id=event_id,
        name=event.name,
        description=event.description,
        date=event.date
    )
    events_db[event_id] = new_event
    return new_event

@app.get("/events")
def list_events():
    return list(events_db.values())

