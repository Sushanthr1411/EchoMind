"use client";

import React, { useEffect, useState } from "react";

export function DarkModeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    const darkModeEnabled = document.documentElement.classList.contains("dark");
    setIsDarkMode(darkModeEnabled);
  }, []);

  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
    } else {
      document.documentElement.classList.add("dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <button
      onClick={toggleDarkMode}
      className="p-2 rounded-full border border-gray-300 bg-gray-100 dark:bg-gray-800 dark:border-gray-600 shadow-md"
      aria-label="Toggle Dark Mode"
    >
      {isDarkMode ? "🌙" : "☀️"}
    </button>
  );
}
