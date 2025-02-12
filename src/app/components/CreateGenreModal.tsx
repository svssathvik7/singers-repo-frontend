"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";

interface CreateGenreModalProps {
  isOpen: boolean;
  closeAction: () => void;
  successAction: () => void;
}

export default function CreateGenreModal({
  isOpen,
  closeAction,
  successAction,
}: CreateGenreModalProps) {
  const [title, setTitle] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to create a genre");
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = (
        await axios.post(
          `${process.env.NEXT_PUBLIC_API_URL}/genres`,
          {
            title,
            userId,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        )
      ).data;
      console.log(response);

      setTitle("");
      successAction();
      closeAction();
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(
          err.response?.data?.message || err.message || "An error occurred"
        );
      } else {
        setError(err instanceof Error ? err.message : "An error occurred");
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-start md:items-center justify-center p-4 z-50 overflow-y-auto">
      <div className="bg-white rounded-lg w-full max-w-md p-6 relative my-8 md:my-0">
        <button
          onClick={closeAction}
          className="absolute right-4 top-4 text-gray-500 hover:text-gray-700"
        >
          <X className="h-6 w-6" />
        </button>

        <h2 className="text-2xl font-bold text-black mb-6">Create New Genre</h2>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md mb-4">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label
              htmlFor="title"
              className="text-sm font-medium text-gray-700"
            >
              Genre Title
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter genre title"
              className="w-full px-3 py-2 border rounded-md bg-white text-black border-gray-300 focus:outline-none focus:ring-2 focus:ring-yellow-400 focus:border-transparent"
              required
              disabled={isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`w-full py-2 px-4 rounded-md text-black font-medium transition-colors duration-200 ${
              isLoading
                ? "bg-yellow-200 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            }`}
          >
            {isLoading ? "Creating..." : "Create Genre"}
          </button>
        </form>
      </div>
    </div>
  );
}
