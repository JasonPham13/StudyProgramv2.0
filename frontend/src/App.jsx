import { BrowserRouter, Routes, Route } from "react-router-dom";
import AppShell from "./components/AppShell";

import HomePage from "./pages/HomePage";
import SubjectsPage from "./pages/SubjectsPage";
import DecksPage from "./pages/DecksPage";
import FlashcardsPage from "./pages/FlashcardsPage";
import QuizPage from "./pages/QuizPage";

export default function App() {
  return (
    <BrowserRouter>
      <AppShell>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/subjects" element={<SubjectsPage />} />
          <Route path="/subjects/:subjectId/decks" element={<DecksPage />} />
          <Route
            path="/subjects/:subjectId/decks/:deckId/flashcards"
            element={<FlashcardsPage />}
          />
          <Route path="/quiz/:subjectId/:deckId" element={<QuizPage />} />
        </Routes>
      </AppShell>
    </BrowserRouter>
  );
}
