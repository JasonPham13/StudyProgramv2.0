// src/api/quiz.js
import axios from "axios";
const API_URL = "http://localhost:8000/api";

/**
 * Request one quiz payload for a single flashcard, including generated fake answers.
 * Backend endpoint expected: GET /api/quiz/{flashcardId}
 */
export const getQuizQuestion = async (subjectId, deckId, flashcardId) => {
  const { data } = await axios.get(
    `${API_URL}/subjects/${subjectId}/decks/${deckId}/flashcards/quiz/${flashcardId}`
  );
  return data;
};
