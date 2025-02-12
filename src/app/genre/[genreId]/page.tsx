"use client";

import { useEffect, useState } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SongFormData } from "@/app/components/AddSongModal";

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
  const [filteredSongs, setFilteredSongs] = useState<Song[]>([]);
  const [selectedMusicDirector, setSelectedMusicDirector] = useState<string>(
    ""
  );
  const [selectedSinger, setSelectedSinger] = useState<string>("");
  const [uniqueMusicDirectors, setUniqueMusicDirectors] = useState<string[]>(
    []
  );
  const [uniqueSingers, setUniqueSingers] = useState<string[]>([]);
  const [genreTitle, setGenreTitle] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (songsParam) {
      try {
        const parsedData = JSON.parse(decodeURIComponent(songsParam));
        const songsData = parsedData.songs || [];
        setSongs(songsData);
        setFilteredSongs(songsData);
        setGenreTitle(parsedData.title || "");

        // Extract unique music directors and singers
        const musicDirectors: string[] = [
          ...new Set<string>(
            songsData.map((song: SongFormData) => song.musicDirector)
          ),
        ];
        const singers = [
          ...new Set<string>(
            songsData.map((song: SongFormData) => song.singerName)
          ),
        ];
        setUniqueMusicDirectors(musicDirectors);
        setUniqueSingers(singers);
      } catch (error) {
        console.error("Error parsing songs data:", error);
      }
    }
    setIsLoading(false);
  }, [songsParam]);

  useEffect(() => {
    let filtered = [...songs];

    if (selectedMusicDirector && selectedMusicDirector !== "all") {
      filtered = filtered.filter(
        (song) => song.musicDirector === selectedMusicDirector
      );
    }

    if (selectedSinger && selectedSinger !== "all") {
      filtered = filtered.filter((song) => song.singerName === selectedSinger);
    }

    setFilteredSongs(filtered);
  }, [selectedMusicDirector, selectedSinger, songs]);

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
      <div className="flex flex-col sm:flex-row gap-4 mb-6">
        <div className="flex-1">
          <Select
            value={selectedMusicDirector}
            onValueChange={setSelectedMusicDirector}
          >
            <SelectTrigger className="w-full bg-white border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Filter by Music Director" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Music Directors</SelectItem>
              {uniqueMusicDirectors.map((director) => (
                <SelectItem key={director} value={director}>
                  {director}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Select value={selectedSinger} onValueChange={setSelectedSinger}>
            <SelectTrigger className="w-full bg-white border-yellow-400 focus:ring-yellow-400">
              <SelectValue placeholder="Filter by Singer" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Singers</SelectItem>
              {uniqueSingers.map((singer) => (
                <SelectItem key={singer} value={singer}>
                  {singer}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 md:gap-6">
        {filteredSongs.map((song) => (
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
