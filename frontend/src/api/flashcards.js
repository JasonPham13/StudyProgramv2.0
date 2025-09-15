import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const getFlashcards = (subjectId, deckId) =>
  axios.get(`${API_URL}/subjects/${subjectId}/decks/${deckId}/flashcards`);
export const createFlashcard = (subjectId, deckId, data) =>
  axios.post(`${API_URL}/subjects/${subjectId}/decks/${deckId}/flashcards`, data);
export const deleteFlashcard = (subjectId, deckId, flashcardId) =>
  axios.delete(`${API_URL}/subjects/${subjectId}/decks/${deckId}/flashcards/${flashcardId}`);
