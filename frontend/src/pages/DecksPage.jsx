import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { getDecks, createDeck, deleteDeck } from "../api/decks";

export default function DecksPage() {
  const { subjectId } = useParams();
  const navigate = useNavigate();

  const [decks, setDecks] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchDecks();
  }, [subjectId]);

  const fetchDecks = async () => {
    const res = await getDecks(subjectId);
    setDecks(res.data);
  };

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return;
    await createDeck(subjectId, { name });
    setName("");
    fetchDecks();
  };

  const handleDelete = async (deckId) => {
    await deleteDeck(subjectId, deckId);
    fetchDecks();
  };

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            ← Back
          </button>
          <span className="badge">Subject #{subjectId}</span>
        </div>

        <p className="kicker mt-6 text-center">FLASHCARDS</p>
        <h1 className="title text-4xl font-semibold tracking-tight mt-2 text-center">
          Decks
        </h1>
        <p className="muted mt-3 text-center">
          Add decks under this subject, then create flashcards and study.
        </p>

        <div className="card mt-8 p-6">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              className="input flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New deck name"
            />
            <button type="submit" className="btn btn-primary">
              Add Deck
            </button>
          </form>
        </div>

        <div className="mt-6 space-y-4">
          {decks.length === 0 ? (
            <div className="card p-10 text-center">
              <div className="title text-xl font-semibold">No decks yet</div>
              <p className="muted mt-2">Create one above to start.</p>
            </div>
          ) : (
            decks.map((d) => (
              <div key={d.id} className="card card-hover p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="title text-xl font-semibold">{d.name}</div>
                    <p className="muted mt-1">
                      Manage flashcards and run quizzes for this deck.
                    </p>
                  </div>

                  <div className="flex flex-wrap gap-2">
                    <button
                      className="btn btn-ghost"
                      onClick={() =>
                        navigate(`/subjects/${subjectId}/decks/${d.id}/flashcards`)
                      }
                    >
                      Flashcards
                    </button>

                    <button
                      className="btn btn-primary"
                      onClick={() => navigate(`/quiz/${subjectId}/${d.id}`)}
                    >
                      Quiz
                    </button>

                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(d.id)}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
