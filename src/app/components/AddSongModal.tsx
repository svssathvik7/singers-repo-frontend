"use client";

import { useState } from "react";
import { X } from "lucide-react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";

interface AddSongModalProps {
  isOpen: boolean;
  closeAction: () => void;
  successAction: () => void;
  genreId: string;
}

export type SongFormData = {
  songName: string;
  movieName: string;
  singerName: string;
  musicDirector: string;
  actualPitch: string;
  practisedPitch?: string;
  notes?: string;
};

export default function AddSongModal({
  isOpen,
  closeAction,
  successAction,
  genreId,
}: AddSongModalProps) {
  const [formData, setFormData] = useState<SongFormData>({
    songName: "",
    movieName: "",
    singerName: "",
    musicDirector: "",
    actualPitch: "",
    practisedPitch: "",
    notes: "",
  });
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Please login to add a song");
      }

      const userId = localStorage.getItem("userId");
      if (!userId) {
        throw new Error("User ID not found. Please login again.");
      }

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_API_URL}/genres/songs`,
        {
          ...formData,
          genreId,
          userId,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success("Song added successfully");
      setFormData({
        songName: "",
        movieName: "",
        singerName: "",
        musicDirector: "",
        actualPitch: "",
        practisedPitch: "",
        notes: "",
      });
      successAction();
      closeAction();
    } catch (error) {
      if (axios.isAxiosError(error)) {
        toast.error(error.response?.data?.message || error.message);
      } else {
        toast.error("Failed to add song");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && closeAction()}>
      <DialogContent className="sm:max-w-[425px] mt-8 md:mt-0 overflow-y-auto max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-black">
            Add New Song
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="songName">Song Name</Label>
            <Input
              id="songName"
              name="songName"
              value={formData.songName}
              onChange={handleChange}
              placeholder="Enter song name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="movieName">Movie Name</Label>
            <Input
              id="movieName"
              name="movieName"
              value={formData.movieName}
              onChange={handleChange}
              placeholder="Enter movie name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="singerName">Singer Name</Label>
            <Input
              id="singerName"
              name="singerName"
              value={formData.singerName}
              onChange={handleChange}
              placeholder="Enter singer name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="musicDirector">Music Director</Label>
            <Input
              id="musicDirector"
              name="musicDirector"
              value={formData.musicDirector}
              onChange={handleChange}
              placeholder="Enter music director name"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="actualPitch">Actual Pitch</Label>
            <Input
              id="actualPitch"
              name="actualPitch"
              value={formData.actualPitch}
              onChange={handleChange}
              placeholder="Enter actual pitch"
              required
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="practisedPitch">Practised Pitch (Optional)</Label>
            <Input
              id="practisedPitch"
              name="practisedPitch"
              value={formData.practisedPitch}
              onChange={handleChange}
              placeholder="Enter practised pitch"
              disabled={isLoading}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Input
              id="notes"
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              placeholder="Enter any notes"
              disabled={isLoading}
            />
          </div>

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-black"
          >
            {isLoading ? "Adding Song..." : "Add Song"}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
