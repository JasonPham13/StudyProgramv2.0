import { useNavigate } from "react-router-dom";

export default function HomePage() {
  const navigate = useNavigate();

  return (
    <div className="h-screen flex justify-center items-center bg-gradient-to-b from-blue-200 to-blue-400">
      <div className="flex flex-col items-center text-center space-y-8">
        <h1 className="text-4xl md:text-6xl font-bold text-white drop-shadow-lg">
          Jason&apos;s Study Program
        </h1>
        <button
          onClick={() => navigate("/subjects")}
          className="bg-white text-blue-600 font-semibold px-8 py-4 rounded-lg shadow-lg hover:bg-blue-100 transition"
        >
          Click Here to Begin
        </button>
      </div>
    </div>
  );
}
