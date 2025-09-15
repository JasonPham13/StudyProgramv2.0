// src/pages/DecksPage.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
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
    try {
      const res = await getDecks(subjectId);
      setDecks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleAdd = async () => {
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
    <div className="min-h-screen flex flex-col items-center bg-gray-100 py-12">
      <button
        className="self-start mb-6 text-blue-600 hover:underline"
        onClick={() => navigate(-1)}
      >
        ← Back
      </button>

      <h1 className="text-3xl font-serif font-bold mb-6 text-gray-800 text-center">
        Decks
      </h1>

      <div className="flex mb-8 w-full max-w-md">
        <input
          className="border border-gray-300 rounded-l px-4 py-2 w-full focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Deck Name"
        />
        <button
          className="bg-green-600 text-white px-6 py-2 rounded-r hover:bg-green-700 transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-md">
        {decks.map((d) => (
          <li
            key={d.id}
            className="flex justify-between items-center bg-white p-4 mb-3 rounded shadow hover:shadow-md transition"
          >
            <Link
              to={`/subjects/${subjectId}/decks/${d.id}/flashcards`}
              className="text-blue-600 font-serif font-medium"
            >
              {d.name}
            </Link>
            <div className="flex gap-2">
              <Link
                to={`/quiz/${subjectId}/${d.id}`}
                className="bg-indigo-500 text-white px-3 py-1 rounded hover:bg-indigo-600 transition"
              >
                Quiz
              </Link>
              <button
                className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(d.id)}
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
