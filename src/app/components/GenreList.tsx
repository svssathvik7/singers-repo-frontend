"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import CreateGenreModal from "./CreateGenreModal";

interface Genre {
  _id: string;
  title: string;
  user: string;
  songs: string[];
  createdAt: string;
  updatedAt: string;
}

export default function GenreList() {
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to view genres");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/genres`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGenres();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-yellow-400"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-black">Your Music Genres</h1>

      {genres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-lg text-gray-600 mb-6 text-center">
            You haven't created any genres yet. Start organizing your music by
            creating your first genre!
          </p>
          <button
            className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200 gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            onClick={() => setIsModalOpen(true)}
          >
            <Plus className="h-5 w-5" />
            Create Genre
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
            <div
              key={genre._id}
              className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md cursor-pointer group"
            >
              <h3 className="text-xl font-semibold text-black group-hover:text-yellow-600 mb-2">
                {genre.title}
              </h3>
              <p className="text-gray-600 mb-4">{genre.songs.length} songs</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>
                  Created {new Date(genre.createdAt).toLocaleDateString()}
                </span>
                <span className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 text-yellow-600">
                  View Details →
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      <CreateGenreModal
        isOpen={isModalOpen}
        closeAction={() => setIsModalOpen(false)}
        successAction={() => {
          fetchGenres();
          setIsModalOpen(false);
        }}
      />
    </div>
  );
}
