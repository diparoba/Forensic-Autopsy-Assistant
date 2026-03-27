from sqlalchemy import Boolean, Column, ForeignKey, Integer, String, Text, DateTime
from sqlalchemy.orm import relationship
import datetime

from . import database
from .database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(String, primary_key=True, index=True)
    name = Column(String, index=True)
    username = Column(String, unique=True, index=True)
    password = Column(String)
    role = Column(String)  # 'owner', 'professional', 'student'
    writeApproved = Column(Boolean, default=False)
    createdAt = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())

    notes = relationship("Note", back_populates="owner")
    kb_entries = relationship("KBEntry", back_populates="author_user")


class KBEntry(Base):
    __tablename__ = "knowledge_base"

    id = Column(String, primary_key=True, index=True)
    title = Column(String, index=True)
    category = Column(String, index=True)
    content = Column(Text)
    steps = Column(Text)  # JSON string array
    trigger_keywords = Column(Text)  # JSON string array
    author = Column(String)
    authorId = Column(String, ForeignKey("users.id"))
    timestamp = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())

    author_user = relationship("User", back_populates="kb_entries")


class Note(Base):
    __tablename__ = "notes"

    id = Column(String, primary_key=True, index=True)
    userId = Column(String, ForeignKey("users.id"))
    text = Column(Text)
    category = Column(String, default="General")
    source = Column(String, default="manual")
    timestamp = Column(String, default=lambda: datetime.datetime.utcnow().isoformat())

    owner = relationship("User", back_populates="notes")
