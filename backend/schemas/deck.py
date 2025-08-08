from pydantic import BaseModel

class DeckCreate(BaseModel):
    name: str

class DeckOut(BaseModel):
    id: int
    name: str
    subject_id: int

    class Config:
        from_attributes = True
