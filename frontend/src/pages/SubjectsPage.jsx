import { useState, useEffect } from "react";
import { getSubjects, createSubject, deleteSubject } from "../api/subjects";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Trash2 } from "lucide-react";

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await getSubjects();
    setSubjects(res.data);
  };

  const handleAdd = async () => {
    if (!name.trim()) return;
    await createSubject({ name });
    setName("");
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    await deleteSubject(id);
    fetchSubjects();
  };

  const prev = () => {
    setCurrentIndex((i) => (i - 1 + subjects.length) % subjects.length);
  };

  const next = () => {
    setCurrentIndex((i) => (i + 1) % subjects.length);
  };

  return (
    <div className="min-h-screen flex flex-col items-center bg-gradient-to-b from-purple-200 to-indigo-400 font-serif">
      <h1 className="text-4xl font-extrabold mt-8 text-white drop-shadow-lg">
        Choose a Subject
      </h1>

      {/* Input box */}
      <div className="flex mt-6">
        <input
          className="border border-gray-300 rounded-l px-4 py-2 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="New Subject Name"
        />
        <button
          className="bg-indigo-600 text-white px-6 py-2 rounded-r hover:bg-indigo-700 transition"
          onClick={handleAdd}
        >
          Add
        </button>
      </div>

      {/* Centered Carousel */}
      <div className="flex flex-1 items-center justify-center w-full">
        <div className="flex items-center space-x-6">
          <button
            onClick={prev}
            className="p-3 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronLeft className="w-8 h-8 text-indigo-600" />
          </button>

          {subjects.length > 0 ? (
            <div className="relative w-80 h-56 flex items-center justify-center">
              <div className="bg-white rounded-2xl shadow-xl p-6 w-full h-full flex flex-col justify-between items-center transform scale-105">
            <Link
              to={`/subjects/${subjects[currentIndex].id}/decks`}
              className="text-3xl font-serif text-center text-indigo-700 hover:text-indigo-900 transition"
            >
              {subjects[currentIndex].name}
            </Link>
                <button
                  onClick={() => handleDelete(subjects[currentIndex].id)}
                  className="flex items-center text-red-500 hover:text-red-700 transition"
                >
                  <Trash2 className="w-4 h-4 mr-1" /> Delete
                </button>
              </div>
            </div>
          ) : (
            <div className="text-gray-700">No subjects yet</div>
          )}

          <button
            onClick={next}
            className="p-3 rounded-full bg-white shadow hover:bg-gray-100"
          >
            <ChevronRight className="w-8 h-8 text-indigo-600" />
          </button>
        </div>
      </div>
    </div>
  );
}
