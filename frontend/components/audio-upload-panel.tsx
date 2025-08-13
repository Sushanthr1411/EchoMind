"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Mic, Upload, FileAudio, Clock } from "lucide-react"

type ResultType = {
  transcript: string
  summary: string
  tasks: { text: string; deadline?: string | null }[]
}

type Props = {
  onResult: (result: ResultType) => void
}

export function AudioUploadPanel({ onResult }: Props) {
  const [isMounted, setIsMounted] = useState(false)
  const [isRecording, setIsRecording] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [audioUrl, setAudioUrl] = useState<string | null>(null)

  const [recentFiles, setRecentFiles] = useState<{ name: string; status: string; duration: string }[]>([])

  const fileInputRef = useRef<HTMLInputElement | null>(null)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const recordedChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] ?? null
    setFile(selectedFile)
    setError(null)

    if (selectedFile) {
      const url = URL.createObjectURL(selectedFile)
      setAudioUrl(url)
    }
  }

  const handleSubmit = async () => {
    if (!file) {
      setError("Please select an audio file first.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      const formData = new FormData()
      formData.append("file", file)

      // Add the file to recentFiles with initial status
      setRecentFiles((prev) => [
        { name: file.name, status: "Processing", duration: "--:--" },
        ...prev,
      ])

      const res = await fetch("http://localhost:8000/process-audio", {
        method: "POST",
        body: formData,
      })

      if (!res.ok) {
        throw new Error("Failed to process audio file.")
      }

      const result: ResultType = await res.json()
      onResult(result)

      // Simulate duration calculation (replace with actual logic if available)
      const calculatedDuration = "5:30" // Example duration, replace with actual calculation

      // Update the status and duration of the processed file
      setRecentFiles((prev) =>
        prev.map((fileEntry) =>
          fileEntry.name === file.name
            ? { ...fileEntry, status: "Ready", duration: calculatedDuration }
            : fileEntry
        )
      )
    } catch (err: any) {
      setError(err.message || "An unexpected error occurred.")

      // Update the status to failed if an error occurs
      setRecentFiles((prev) =>
        prev.map((fileEntry) =>
          fileEntry.name === file?.name
            ? { ...fileEntry, status: "Failed", duration: "--:--" }
            : fileEntry
        )
      )
    } finally {
      setLoading(false)
    }
  }

  const toggleRecording = async () => {
    if (isRecording) {
      // Stop recording
      mediaRecorderRef.current?.stop()
      setIsRecording(false)
    } else {
      // Start recording
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
        const mediaRecorder = new MediaRecorder(stream)
        mediaRecorderRef.current = mediaRecorder
        recordedChunksRef.current = []

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            recordedChunksRef.current.push(event.data)
          }
        }

        mediaRecorder.onstop = async () => {
          const blob = new Blob(recordedChunksRef.current, { type: "audio/webm" })
          const formData = new FormData()
          formData.append("file", blob, "recording.webm")

          setLoading(true)
          setError(null)

          try {
            const res = await fetch("http://localhost:8000/process-audio", {
              method: "POST",
              body: formData,
            })

            if (!res.ok) {
              const errData = await res.json();
              if (res.status === 429) {
                throw new Error(`${errData.error} Retry after ${errData.retry_after} seconds. More info: ${errData.documentation}`);
              }
              throw new Error(`Server error: ${res.status} ${errData.error}`);
            }

            const data: ResultType = await res.json();
            onResult(data); // ✅ send result to parent

            setRecentFiles((prev) => [
              { name: "Live Recording", status: "Ready", duration: "Unknown" },
              ...prev,
            ])
          } catch (err: any) {
            setError(err.message || "Unexpected error")
          } finally {
            setLoading(false)
          }
        }

        mediaRecorder.start()
        setIsRecording(true)
      } catch (err: any) {
        setError("Failed to start recording: " + err.message)
      }
    }
  }

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
    const droppedFiles = e.dataTransfer.files
    if (droppedFiles.length > 0) {
      const droppedFile = droppedFiles[0]
      setFile(droppedFile)
      setError(null)

      const url = URL.createObjectURL(droppedFile)
      setAudioUrl(url)
    }
  }

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    e.stopPropagation()
  }

  if (!isMounted) return null // Prevent SSR hydration mismatch

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      {/* Record Button */}
      <div className="flex flex-col items-center space-y-4">
        <Button
          size="lg"
          className={`h-20 w-20 rounded-full transition-all duration-200 ${
            isRecording
              ? "bg-red-500 hover:bg-red-600 animate-pulse"
              : "bg-primary hover:bg-primary/90 hover:scale-105"
          }`}
          onClick={toggleRecording}
        >
          <Mic className="h-8 w-8" />
        </Button>
        <p className="text-sm text-muted-foreground">
          {isRecording ? "Recording... Click to stop" : "Start capturing your thoughts"}
        </p>
      </div>

      {/* File Upload Zone */}
      <Card
        className="border-2 border-dashed border-slate-300 p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
      >
        <Upload className="mx-auto h-8 w-8 text-muted-foreground mb-3" />
        <p className="text-sm font-medium text-slate-700 mb-1">Drop audio here or click to browse</p>
        <p className="text-xs text-muted-foreground">Supports MP3, WAV, M4A up to 100MB</p>

        <input
          type="file"
          accept="audio/mp3, audio/wav, audio/m4a"
          onChange={handleFileChange}
          className="hidden"
          ref={fileInputRef}
        />

        {file && (
          <p className="mt-4 text-sm text-green-600">File selected: {file.name}</p>
        )}
      </Card>

      {/* Audio Player */}
      {audioUrl && (
        <div className="mt-4">
          <audio controls src={audioUrl} className="w-full">
            Your browser does not support the audio element.
          </audio>
        </div>
      )}

      {/* Submit Button */}
      <div className="flex justify-center">
        <Button onClick={handleSubmit} disabled={loading || !file} className="w-full max-w-xs">
          {loading ? "Processing..." : "Upload & Process"}
        </Button>
      </div>

      {/* Error Display */}
      {error && <p className="text-red-600 text-center">{error}</p>}

      {/* Recent Files */}
      <div className="space-y-3 mt-12">
        <h3 className="text-sm font-medium text-slate-700">Recent Files</h3>
        {recentFiles.map((file, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-slate-50 rounded-lg">
            <div className="flex items-center gap-3">
              <FileAudio className="h-4 w-4 text-muted-foreground" />
              <div>
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <Clock className="h-3 w-3" />
                  {file.duration}
                </div>
              </div>
            </div>
            <Badge
              variant={file.status === "Ready" ? "default" : "secondary"}
              className={file.status === "Processing" ? "animate-pulse" : ""}
            >
              {file.status}
            </Badge>
          </div>
        ))}
      </div>
    </div>
  )
}
