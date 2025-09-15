from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from backend.core.fake_answer_generator import FakeAnswerGenerator
from backend.db.database import get_db
from backend.models.subject import Subject
from backend.models.deck import Deck
from backend.models.flashcard import Flashcard
from backend.schemas.flashcard import FlashcardCreate, FlashcardOut

router = APIRouter(
    prefix="/subjects/{subject_id}/decks/{deck_id}/flashcards",
    tags=["flashcards"]
)

# ----------------- CRUD ROUTES ----------------- #

@router.post("/", response_model=FlashcardOut)
def create_flashcard(subject_id: int, deck_id: int, flashcard: FlashcardCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")

    new_flashcard = Flashcard(
        question=flashcard.question,
        correct_answer=flashcard.correct_answer,
        deck_id=deck_id
    )
    db.add(new_flashcard)
    db.commit()
    db.refresh(new_flashcard)
    return new_flashcard

@router.get("/", response_model=List[FlashcardOut])
def list_flashcards(subject_id: int, deck_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")

    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")

    flashcards = db.query(Flashcard).filter(Flashcard.deck_id == deck_id).all()
    return flashcards

@router.get("/{flashcard_id}", response_model=FlashcardOut)
def get_flashcard(subject_id: int, deck_id: int, flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.deck_id == deck_id
    ).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")
    return flashcard

@router.put("/{flashcard_id}", response_model=FlashcardOut)
def update_flashcard(subject_id: int, deck_id: int, flashcard_id: int, flashcard_data: FlashcardCreate, db: Session = Depends(get_db)):
    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.deck_id == deck_id
    ).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    flashcard.question = flashcard_data.question
    flashcard.correct_answer = flashcard_data.correct_answer
    db.commit()
    db.refresh(flashcard)
    return flashcard

@router.delete("/{flashcard_id}")
def delete_flashcard(subject_id: int, deck_id: int, flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(Flashcard).filter(
        Flashcard.id == flashcard_id,
        Flashcard.deck_id == deck_id
    ).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    db.delete(flashcard)
    db.commit()
    return {"message": "Flashcard deleted"}

# ----------------- QUIZ ROUTE ----------------- #

class QuizFlashcardResponse(BaseModel):
    question: str
    correct_answer: str
    fake_answers: List[str]

@router.get("/quiz/{flashcard_id}", response_model=QuizFlashcardResponse)
def get_quiz_flashcard(flashcard_id: int, db: Session = Depends(get_db)):
    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found")

    fake_answers = FakeAnswerGenerator.generate_distractors(
        question=flashcard.question,
        correct_answer=flashcard.correct_answer
    )

    return QuizFlashcardResponse(
        question=flashcard.question,
        correct_answer=flashcard.correct_answer,
        fake_answers=fake_answers
    )
