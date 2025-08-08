from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from db.database import get_db
from models.subject import Subject
from models.deck import Deck
from schemas.deck import DeckCreate, DeckOut

router = APIRouter(prefix="/subjects/{subject_id}/decks", tags=["decks"])

@router.post("/", response_model=DeckOut)
def create_deck(subject_id: int, deck: DeckCreate, db: Session = Depends(get_db)):
    subject = db.query(Subject).filter(Subject.id == subject_id).first()
    if not subject:
        raise HTTPException(status_code=404, detail="Subject not found")
    new_deck = Deck(name=deck.name, subject_id=subject_id)
    db.add(new_deck)
    db.commit()
    db.refresh(new_deck)
    return new_deck

@router.get("/", response_model=List[DeckOut])
def list_decks(subject_id: int, db: Session = Depends(get_db)):
    return db.query(Deck).filter(Deck.subject_id == subject_id).all()

@router.get("/{deck_id}", response_model=DeckOut)
def get_deck(subject_id: int, deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")
    return deck

@router.put("/{deck_id}", response_model=DeckOut)
def update_deck(subject_id: int, deck_id: int, deck_data: DeckCreate, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")
    deck.name = deck_data.name
    db.commit()
    db.refresh(deck)
    return deck

@router.delete("/{deck_id}")
def delete_deck(subject_id: int, deck_id: int, db: Session = Depends(get_db)):
    deck = db.query(Deck).filter(Deck.id == deck_id, Deck.subject_id == subject_id).first()
    if not deck:
        raise HTTPException(status_code=404, detail="Deck not found in this subject")
    db.delete(deck)
    db.commit()
    return {"message": "Deck deleted"}
