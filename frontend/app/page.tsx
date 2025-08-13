import { Header } from "@/components/header"
import { MainWorkspace } from "@/components/main-workspace"
import { AudioUploadPanel } from "@/components/audio-upload-panel"
import { AboutEchoMind } from "@/components/AboutEchoMind"
import { Footer } from "@/components/Footer"

export default function HomePage() {
  return (
    <div
      className="flex flex-col min-h-screen"
      style={{
        background: "linear-gradient(to bottom, #ffffff, #e6e6e6)",
        color: "var(--foreground)",
      }}
    >
      <Header />
      <main className="flex-grow">
        <AboutEchoMind />
        <MainWorkspace />
      </main>
      <Footer />
    </div>
  )
}
