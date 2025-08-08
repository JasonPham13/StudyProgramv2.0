from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from typing import List
from core.fake_answer_generator import FakeAnswerGenerator
from db.database import get_db
from models.subject import Subject
from models.deck import Deck
from models.flashcard import Flashcard
from schemas.flashcard import FlashcardCreate, FlashcardOut
import json

router = APIRouter(prefix="/subjects/{subject_id}/decks/{deck_id}/flashcards", tags=["flashcards"])

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
        wrong_answers=json.dumps(flashcard.wrong_answers) if flashcard.wrong_answers else None,
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
    for f in flashcards:
        f.wrong_answers = json.loads(f.wrong_answers) if f.wrong_answers else None
    return flashcards

@router.get("/{flashcard_id}", response_model=FlashcardOut)
def get_flashcard(subject_id: int, deck_id: int, flashcard_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")

    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id, Flashcard.deck_id == deck_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found in this deck")

    flashcard.wrong_answers = json.loads(flashcard.wrong_answers) if flashcard.wrong_answers else None
    return flashcard

@router.put("/{flashcard_id}", response_model=FlashcardOut)
def update_flashcard(subject_id: int, deck_id: int, flashcard_id: int, flashcard_data: FlashcardCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")

    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id, Flashcard.deck_id == deck_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found in this deck")

    flashcard.question = flashcard_data.question
    flashcard.correct_answer = flashcard_data.correct_answer
    flashcard.wrong_answers = json.dumps(flashcard_data.wrong_answers) if flashcard_data.wrong_answers else None
    db.commit()
    db.refresh(flashcard)
    return flashcard

@router.delete("/{flashcard_id}")
def delete_flashcard(subject_id: int, deck_id: int, flashcard_id: int, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")

    flashcard = db.query(Flashcard).filter(Flashcard.id == flashcard_id, Flashcard.deck_id == deck_id).first()
    if not flashcard:
        raise HTTPException(status_code=404, detail="Flashcard not found in this deck")

    db.delete(flashcard)
    db.commit()
    return {"message": "Flashcard deleted"}

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
        fake_answers=fake_answers,
    )