import React from "react";
import { AudioUploadPanel } from "@/components/audio-upload-panel";

export function UpdatedLayout() {
  return (
    <div className="space-y-6 max-w-4xl mx-auto p-4">
      {/* Header Section */}
      <header className="text-center">
        <h1 className="text-2xl font-bold text-slate-800">EchoMind</h1>
        <p className="text-sm text-muted-foreground">Upload or record audio to process transcripts and summaries</p>
      </header>

      {/* Main Content Section */}
      <main>
        <AudioUploadPanel onResult={(result) => console.log("Result received:", result)} />
      </main>
    </div>
  );
}
