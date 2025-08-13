"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { AudioUploadPanel } from "@/components/audio-upload-panel"
import type { Task } from "@/components/tasks-view"
import { TranscriptView } from "@/components/transcript-view"
import { SummaryView } from "@/components/summary-view"
import { TasksView } from "@/components/tasks-view"
import { DownloadPDFButton } from "@/components/DownloadPDFButton"

// Define types matching what components expect:

type TranscriptEntry = {
  time: string
  speaker: string
  text: string
}

type ResultType = {
  transcript: string;
  summary: string;
  tasks: { text: string; deadline?: string | null }[];
}

export function MainWorkspace() {
  const [activeTab, setActiveTab] = useState("transcript")
  const [result, setResult] = useState<ResultType | null>(null)
  const [selectedLanguage, setSelectedLanguage] = useState("en")

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedLanguage(e.target.value)
  }

  return (
    <div className="mx-auto max-w-7xl p-4 lg:p-6">
      <div className="grid gap-6 lg:grid-cols-2 lg:gap-8">
        {/* Left Panel - Recording & File Import */}
        <div className="space-y-6">
          <Card className="p-6">
            <h2 className="mb-4 text-lg font-semibold text-slate-700 dark:text-slate-300">Record or Upload Audio</h2>

            <AudioUploadPanel
              onResult={(res) => {
                setResult(res) // Only show results from recently uploaded files
              }}
            />
          </Card>
        </div>

        {/* Right Panel - Tabs for Transcript, Summary, Tasks */}
        <div className="space-y-6">
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="transcript">Transcript</TabsTrigger>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="tasks">Tasks</TabsTrigger>
              </TabsList>

              <div className="mt-6">
                {!result ? (
                  <p className="text-sm text-muted-foreground">
                    No result yet. Upload an audio file to see the output.
                  </p>
                ) : (
                  <>
                    <TabsContent value="transcript" className="mt-0">
                      <TranscriptView transcript={typeof result.transcript === "string" ? [{ time: "", speaker: "", text: result.transcript }] : result.transcript} />
                    </TabsContent>
                    <TabsContent value="summary" className="mt-0">
                      <SummaryView summary={result.summary} />
                    </TabsContent>
                    <TabsContent value="tasks" className="mt-0">
                      <TasksView tasks={result.tasks} />
                    </TabsContent>
                  </>
                )}
              </div>
            </Tabs>
          </Card>

          {/* Download PDF Button */}
          {result && (
            <div className="flex justify-end">
              <DownloadPDFButton
                transcript={result.transcript}
                summary={result.summary}
                tasks={result.tasks}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
