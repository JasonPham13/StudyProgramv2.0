import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
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
  const [feedback, setFeedback] = useState(null); // { correct: boolean, message: string }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [flashcards, index]);

  const loadCard = async (flashcardId) => {
    setLoadingCard(true);
    setFeedback(null);
    try {
      const payload = await getQuizQuestion(subjectId, deckId, flashcardId);
      setCurrentCard({
        id: flashcardId,
        question: payload.question ?? flashcards[index].question,
        correct_answer: payload.correct_answer ?? flashcards[index].correct_answer,
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

  const options = useMemo(() => {
    if (!currentCard) return [];
    return shuffleOptions([
      currentCard.correct_answer,
      ...currentCard.wrong_answers,
    ]).slice(0, 4);
  }, [currentCard]);

  const handleAnswer = (answer) => {
    if (!currentCard || feedback) return;

    const isCorrect = answer === currentCard.correct_answer;
    if (isCorrect) {
      setScore((s) => s + 1);
      setFeedback({ correct: true, message: "Correct." });
    } else {
      setFeedback({
        correct: false,
        message: `Not quite. Correct answer: ${currentCard.correct_answer}`,
      });
    }
  };

  const nextQuestion = () => {
    setIndex((i) => i + 1);
  };

  if (!flashcards.length) {
    return (
      <div className="card p-6">
        <p className="text-slate-700 font-medium">No flashcards in this deck.</p>
        <p className="mt-1 text-slate-600">Add flashcards first, then come back to quiz.</p>
        <button className="btn btn-primary mt-4" onClick={() => navigate(-1)}>
          Back
        </button>
      </div>
    );
  }

  if (done) {
    return (
      <div className="card p-8 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Quiz complete</h2>
        <p className="mt-2 text-slate-600">
          Score: <span className="font-semibold text-slate-900">{score}</span> / {flashcards.length}
        </p>
        <div className="mt-6 flex justify-center gap-3">
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>
            Back
          </button>
          <button className="btn btn-primary" onClick={() => window.location.reload()}>
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      <button className="text-sm text-slate-600 hover:text-slate-900" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="mt-3 flex items-end justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900">Quiz</h1>
          <p className="mt-1 text-slate-600">
            Question {index + 1} of {flashcards.length}
          </p>
        </div>
        <span className="badge">Score: {score}</span>
      </div>

      <div className="mt-6 card p-6 sm:p-8">
        {loadingCard || !currentCard ? (
          <div className="text-slate-600">Loading question…</div>
        ) : (
          <>
            <div className="flex justify-center mt-6">
  <div className="w-full max-w-3xl bg-white border rounded-2xl shadow-lg p-12 text-center">
    <div className="text-3xl md:text-4xl font-semibold">
      {currentCard.question}
    </div>
  </div>
</div>

            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {options.map((opt, i) => (
                <button
                  key={`${opt}-${i}`}
                  className={[
                    "btn btn-ghost w-full justify-start text-left px-4 py-3",
                    feedback ? "opacity-70 cursor-not-allowed" : "",
                  ].join(" ")}
                  onClick={() => handleAnswer(opt)}
                  disabled={!!feedback}
                >
                  {opt}
                </button>
              ))}
            </div>

            {feedback ? (
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div
                  className={[
                    "rounded-xl border px-4 py-3 text-sm",
                    feedback.correct
                      ? "border-emerald-200 bg-emerald-50 text-emerald-800"
                      : "border-amber-200 bg-amber-50 text-amber-900",
                  ].join(" ")}
                >
                  {feedback.message}
                </div>

                <button className="btn btn-primary" onClick={nextQuestion}>
                  Next
                </button>
              </div>
            ) : null}
          </>
        )}
      </div>
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
