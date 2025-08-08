from typing import List, Optional
from pydantic import BaseModel

class FlashcardCreate(BaseModel):
    question: str
    correct_answer: str
    wrong_answers: Optional[List[str]] = None

class FlashcardOut(BaseModel):
    id: int
    question: str
    correct_answer: str
    wrong_answers: Optional[List[str]] = None
    deck_id: int

    class Config:
        from_attributes = True
