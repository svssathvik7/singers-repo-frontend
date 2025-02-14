"use client";

import { useEffect, useState } from "react";
import GenreList from "./components/GenreList";

export default function Home() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  return (
    <div className="w-fit h-fit absolute left-0 right-0 top-0 bottom-0 m-auto min-h-screen bg-white pt-4 sm:pt-6">
      {isLoggedIn ? (
        <div className="p-4 sm:p-6 md:p-8">
          <GenreList />
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 text-center">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-black mb-4">
            SingersRepo
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 max-w-2xl mx-auto">
            The one-stop repo for all your songs, easier management and access
          </p>
          <a
            href="/auth"
            className="mt-8 px-6 py-3 bg-yellow-400 text-black font-medium rounded-lg hover:bg-yellow-500 transition-colors"
          >
            Get Started
          </a>
        </div>
      )}
    </div>
  );
}
