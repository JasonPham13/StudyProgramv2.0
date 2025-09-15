from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from backend.db.database import Base

class Subject(Base):
    __tablename__ = "subjects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, unique=True, nullable=False)

    # One-to-many relationship
    decks = relationship("Deck", back_populates="subject", cascade="all, delete-orphan")
