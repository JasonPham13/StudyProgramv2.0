// src/pages/QuizPage.jsx
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getFlashcards } from "../api/flashcards";
import { getQuizQuestion } from "../api/quiz";

export default function QuizPage() {
  const { subjectId, deckId } = useParams();
  const navigate = useNavigate();

  const [flashcards, setFlashcards] = useState([]);
  const [index, setIndex] = useState(0);
  const [loadingCard, setLoadingCard] = useState(false);
  const [currentCard, setCurrentCard] = useState(null);
  const [score, setScore] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await getFlashcards(subjectId, deckId);
        setFlashcards(res.data);
      } catch (err) {
        console.error("Failed to load flashcards", err);
      }
    };
    load();
  }, [subjectId, deckId]);

  useEffect(() => {
    if (flashcards.length && index < flashcards.length) {
      loadCard(flashcards[index].id);
    } else if (index >= flashcards.length && flashcards.length > 0) {
      setDone(true);
    }
  }, [flashcards, index]);

  const loadCard = async (flashcardId) => {
    setLoadingCard(true);
    try {
      const payload = await getQuizQuestion(subjectId, deckId, flashcardId);
      setCurrentCard({
        id: flashcardId,
        question: payload.question ?? flashcards[index].question,
        correct_answer: payload.correct_answer,
        wrong_answers: payload.fake_answers || [],
      });
    } catch (err) {
      console.error("Failed to get quiz data", err);
      const fc = flashcards[index];
      setCurrentCard({
        id: fc.id,
        question: fc.question,
        correct_answer: fc.correct_answer,
        wrong_answers: [],
      });
    } finally {
      setLoadingCard(false);
    }
  };

  const handleAnswer = (answer) => {
    if (!currentCard) return;
    if (answer === currentCard.correct_answer) {
      setScore((s) => s + 1);
      alert("Correct!");
    } else {
      alert(`Wrong — correct: ${currentCard.correct_answer}`);
    }
    setIndex((i) => i + 1);
  };

  if (!flashcards.length) return <div className="p-6">No flashcards in this deck.</div>;
  if (done) {
    return (
      <div className="h-screen flex flex-col justify-center items-center">
        <h2 className="text-3xl font-bold">Quiz Complete 🎉</h2>
        <p className="mt-4 text-xl">Score: {score} / {flashcards.length}</p>
        <button
          className="mt-6 px-6 py-3 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700"
          onClick={() => navigate(-1)}
        >
          Back
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col justify-center items-center bg-gray-50 p-6">
      <div className="absolute top-4 left-4">
        <button className="text-sm text-blue-600" onClick={() => navigate(-1)}>
          ← Back
        </button>
      </div>

      <h1 className="text-2xl font-bold mb-6">Quiz</h1>

      {loadingCard || !currentCard ? (
        <div>Loading question...</div>
      ) : (
        <div className="flex flex-col items-center space-y-6 w-full max-w-xl">
          {/* Flashcard question */}
          <div className="w-full bg-white border rounded-2xl shadow-lg p-10 text-center text-xl font-semibold">
            {currentCard.question}
          </div>

          {/* Multiple choice answers */}
          <div className="grid grid-cols-2 gap-4 w-full">
            {shuffleOptions([
              currentCard.correct_answer,
              ...currentCard.wrong_answers,
            ]).map((opt, i) => {
              const colors = [
                "bg-red-500 hover:bg-red-600",
                "bg-blue-500 hover:bg-blue-600",
                "bg-green-500 hover:bg-green-600",
                "bg-yellow-500 hover:bg-yellow-600 text-black",
              ];
              return (
                <button
                  key={i}
                  className={`p-6 rounded-xl text-white font-bold shadow-md transition ${colors[i % colors.length]}`}
                  onClick={() => handleAnswer(opt)}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Progress */}
          <div className="mt-4 text-gray-600 font-medium">
            Question {index + 1} / {flashcards.length}
          </div>
        </div>
      )}
    </div>
  );
}

function shuffleOptions(arr) {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
