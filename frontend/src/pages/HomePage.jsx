import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="card p-10 md:p-12">
          <p className="kicker">Study app • Decks • Quizzes</p>
          <h1 className="title text-4xl md:text-5xl font-semibold tracking-tight mt-3 text-center">
            Jason’s Flashcard Learning App
          </h1>
          <p className="muted mt-4 text-center text-base md:text-lg">
            Create subjects, organize decks, add flashcards, and quiz yourself
            with AI-generated multiple choice options.
          </p>

          <div className="mt-6 flex flex-wrap gap-2 justify-center">
            <span className="badge">React</span>
            <span className="badge">FastAPI</span>
            <span className="badge">PostgreSQL</span>
            <span className="badge">OpenAI API</span>
          </div>

          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <button className="btn btn-primary" onClick={() => navigate("/subjects")}>
              Open Subjects
            </button>
            <a
              className="btn btn-ghost"
              href="http://127.0.0.1:8000/docs"
              target="_blank"
              rel="noreferrer"
            >
              API Docs
            </a>
          </div>
        </div>

        <div className="card mt-6 p-8">
          <div className="title text-2xl font-semibold text-center">How to use</div>
          <ol className="muted mt-4 max-w-xl mx-auto list-decimal pl-6 space-y-1">
            <li>Create a Subject</li>
            <li>Add a Deck</li>
            <li>Add Flashcards</li>
            <li>Study or Run a Quiz</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
