from pydantic import BaseModel
from typing import List, Optional


class UserBase(BaseModel):
    name: str
    username: str
    role: str


class UserCreate(UserBase):
    password: str


class User(UserBase):
    id: str
    writeApproved: bool
    createdAt: str

    class Config:
        from_attributes = True


class LoginRequest(BaseModel):
    username: str
    password: str


class KBEntryBase(BaseModel):
    title: str
    category: str
    content: str
    steps: List[str]
    trigger_keywords: List[str]
    author: str
    authorId: str


class KBEntryCreate(KBEntryBase):
    pass


class KBEntry(KBEntryBase):
    id: str
    timestamp: str

    class Config:
        from_attributes = True


class NoteCreate(BaseModel):
    text: str
    userId: str
    category: Optional[str] = "General"
    source: Optional[str] = "manual"


class Note(BaseModel):
    id: str
    userId: str
    text: str
    category: str
    source: str
    timestamp: str

    class Config:
        from_attributes = True


class ApproveWriteRequest(BaseModel):
    userId: str
    approved: bool
