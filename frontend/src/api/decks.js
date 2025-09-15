import axios from "axios";
const API_URL = "http://localhost:8000/api";

export const getDecks = (subjectId) => axios.get(`${API_URL}/subjects/${subjectId}/decks`);
export const createDeck = (subjectId, data) =>
  axios.post(`${API_URL}/subjects/${subjectId}/decks`, data);
export const deleteDeck = (subjectId, deckId) =>
  axios.delete(`${API_URL}/subjects/${subjectId}/decks/${deckId}`);
