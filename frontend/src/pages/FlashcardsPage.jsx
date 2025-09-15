// src/pages/FlashcardsPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcards, createFlashcard, deleteFlashcard } from "../api/flashcards";

export default function FlashcardsPage() {
  const { subjectId, deckId } = useParams();
  const navigate = useNavigate();
  const [flashcards, setFlashcards] = useState([]);
  const [question, setQuestion] = useState("");
  const [correctAnswer, setCorrectAnswer] = useState("");

  useEffect(() => {
    fetchFlashcards();
  }, [subjectId, deckId]);

  const fetchFlashcards = async () => {
    try {
      const res = await getFlashcards(subjectId, deckId);
      setFlashcards(res.data);
    } catch (err) {
      console.error("Failed to fetch flashcards", err);
    }
  };

  const handleAdd = async () => {
    if (!question.trim() || !correctAnswer.trim()) return;
    try {
      await createFlashcard(subjectId, deckId, {
        question,
        correct_answer: correctAnswer,
      });
      setQuestion("");
      setCorrectAnswer("");
      fetchFlashcards();
    } catch (err) {
      console.error("Create flashcard failed", err);
    }
  };
  
  const handleDelete = async (flashcardId) => {
    try {
      await deleteFlashcard(subjectId, deckId, flashcardId);
      fetchFlashcards();
    } catch (err) {
      console.error("Delete failed", err);
    }
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
        Flashcards
      </h1>

      <div className="flex mb-8 w-full max-w-2xl gap-2">
        <input
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Question"
        />
        <input
          className="border border-gray-300 rounded px-4 py-2 flex-1 focus:outline-none focus:ring-2 focus:ring-blue-400"
          value={correctAnswer}
          onChange={(e) => setCorrectAnswer(e.target.value)}
          placeholder="Correct Answer"
        />
        <button
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      <ul className="w-full max-w-2xl">
        {flashcards.map((f) => (
          <li
            key={f.id}
            className="mb-4 bg-white p-4 rounded shadow hover:shadow-md transition"
          >
            <div className="font-serif font-semibold text-lg">{f.question}</div>
            <div className="text-sm text-gray-700 mt-1">
              Answer: {f.correct_answer}
            </div>
            <div className="mt-3 flex gap-2">
              <button
                className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 transition"
                onClick={() => handleDelete(f.id)}
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
