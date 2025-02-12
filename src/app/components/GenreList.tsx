"use client";

import { useState, useEffect } from "react";
import { Plus } from "lucide-react";
import axios from "axios";
import CreateGenreModal from "./CreateGenreModal";
import toast from "react-hot-toast";
import AddSongModal from "./AddSongModal";
import { useRouter } from "next/navigation";

interface Song {
  _id: string;
  songName: string;
  movieName: string;
  singerName: string;
  musicDirector: string;
  actualPitch: string;
  practisedPitch?: string;
  notes?: string;
}

interface Genre {
  _id: string;
  title: string;
  user: string;
  songs: Song[];
  createdAt: string;
  updatedAt: string;
}

export default function GenreList() {
  const router = useRouter();
  const [genres, setGenres] = useState<Genre[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedGenreId, setSelectedGenreId] = useState<string>("");
  const [expandedGenreIds, setExpandedGenreIds] = useState<Set<string>>(
    new Set()
  );
  const [isAddSongModalOpen, setIsAddSongModalOpen] = useState(false);

  const fetchGenres = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to view genres");
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = await axios.get(
        `${process.env.NEXT_PUBLIC_API_URL}/genres/user/${userId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = response.data;
      console.log(data);
      setGenres(data.genres);
    } catch (error) {
      console.error("Error fetching genres:", error);
      if (axios.isAxiosError(error)) {
        const message = error.response?.data?.message || error.message;
        toast.error(message);
      } else {
        toast.error("Failed to fetch genres");
      }
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

  const handleGenreClick = (genreId: string, songs: Song[], title: string) => {
    const encodedData = encodeURIComponent(JSON.stringify({ songs, title }));
    router.push(`/genre/${genreId}?songs=${encodedData}`);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-black">Your Music Genres</h1>
        <button
          className="inline-flex items-center px-6 py-3 bg-yellow-400 hover:bg-yellow-500 text-black font-medium rounded-lg transition-colors duration-200 gap-2 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          onClick={() => setIsModalOpen(true)}
        >
          <Plus className="h-5 w-5" />
          Create Genre
        </button>
      </div>

      {genres.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 px-4">
          <p className="text-lg text-gray-600 text-center">
            You haven't created any genres yet. Start organizing your music by
            creating your first genre!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {genres.map((genre) => (
            <div
              key={genre._id}
              className="bg-white border-2 border-gray-100 rounded-xl p-6 hover:border-yellow-400 transition-all duration-200 shadow-sm hover:shadow-md group cursor-pointer"
              onClick={() =>
                handleGenreClick(genre._id, genre.songs, genre.title)
              }
            >
              <h3 className="text-xl font-semibold text-black group-hover:text-yellow-600 mb-2">
                {genre.title}
              </h3>
              <p className="text-gray-600 mb-4">{genre.songs.length} songs</p>
              <div className="flex flex-col gap-4">
                {expandedGenreIds.has(genre._id) && genre.songs.length > 0 && (
                  <div className="space-y-3 mb-4 bg-gray-50 p-4 rounded-lg overflow-y-auto max-h-[300px] scrollbar-thin scrollbar-thumb-yellow-400 scrollbar-track-gray-100">
                    {genre.songs.map((song) => (
                      <div
                        key={song._id}
                        className="bg-white p-3 rounded-md shadow-sm border border-gray-100"
                      >
                        <div className="flex justify-between items-start mb-2">
                          <h4 className="font-medium text-black">
                            {song.songName}
                          </h4>
                          <div className="flex items-center gap-2 text-sm">
                            <span className="text-gray-700">
                              {song.actualPitch}
                            </span>
                            {song.practisedPitch && (
                              <>
                                <span className="text-yellow-600">→</span>
                                <span className="text-gray-700">
                                  {song.practisedPitch}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Movie: {song.movieName}</p>
                          <p>Singer: {song.singerName}</p>
                          <p>Music Director: {song.musicDirector}</p>
                          {song.practisedPitch && (
                            <p>Practised Pitch: {song.practisedPitch}</p>
                          )}
                          {song.notes && <p>Notes: {song.notes}</p>}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      Created {new Date(genre.createdAt).toLocaleDateString()}
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setExpandedGenreIds((prev) => {
                          const newSet = new Set(prev);
                          if (newSet.has(genre._id)) {
                            newSet.delete(genre._id);
                          } else {
                            newSet.add(genre._id);
                          }
                          return newSet;
                        });
                      }}
                      className="text-yellow-600 hover:text-yellow-700 transition-colors duration-200"
                    >
                      {expandedGenreIds.has(genre._id)
                        ? "Hide Details ↑"
                        : "View Details ↓"}
                    </button>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedGenreId(genre._id);
                      setIsAddSongModalOpen(true);
                    }}
                    className="w-full py-2 px-4 bg-yellow-400 hover:bg-yellow-500 text-black rounded-md transition-colors duration-200 text-sm font-medium"
                  >
                    Add Songs
                  </button>
                </div>
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
      <AddSongModal
        isOpen={isAddSongModalOpen}
        closeAction={() => {
          setIsAddSongModalOpen(false);
          setSelectedGenreId("");
        }}
        successAction={() => {
          fetchGenres();
          setIsAddSongModalOpen(false);
          setSelectedGenreId("");
        }}
        genreId={selectedGenreId}
      />
    </div>
  );
}
