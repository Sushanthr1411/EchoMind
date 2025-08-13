import React, { useState, useEffect } from "react";

type Props = {
  transcript: string; // The full transcript passed as a prop
};

export function SearchAndAsk({ transcript }: Props) {
  const [query, setQuery] = useState("");
  const [filteredTranscript, setFilteredTranscript] = useState<string | null>(null);
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Debounce logic
  useEffect(() => {
    const handler = setTimeout(() => {
      if (query.endsWith("?")) {
        askQuestion(query);
      } else {
        searchTranscript(query);
      }
    }, 500);

    return () => clearTimeout(handler); // Cleanup on query change
  }, [query]);

  // Function to handle search queries
  const searchTranscript = (searchText: string) => {
    setAnswer(null); // Clear any previous answer
    setError(null); // Clear any previous error

    if (!searchText.trim()) {
      setFilteredTranscript(null); // Reset if query is empty
      return;
    }

    // Highlight matching parts in the transcript
    const regex = new RegExp(searchText, "gi");
    const highlighted = transcript.replace(regex, (match) => `<mark>${match}</mark>`);
    setFilteredTranscript(highlighted);
  };

  // Function to handle questions
  const askQuestion = async (question: string) => {
    setFilteredTranscript(null); // Clear any previous filtered transcript
    setAnswer(null); // Clear any previous answer
    setError(null); // Clear any previous error
    setLoading(true);

    try {
      const res = await fetch("/ask-question", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, transcript }),
      });

      if (!res.ok) {
        const errText = await res.text();
        throw new Error(`Server error: ${res.status} ${errText}`);
      }

      const data = await res.json();
      setAnswer(data.answer); // Display the answer
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search transcript or ask a question"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border border-gray-300 rounded"
      />

      {/* Loading Indicator */}
      {loading && <p className="text-blue-500 dark:text-blue-300">Processing...</p>}

      {/* Error Message */}
      {error && <p className="text-red-500">{error}</p>}

      {/* Filtered Transcript */}
      {filteredTranscript && (
        <div
          className="p-4 bg-gray-100 rounded"
          dangerouslySetInnerHTML={{ __html: filteredTranscript }}
        />
      )}

      {/* Answer */}
      {answer && (
        <div className="p-4 bg-green-100 rounded">
          <strong>Answer:</strong> {answer}
        </div>
      )}
    </div>
  );
}
