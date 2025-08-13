type TranscriptEntry = {
  time: string
  speaker: string
  text: string
}

type TranscriptViewProps = {
  transcript: TranscriptEntry[]
}

export function TranscriptView({ transcript }: TranscriptViewProps) {
  if (!transcript || transcript.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">
          Your transcripts will appear here — start by recording or uploading a file.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4 max-h-96 overflow-y-auto">
      {transcript.map((entry, index) => (
        <div key={index} className="border-l-2 border-accent pl-4 py-2">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-medium text-accent">{entry.time}</span>
            <span className="text-xs font-medium text-slate-600">{entry.speaker}</span>
          </div>
          <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed">{entry.text}</p>
        </div>
      ))}
    </div>
  )
}
