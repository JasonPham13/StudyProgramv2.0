from pydantic import BaseModel

class FlashcardCreate(BaseModel):
    question: str
    correct_answer: str

class FlashcardOut(BaseModel):
    id: int
    question: str
    correct_answer: str
    deck_id: int

    class Config:
        from_attributes = True
