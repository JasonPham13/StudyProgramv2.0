from sqlalchemy import Column, Integer, String, DateTime, Text, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from db.database import Base

class FlashcardJob(Base):
    __tablename__ = "flashcard_jobs"

    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True)
    session_id = Column(String, index=True)

    question = Column(Text)
    correct_answer = Column(Text)
    flashcard_id = Column(Integer, ForeignKey("flashcards.id"), nullable=True)

    status = Column(String, default="pending")
    error = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    completed_at = Column(DateTime, nullable=True)

    flashcard = relationship("Flashcard", back_populates="job")  # <-- matches Flashcard.job
