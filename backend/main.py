from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from backend.core.config import settings
from backend.routers import subject, deck, flashcards
from backend.db.database import create_tables
create_tables()

app = FastAPI(
    title="Jason's Study Program",
    description="API to generate flashcards and study better",
    version="0.1.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000",
                   "http://localhost:5173"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(subject.router, prefix=settings.API_PREFIX)
app.include_router(deck.router, prefix=settings.API_PREFIX)
app.include_router(flashcards.router, prefix=settings.API_PREFIX)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
