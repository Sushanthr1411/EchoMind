"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"

export type Task = {
  text: string
  deadline?: string | null
}

type TasksViewProps = {
  tasks: Task[]
}

export function TasksView({ tasks }: TasksViewProps) {
  if (!tasks || tasks.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-muted-foreground">Extracted tasks will appear here with deadlines and priorities.</p>
      </div>
    )
  }

  return (
    <ul className="list-disc pl-6 space-y-2">
      {tasks.map((task, idx) => (
        <li key={idx} className="text-slate-700 dark:text-slate-300">
          {task.text}
          {task.deadline ? ` (Deadline: ${task.deadline})` : ""}
        </li>
      ))}
    </ul>
  )
}
