import botData from "./botResponses.json"

export interface BotAction {
  type: "navigate" | "selectProject" | "downloadResume" | "copy" | "openExternal"
  target?: string
  label: string
}

export interface ChatMessage {
  id: string
  sender: "bot" | "user"
  text: string
  timestamp: string
  actions?: BotAction[]
  quickReplies?: string[]
}

export interface BotResponseResult {
  text: string
  actions?: BotAction[]
  quickReplies?: string[]
}

// Tokenize and clean text for matching
function cleanTokens(input: string): string[] {
  return input
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .split(/\s+/)
    .filter((token) => token.length > 0)
}

export function getBotResponse(userMessage: string): BotResponseResult {
  const query = userMessage.trim().toLowerCase()
  const tokens = cleanTokens(query)

  if (!query) {
    return {
      text: botData.fallback.text,
      quickReplies: botData.fallback.quickReplies,
    }
  }

  let bestIntent: (typeof botData.intents)[number] | null = null
  let highestScore = 0

  for (const intentObj of botData.intents) {
    let score = 0

    for (const keyword of intentObj.keywords) {
      const lowerKey = keyword.toLowerCase()

      // Exact full match or phrase containment
      if (query === lowerKey) {
        score += 15
      } else if (query.includes(lowerKey)) {
        score += 8 + lowerKey.length * 0.2
      } else {
        // Token level match
        const keyTokens = cleanTokens(lowerKey)
        const matchCount = keyTokens.filter((kt) => tokens.includes(kt)).length
        if (matchCount > 0) {
          score += (matchCount / keyTokens.length) * 5
        }
      }
    }

    if (score > highestScore) {
      highestScore = score
      bestIntent = intentObj
    }
  }

  // Threshold check: if score is sufficient, return intent response
  if (bestIntent && highestScore >= 3.5) {
    return {
      text: bestIntent.response,
      actions: bestIntent.actions as BotAction[] | undefined,
    }
  }

  // Check for common greetings
  const greetingTriggers = ["hi", "hello", "hey", "hola", "sup", "greetings", "good morning", "good evening"]
  if (tokens.some((t) => greetingTriggers.includes(t)) && tokens.length <= 3) {
    const welcome = botData.greetings[0]
    return {
      text: "Hey! 🕷️ Great to see you. How can I help you explore Karan's portfolio today?",
      quickReplies: welcome.quickReplies,
    }
  }

  // Check for gratitude
  const thanksTriggers = ["thanks", "thank you", "thx", "appreciate", "awesome", "great", "cool"]
  if (tokens.some((t) => thanksTriggers.includes(t))) {
    return {
      text: "Anytime! That's what a friendly neighborhood bot is for. 🕷️🕸️ Anything else you'd like to check out?",
      quickReplies: [
        "Show Projects 🚀",
        "Technical Skills 💻",
        "Download Resume 📄",
        "Contact Karan ✉️",
      ],
    }
  }

  // Fallback
  return {
    text: botData.fallback.text,
    quickReplies: botData.fallback.quickReplies,
  }
}

export function getInitialMessage(): ChatMessage {
  const welcome = botData.greetings[0]
  return {
    id: "welcome-msg",
    sender: "bot",
    text: welcome.text,
    timestamp: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
    quickReplies: welcome.quickReplies,
  }
}
