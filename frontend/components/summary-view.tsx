import { Badge } from "@/components/ui/badge"

type SummaryViewProps = {
  summary: string
}

export function SummaryView({ summary }: SummaryViewProps) {
  if (!summary) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">AI-generated summary will appear here after transcription.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed whitespace-pre-wrap">{summary}</p>
    </div>
  )
}
