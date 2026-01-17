import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getFlashcards, createFlashcard, deleteFlashcard } from "../api/flashcards";

export default function FlashcardsPage() {
  const { subjectId, deckId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  const [index, setIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  useEffect(() => {
    fetchFlashcards();
  }, [subjectId, deckId]);

  useEffect(() => {
    setShowAnswer(false);
  }, [index]);

  const fetchFlashcards = async () => {
    const res = await getFlashcards(subjectId, deckId);
    setFlashcards(res.data);
    setIndex(0);
    setShowAnswer(false);
  };

  const total = flashcards.length;

  const current = useMemo(() => {
    if (!total) return null;
    return flashcards[Math.min(index, total - 1)];
  }, [flashcards, index, total]);

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    if (!question.trim() || !correctAnswer.trim()) return;

    await createFlashcard(subjectId, deckId, {
      question,
      correct_answer: correctAnswer,
    });

    setQuestion("");
    setCorrectAnswer("");
    fetchFlashcards();
  };

  const handleDelete = async (flashcardId) => {
    await deleteFlashcard(subjectId, deckId, flashcardId);
    fetchFlashcards();
  };

  const prev = () => setIndex((i) => Math.max(0, i - 1));
  const next = () => setIndex((i) => Math.min(total - 1, i + 1));

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-5xl">
        <div className="flex items-center justify-between">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span className="badge">
            Deck #{deckId} • {total} cards
          </span>
        </div>

        <p className="kicker mt-6 text-center">FLASHCARDS</p>
        <h1 className="title text-4xl font-semibold tracking-tight mt-2 text-center">
          Study
        </h1>
        <p className="muted mt-3 text-center">
          Click the card to reveal the answer.
        </p>

        {/* Add flashcard */}
        <div className="card mt-8 p-6">
          <form onSubmit={handleAdd} className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              className="input"
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="Question"
            />
            <input
              className="input"
              value={correctAnswer}
              onChange={(e) => setCorrectAnswer(e.target.value)}
              placeholder="Correct answer"
            />
            <button type="submit" className="btn btn-primary">
              Add Flashcard
            </button>
          </form>
        </div>

        {/* Big centered square flashcard */}
        <div className="mt-10 flex justify-center">
          <div className="w-full flex justify-center">
            {total === 0 ? (
              <div className="card p-12 text-center w-full max-w-3xl">
                <div className="title text-xl font-semibold">No flashcards yet</div>
                <p className="muted mt-2">Add your first card above to start studying.</p>
              </div>
            ) : (
              <div
                className="card card-hover"
                style={{
                  width: "min(40vh, 500px)",
                  height: "min(40vh, 500px)",
                }}
              >
                <button
                  type="button"
                  onClick={() => setShowAnswer((s) => !s)}
                  className="w-full h-full rounded-[18px] p-10 text-center flex flex-col justify-center items-center"
                  style={{ background: "transparent", border: "none", color: "inherit" }}
                >
                  <div className="flex items-center justify-between w-full mb-8">
                    <span className="badge">{index + 1} / {total}</span>
                    <span className="muted text-sm">
                      {showAnswer ? "Showing answer" : "Showing question"}
                    </span>
                  </div>

                  <div className="title 4xl md:text-5xl font-semibold tracking-tight">
                    {showAnswer ? current.correct_answer : current.question}
                  </div>

                  <div className="muted mt-6">
                    Click to {showAnswer ? "hide answer" : "reveal answer"}
                  </div>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Controls */}
        {total > 0 && (
          <div className="mt-6 flex items-center justify-between">
            <button className="btn btn-ghost" onClick={prev} disabled={index === 0}>
              ← Prev
            </button>

            <span className="badge">Tap card to flip</span>

            <button
              className="btn btn-primary"
              onClick={next}
              disabled={index === total - 1}
            >
              Next →
            </button>
          </div>
        )}

        {/* Manage list */}
        {total > 0 && (
          <div className="card mt-10 p-6">
            <div className="title text-lg font-semibold">Manage flashcards</div>
            <p className="muted mt-1">
              Delete anything incorrect.
            </p>

            <div className="mt-4 space-y-3">
              {flashcards.map((f) => (
                <div
                  key={f.id}
                  className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border border-white/10 rounded-2xl bg-white/5 p-4"
                >
                  <div>
                    <div className="title font-semibold">{f.question}</div>
                    <div className="muted mt-1">Answer: {f.correct_answer}</div>
                  </div>
                  <button className="btn btn-danger" onClick={() => handleDelete(f.id)}>
                    Delete
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
