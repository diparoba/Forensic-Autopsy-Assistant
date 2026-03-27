from fastapi import FastAPI, Depends, HTTPException, Request, Response
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
from sqlalchemy.orm import Session
from typing import List
from .database import Base
import uuid
import datetime
import json

from . import models
from . import schemas
from . import database

models.Base.metadata.create_all(bind=database.engine)

app = FastAPI(title="Autopsy Assistant API")

import os

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

app.mount(
    "/static", StaticFiles(directory=os.path.join(BASE_DIR, "static")), name="static"
)
templates = Jinja2Templates(directory=os.path.join(BASE_DIR, "templates"))


# Dependency
def get_db():
    db = database.SessionLocal()
    try:
        yield db
    finally:
        db.close()


@app.get("/")
async def serve_index(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})


@app.get("/dashboard")
async def serve_dashboard(request: Request):
    return templates.TemplateResponse("dashboard.html", {"request": request})


@app.get("/app.html")
async def serve_app(request: Request):
    return templates.TemplateResponse("app.html", {"request": request})


@app.get("/favicon.ico", include_in_schema=False)
async def serve_favicon():
    return Response(content=b"", media_type="image/x-icon")


# Authentication
@app.post("/api/auth/register", response_model=schemas.User)
def register(user: schemas.UserCreate, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User).filter(models.User.username == user.username).first()
    )
    if db_user:
        raise HTTPException(status_code=400, detail="Username already registered")

    user_id = "user-" + str(uuid.uuid4())
    create_time = datetime.datetime.utcnow().isoformat()
    db_user = models.User(
        id=user_id,
        name=user.name,
        username=user.username,
        password=user.password,
        role=user.role,
        writeApproved=False,
        createdAt=create_time,
    )
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    return db_user


@app.post("/api/auth/login", response_model=schemas.User)
def login(req: schemas.LoginRequest, db: Session = Depends(get_db)):
    db_user = (
        db.query(models.User)
        .filter(
            models.User.username == req.username, models.User.password == req.password
        )
        .first()
    )
    if not db_user:
        raise HTTPException(status_code=400, detail="Incorrect username or password")
    return db_user


@app.get("/api/auth/users", response_model=List[schemas.User])
def get_users(db: Session = Depends(get_db)):
    return db.query(models.User).all()


@app.post("/api/auth/approve")
def approve_write(req: schemas.ApproveWriteRequest, db: Session = Depends(get_db)):
    db_user = db.query(models.User).filter(models.User.id == req.userId).first()
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found")
    db_user.writeApproved = req.approved
    db.commit()
    return {"ok": True}


# Knowledge Base
@app.get("/api/knowledge", response_model=List[schemas.KBEntry])
def get_kb(db: Session = Depends(get_db)):
    entries = db.query(models.KBEntry).all()
    # parse json strings to lists
    result = []
    for entry in entries:
        obj = schemas.KBEntry.model_validate(entry)
        obj.steps = json.loads(entry.steps) if entry.steps else []
        obj.trigger_keywords = (
            json.loads(entry.trigger_keywords) if entry.trigger_keywords else []
        )
        result.append(obj)
    return result


@app.post("/api/knowledge", response_model=schemas.KBEntry)
def create_kb_entry(entry: schemas.KBEntryCreate, db: Session = Depends(get_db)):
    entry_id = "kb-" + str(uuid.uuid4())
    db_entry = models.KBEntry(
        id=entry_id,
        title=entry.title,
        category=entry.category,
        content=entry.content,
        steps=json.dumps(entry.steps),
        trigger_keywords=json.dumps(entry.trigger_keywords),
        author=entry.author,
        authorId=entry.authorId,
        timestamp=datetime.datetime.utcnow().isoformat(),
    )
    db.add(db_entry)
    db.commit()
    db.refresh(db_entry)

    obj = schemas.KBEntry.model_validate(db_entry)
    obj.steps = json.loads(db_entry.steps)
    obj.trigger_keywords = json.loads(db_entry.trigger_keywords)
    return obj


@app.put("/api/knowledge/{entry_id}", response_model=schemas.KBEntry)
def update_kb_entry(
    entry_id: str, entry: schemas.KBEntryCreate, db: Session = Depends(get_db)
):
    db_entry = db.query(models.KBEntry).filter(models.KBEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")

    db_entry.title = entry.title
    db_entry.category = entry.category
    db_entry.content = entry.content
    db_entry.steps = json.dumps(entry.steps)
    db_entry.trigger_keywords = json.dumps(entry.trigger_keywords)

    db.commit()
    db.refresh(db_entry)

    obj = schemas.KBEntry.model_validate(db_entry)
    obj.steps = json.loads(db_entry.steps)
    obj.trigger_keywords = json.loads(db_entry.trigger_keywords)
    return obj


@app.delete("/api/knowledge/{entry_id}")
def delete_kb_entry(entry_id: str, db: Session = Depends(get_db)):
    db_entry = db.query(models.KBEntry).filter(models.KBEntry.id == entry_id).first()
    if not db_entry:
        raise HTTPException(status_code=404, detail="Entry not found")
    db.delete(db_entry)
    db.commit()
    return {"ok": True}


# Notebook
@app.get("/api/notebook/{user_id}", response_model=List[schemas.Note])
def get_notes(user_id: str, db: Session = Depends(get_db)):
    return db.query(models.Note).filter(models.Note.userId == user_id).all()


@app.post("/api/notebook", response_model=schemas.Note)
def create_note(note: schemas.NoteCreate, db: Session = Depends(get_db)):
    note_id = "note-" + str(uuid.uuid4())
    db_note = models.Note(
        id=note_id,
        userId=note.userId,
        text=note.text,
        category=note.category,
        source=note.source,
        timestamp=datetime.datetime.utcnow().isoformat(),
    )
    db.add(db_note)
    db.commit()
    db.refresh(db_note)
    return db_note


@app.put("/api/notebook/{note_id}", response_model=schemas.Note)
def update_note(note_id: str, note: schemas.NoteCreate, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")

    db_note.text = note.text
    db_note.category = note.category

    db.commit()
    db.refresh(db_note)
    return db_note


@app.delete("/api/notebook/{note_id}")
def delete_note(note_id: str, db: Session = Depends(get_db)):
    db_note = db.query(models.Note).filter(models.Note.id == note_id).first()
    if not db_note:
        raise HTTPException(status_code=404, detail="Note not found")
    db.delete(db_note)
    db.commit()
    return {"ok": True}
