import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getSubjects, createSubject, deleteSubject } from "../api/subjects";

export default function SubjectsPage() {
  const navigate = useNavigate();
  const [subjects, setSubjects] = useState([]);
  const [name, setName] = useState("");

  useEffect(() => {
    fetchSubjects();
  }, []);

  const fetchSubjects = async () => {
    const res = await getSubjects();
    setSubjects(res.data);
  };

  const handleAdd = async (e) => {
    e?.preventDefault?.();
    if (!name.trim()) return;
    await createSubject({ name });
    setName("");
    fetchSubjects();
  };

  const handleDelete = async (id) => {
    await deleteSubject(id);
    fetchSubjects();
  };

  const hasSubjects = useMemo(() => subjects.length > 0, [subjects]);

  return (
    <div className="flex justify-center">
      <div className="w-full max-w-4xl">
        <p className="kicker">FLASHCARDS</p>
        <h1 className="title text-4xl font-semibold tracking-tight mt-2 text-center">
          Subjects
        </h1>
        <p className="muted mt-3 text-center">
          Create a subject, then add decks and flashcards.
        </p>

        <div className="card mt-8 p-6">
          <form onSubmit={handleAdd} className="flex flex-col sm:flex-row gap-3">
            <input
              className="input flex-1"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="New subject name"
            />
            <button type="submit" className="btn btn-primary">
              Add Subject
            </button>
          </form>
        </div>

        <div className="mt-6 space-y-4">
          {!hasSubjects ? (
            <div className="card p-10 text-center">
              <div className="title text-xl font-semibold">No subjects yet</div>
              <p className="muted mt-2">
                Add one above to start organizing your decks.
              </p>
            </div>
          ) : (
            subjects.map((s) => (
              <div key={s.id} className="card card-hover p-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                  <div>
                    <div className="title text-xl font-semibold">{s.name}</div>
                    <p className="muted mt-1">
                      Organize your decks under this subject.
                    </p>
                  </div>

                  <div className="flex gap-2">
                    <button
                      className="btn btn-ghost"
                      onClick={() => navigate(`/subjects/${s.id}/decks`)}
                    >
                      Open
                    </button>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDelete(s.id)}
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
