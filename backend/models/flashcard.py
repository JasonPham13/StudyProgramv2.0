from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Flashcard(Base):
    __tablename__ = "flashcards"

    id = Column(Integer, primary_key=True, index=True)
    question = Column(String, nullable=False)
    correct_answer = Column(String, nullable=False)
    deck_id = Column(Integer, ForeignKey("decks.id"))

    # Relationships
    deck = relationship("Deck", back_populates="flashcards")
    job = relationship("FlashcardJob", back_populates="flashcard", uselist=False)  # <-- added here
