import React, { useState } from "react";

type Task = {
  text: string;
  deadline?: string | null;
};

type ApiResponse = {
  transcript: string;
  summary: string;
  tasks: Task[];
};

export function AudioProcessor() {
  const [result, setResult] = useState<ApiResponse | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchAudioData = async () => {
    setError(null);
    try {
      const res = await fetch("/process-audio");
      if (!res.ok) throw new Error("API error: " + res.status);
      const data: ApiResponse = await res.json();
      setResult(data);
      // Debug: log tasks to console
      console.log("Tasks from API:", data.tasks);
    } catch (err: any) {
      setError(err.message || "Unexpected error");
    }
  };

  return (
    <div>
      <button onClick={fetchAudioData}>Fetch Audio Data</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
      {result && (
        <div>
          <h3>Transcript</h3>
          <pre>{result.transcript}</pre>
          <h3>Summary</h3>
          <pre>{result.summary}</pre>
          <h3>Tasks</h3>
          {/* Debugging output */}
          <pre>{JSON.stringify(result.tasks, null, 2)}</pre>
          <ul>
            {result.tasks.map((task, idx) => (
              <li key={idx}>
                <strong>{task.text}</strong>
                {task.deadline && (
                  <span style={{ marginLeft: 8, color: "gray" }}>
                    (Deadline: {task.deadline})
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
