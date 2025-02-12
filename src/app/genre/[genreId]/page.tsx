"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";

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

interface GenreData {
  songs: Song[];
  title: string;
}

export default function GenrePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const songsParam = searchParams.get("songs");
  const [songs, setSongs] = useState<Song[]>([]);
  const [genreTitle, setGenreTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (songsParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(songsParam));
        setSongs(parsedData.songs || []);
        setGenreTitle(parsedData.title || "");
      } catch (error) {
        console.error("Error parsing songs data:", error);
      }
    }
    setIsLoading(false);
  }, [songsParam]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-yellow-400" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-4 sm:py-6 md:py-8 px-2 sm:px-4 md:px-6">
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6 md:mb-8 text-center">
        {genreTitle} Songs
      </h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {songs.map((song) => (
          <Card
            key={song._id}
            className="bg-white shadow-lg hover:shadow-xl transition-shadow"
          >
            <CardHeader className="p-4 sm:p-6">
              <CardTitle className="text-lg sm:text-xl font-bold text-black">
                {song.songName}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-600 p-4 sm:p-6 pt-0">
              <p>
                <span className="font-semibold">Movie:</span> {song.movieName}
              </p>
              <p>
                <span className="font-semibold">Singer:</span> {song.singerName}
              </p>
              <p>
                <span className="font-semibold">Music Director:</span>{" "}
                {song.musicDirector}
              </p>
              <p>
                <span className="font-semibold">Actual Pitch:</span>{" "}
                {song.actualPitch}
              </p>
              {song.practisedPitch && (
                <p>
                  <span className="font-semibold">Practised Pitch:</span>{" "}
                  {song.practisedPitch}
                </p>
              )}
              {song.notes && (
                <p>
                  <span className="font-semibold">Notes:</span> {song.notes}
                </p>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
