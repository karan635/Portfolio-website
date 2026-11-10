import { useEffect, useRef, useState } from "react"
import { BotAction, ChatMessage, getBotResponse, getInitialMessage } from "../data/botLogic"

interface SpideyBotProps {
  onNavigate: (sectionId: string) => void
  onSelectProject: (projectId: string) => void
  resumeUrl: string
}

function playWebSound(type: "pop" | "send" | "receive") {
  try {
    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
    const osc = ctx.createOscillator()
    const gain = ctx.createGain()
    osc.connect(gain)
    gain.connect(ctx.destination)

    const now = ctx.currentTime
    if (type === "send") {
      osc.type = "sine"
      osc.frequency.setValueAtTime(440, now)
      osc.frequency.exponentialRampToValueAtTime(880, now + 0.08)
      gain.gain.setValueAtTime(0.08, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.08)
      osc.start(now)
      osc.stop(now + 0.08)
    } else if (type === "receive") {
      osc.type = "triangle"
      osc.frequency.setValueAtTime(700, now)
      osc.frequency.exponentialRampToValueAtTime(520, now + 0.12)
      gain.gain.setValueAtTime(0.07, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.12)
      osc.start(now)
      osc.stop(now + 0.12)
    } else {
      osc.type = "sine"
      osc.frequency.setValueAtTime(520, now)
      gain.gain.setValueAtTime(0.05, now)
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.05)
      osc.start(now)
      osc.stop(now + 0.05)
    }
  } catch {
    // AudioContext might be blocked until user gesture, ignore silently
  }
}

export function triggerSpideyBot() {
  window.dispatchEvent(new CustomEvent("open-spidey-bot"))
}

export default function SpideyBot({
  onNavigate,
  onSelectProject,
  resumeUrl,
}: SpideyBotProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<ChatMessage[]>([getInitialMessage()])
  const [inputValue, setInputValue] = useState("")
  const [isTyping, setIsTyping] = useState(false)
  const [soundEnabled, setSoundEnabled] = useState(true)
  const [showTeaser, setShowTeaser] = useState(true)
  const [copiedText, setCopiedText] = useState<string | null>(null)

  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)

  // Listen for global custom trigger event
  useEffect(() => {
    const handleOpenEvent = () => setIsOpen(true)
    window.addEventListener("open-spidey-bot", handleOpenEvent)
    return () => window.removeEventListener("open-spidey-bot", handleOpenEvent)
  }, [])

  // Auto-scroll to latest message
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
    }
  }, [messages, isTyping, isOpen])

  // Focus input when chat opens
  useEffect(() => {
    if (isOpen) {
      setShowTeaser(false)
      const timer = setTimeout(() => {
        inputRef.current?.focus()
      }, 100)
      return () => clearTimeout(timer)
    }
  }, [isOpen])

  // Auto-dismiss teaser after 8 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowTeaser(false)
    }, 8000)
    return () => clearTimeout(timer)
  }, [])

  const handleSend = (textToSend?: string) => {
    const query = (textToSend || inputValue).trim()
    if (!query) return

    if (soundEnabled) playWebSound("send")

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: "user",
      text: query,
      timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    }

    setMessages((prev) => [...prev, userMsg])
    setInputValue("")
    setIsTyping(true)

    // Simulate smart thinking/typing delay
    setTimeout(() => {
      const response = getBotResponse(query)
      const botMsg: ChatMessage = {
        id: `bot-${Date.now()}`,
        sender: "bot",
        text: response.text,
        timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
        actions: response.actions,
        quickReplies: response.quickReplies,
      }
      setMessages((prev) => [...prev, botMsg])
      setIsTyping(false)
      if (soundEnabled) playWebSound("receive")
    }, 450)
  }

  const handleActionClick = (action: BotAction) => {
    if (soundEnabled) playWebSound("pop")

    switch (action.type) {
      case "navigate":
        if (action.target) {
          onNavigate(action.target)
          if (window.innerWidth < 768) setIsOpen(false)
        }
        break
      case "selectProject":
        if (action.target) {
          onSelectProject(action.target)
          if (window.innerWidth < 768) setIsOpen(false)
        }
        break
      case "downloadResume":
        window.open(resumeUrl, "_blank")
        break
      case "copy":
        if (action.target) {
          navigator.clipboard.writeText(action.target)
          setCopiedText("Email copied to clipboard! 📋")
          setTimeout(() => setCopiedText(null), 2500)
        }
        break
      case "openExternal":
        if (action.target) {
          window.open(action.target, "_blank", "noopener,noreferrer")
        }
        break
    }
  }

  const handleReset = () => {
    if (soundEnabled) playWebSound("pop")
    setMessages([getInitialMessage()])
  }

  // Format markdown helper (bold, links, bullet points)
  const formatText = (content: string) => {
    const lines = content.split("\n")
    return lines.map((line, lineIndex) => {
      // Process bold and links in line
      const parts = line.split(/(\*\*.*?\*\*|\[.*?\]\(.*?\))/g)
      const formattedParts = parts.map((part, partIndex) => {
        if (part.startsWith("**") && part.endsWith("**")) {
          return (
            <strong key={partIndex} className="text-white font-semibold">
              {part.slice(2, -2)}
            </strong>
          )
        }
        const linkMatch = part.match(/^\[(.*?)\]\((.*?)\)$/)
        if (linkMatch) {
          return (
            <a
              key={partIndex}
              href={linkMatch[2]}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#f15568] hover:underline"
            >
              {linkMatch[1]}
            </a>
          )
        }
        return part
      })

      return (
        <span key={lineIndex} className="block leading-relaxed">
          {formattedParts}
        </span>
      )
    })
  }

  return (
    <div className="spidey-bot-root fixed bottom-5 right-5 sm:bottom-7 sm:right-7 z-[999] font-sans">
      {/* Toast Notification */}
      {copiedText && (
        <div className="spidey-toast fixed bottom-24 right-6 sm:bottom-28 sm:right-8 bg-[#182840] border border-[#ec4f64] text-white px-4 py-2 rounded-md shadow-2xl text-xs flex items-center gap-2 animate-bounce">
          <span>🕸️</span> {copiedText}
        </div>
      )}

      {/* Floating Teaser Bubble */}
      {showTeaser && !isOpen && (
        <div
          onClick={() => setIsOpen(true)}
          className="spidey-teaser-bubble absolute bottom-16 right-0 mb-2 cursor-pointer bg-[#0e192c] border border-[rgba(238,81,102,0.6)] text-[#e8effa] px-3.5 py-2 rounded-xl shadow-xl whitespace-nowrap text-xs flex items-center gap-2 hover:border-[#f05263] transition-all duration-200"
        >
          <span className="w-2 h-2 rounded-full bg-[#f1495b] animate-ping" />
          <span>Ask <strong>Spidey Bot</strong> about Karan! 🕷️</span>
          <button
            onClick={(e) => {
              e.stopPropagation()
              setShowTeaser(false)
            }}
            className="text-[#889ab4] hover:text-white ml-1 text-sm font-bold"
            aria-label="Dismiss teaser"
          >
            ×
          </button>
        </div>
      )}

      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="spidey-fab group relative flex items-center justify-center w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-gradient-to-tr from-[#a61c31] via-[#dc3449] to-[#eb4f63] text-white shadow-[0_10px_35px_rgba(220,52,73,0.45)] hover:shadow-[0_12px_45px_rgba(240,75,96,0.65)] hover:scale-105 active:scale-95 transition-all duration-300 border-2 border-[rgba(255,255,255,0.3)] focus:outline-none focus:ring-4 focus:ring-[#f15568]/40"
          aria-label="Open Spidey Bot Chat"
        >
          {/* Animated Web Rings */}
          <span className="absolute inset-0 rounded-full border border-white/20 animate-ping pointer-events-none" />

          {/* Spider Logo SVG */}
          <svg
            className="w-7 h-7 sm:w-8 sm:h-8 transition-transform group-hover:rotate-12 duration-300"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            {/* Spider Head & Body */}
            <circle cx="12" cy="7" r="2.5" fill="currentColor" />
            <ellipse cx="12" cy="15" rx="3.5" ry="5" fill="currentColor" />
            {/* Spider Legs */}
            <path d="M9.5 7C7 5 4 6 2 9" />
            <path d="M14.5 7C17 5 20 6 22 9" />
            <path d="M8.5 13C5 12 3 14 1 17" />
            <path d="M15.5 13C19 12 21 14 23 17" />
            <path d="M9 17C6 18 4 21 3 23" />
            <path d="M15 17C18 18 20 21 21 23" />
          </svg>

          {/* Online Dot */}
          <span className="absolute top-0 right-0 w-4 h-4 bg-[#10b981] border-2 border-[#080d19] rounded-full shadow-[0_0_8px_#10b981]" />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="spidey-chat-window flex flex-col w-[calc(100vw-2.5rem)] sm:w-[410px] h-[580px] max-h-[85vh] bg-[#0c1629]/95 backdrop-blur-xl border border-[rgba(238,81,102,0.35)] rounded-2xl shadow-[0_25px_70px_rgba(0,0,0,0.65),0_0_30px_rgba(220,52,73,0.18)] overflow-hidden transition-all duration-300"
          role="dialog"
          aria-labelledby="spidey-bot-header"
        >
          {/* Header */}
          <div className="spidey-chat-header relative bg-gradient-to-r from-[#111f38] via-[#162744] to-[#121e35] border-b border-[rgba(255,255,255,0.08)] px-4 py-3.5 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="relative w-9 h-9 rounded-full bg-[#dc3449] flex items-center justify-center text-white shadow-[0_0_15px_rgba(220,52,73,0.5)]">
                <svg
                  className="w-5 h-5"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="12" cy="7" r="2.2" fill="currentColor" />
                  <ellipse cx="12" cy="14" rx="3" ry="4" fill="currentColor" />
                  <path d="M9.5 7C7 5 4 6 2 9" />
                  <path d="M14.5 7C17 5 20 6 22 9" />
                  <path d="M8.5 13C5 12 3 14 1 17" />
                  <path d="M15.5 13C19 12 21 14 23 17" />
                </svg>
                <span className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-[#10b981] border-2 border-[#111f38] rounded-full" />
              </div>
              <div>
                <h3 id="spidey-bot-header" className="text-white text-sm font-bold flex items-center gap-1.5 leading-tight">
                  Spidey Bot
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-[#dc3449]/20 text-[#f15568] border border-[#dc3449]/30">
                    AI Guide
                  </span>
                </h3>
                <p className="text-[11px] text-[#91a3ba] leading-tight">
                  Your friendly neighborhood assistant 🕷️
                </p>
              </div>
            </div>

            {/* Header Controls */}
            <div className="flex items-center gap-1">
              {/* Sound Toggle */}
              <button
                onClick={() => setSoundEnabled(!soundEnabled)}
                className={`p-1.5 rounded-lg text-xs transition-colors ${
                  soundEnabled ? "text-[#f15568] hover:bg-white/5" : "text-[#657895] hover:bg-white/5"
                }`}
                title={soundEnabled ? "Mute Web Sounds" : "Unmute Web Sounds"}
                aria-label="Toggle Sound"
              >
                {soundEnabled ? "🔊" : "🔇"}
              </button>

              {/* Reset/Clear Chat */}
              <button
                onClick={handleReset}
                className="p-1.5 text-[#889ab4] hover:text-white hover:bg-white/5 rounded-lg transition-colors text-xs"
                title="Reset Conversation"
                aria-label="Reset Chat"
              >
                🔄
              </button>

              {/* Close Button */}
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#889ab4] hover:text-white hover:bg-white/5 rounded-lg transition-colors"
                aria-label="Close Chat"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Thread */}
          <div className="spidey-messages-container flex-1 overflow-y-auto px-4 py-4 space-y-4 text-sm scroll-smooth">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 shadow-md ${
                    msg.sender === "user"
                      ? "bg-gradient-to-r from-[#dc3449] to-[#b71f34] text-white rounded-br-sm"
                      : "bg-[#132238] border border-[#2b3c54] text-[#d6e0ed] rounded-bl-sm"
                  }`}
                >
                  <div className="text-xs sm:text-sm font-normal">
                    {formatText(msg.text)}
                  </div>

                  {/* Message Action Buttons */}
                  {msg.actions && msg.actions.length > 0 && (
                    <div className="mt-3 pt-2.5 border-t border-white/10 flex flex-wrap gap-1.5">
                      {msg.actions.map((action, idx) => (
                        <button
                          key={idx}
                          onClick={() => handleActionClick(action)}
                          className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1.5 rounded-lg bg-[#1e324e] hover:bg-[#dc3449] text-white border border-[#3b516f] hover:border-[#dc3449] transition-all duration-200 transform hover:scale-[1.02]"
                        >
                          {action.label}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Message Timestamp */}
                <span className="text-[10px] text-[#63768f] mt-1 px-1">
                  {msg.timestamp}
                </span>

                {/* Inline Quick Replies if attached to this message */}
                {msg.quickReplies && msg.quickReplies.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5 w-full">
                    {msg.quickReplies.map((reply, i) => (
                      <button
                        key={i}
                        onClick={() => handleSend(reply)}
                        className="text-xs px-2.5 py-1 rounded-full bg-[#101e33] hover:bg-[#dc3449] text-[#a4b5cb] hover:text-white border border-[#293c54] hover:border-[#dc3449] transition-all duration-200"
                      >
                        {reply}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && (
              <div className="flex items-center gap-2 text-[#91a3ba] text-xs py-1">
                <div className="flex gap-1.5 items-center bg-[#132238] border border-[#2b3c54] px-3 py-2 rounded-2xl rounded-bl-sm">
                  <span className="w-1.5 h-1.5 bg-[#f15568] rounded-full animate-bounce [animation-delay:-0.3s]" />
                  <span className="w-1.5 h-1.5 bg-[#f15568] rounded-full animate-bounce [animation-delay:-0.15s]" />
                  <span className="w-1.5 h-1.5 bg-[#f15568] rounded-full animate-bounce" />
                </div>
                <span className="text-[11px] text-[#71849d]">Spidey is typing...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="spidey-chat-footer p-3 bg-[#0a1221] border-t border-[rgba(255,255,255,0.08)] flex-shrink-0">
            <form
              onSubmit={(e) => {
                e.preventDefault()
                handleSend()
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Ask about projects, skills, contact..."
                className="flex-1 bg-[#121e33] border border-[#2d3f57] focus:border-[#dc3449] text-white text-xs sm:text-sm rounded-xl px-3.5 py-2.5 outline-none transition-colors placeholder:text-[#647791]"
              />
              <button
                type="submit"
                disabled={!inputValue.trim()}
                className="w-10 h-10 rounded-xl bg-[#dc3449] hover:bg-[#f04b60] disabled:bg-[#344052] disabled:cursor-not-allowed text-white flex items-center justify-center transition-colors shadow-md flex-shrink-0"
                aria-label="Send message"
              >
                <svg className="w-4 h-4 transform rotate-45 -translate-y-0.5 -translate-x-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                </svg>
              </button>
            </form>
            <div className="mt-1.5 text-[10px] text-center text-[#556980]">
              Built with ❤️ for Karan Parwani's Portfolio • Ask anything!
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
