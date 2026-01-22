import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Board from "./features/board/Board";
import CreateTask from "./features/tasks/CreateTask";

const App: React.FC = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-100">
        <ToastContainer position="top-right" autoClose={3000} />
        <nav className="bg-white shadow-sm p-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <Link to="/" className="text-xl font-bold text-gray-800">
              Kanban App
            </Link>
            <Link
              to="/create"
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
            >
              + New Task
            </Link>
          </div>
        </nav>
        <main className="max-w-7xl mx-auto p-4">
          <Routes>
            <Route path="/" element={<Board />} />
            <Route path="/create" element={<CreateTask />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
};

export default App;
