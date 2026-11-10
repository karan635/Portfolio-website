# 🕷️ Spidey Bot — AI Portfolio Assistant Guide & Documentation

**Spidey Bot** is an interactive, intelligent conversational assistant designed for Karan Parwani's developer portfolio. It embodies the high-contrast Spider aesthetic of the site while giving recruiters and visitors instant answers to questions about projects, technical skills, academic background, internships, and contact details.

---

## 1. Core Architecture Overview

Spidey Bot is built as a zero-latency, client-side conversational AI engine embedded into the React 19 + TypeScript + Tailwind CSS v4 stack.

```
src/
├── components/
│   └── SpideyBot.tsx         # Chat UI, FAB, sound synthesis, action dispatcher
├── data/
│   ├── botLogic.ts           # Tokenizer, scoring engine, intent matching
│   └── botResponses.json     # Declarative knowledge base & intent configurations
└── App.tsx                   # App integration, navigation & modal handler wiring
```

### Key Capabilities
- **Natural Language & Keyword Recognition:** Parses complex user queries, computes keyword and token overlap scores across configured intents, and picks the most relevant response.
- **Deep Portfolio Integration:** Interactive response buttons trigger live site actions:
  - Scroll & jump to sections (`#projects`, `#skills`, `#about`, `#experience`, `#contact`).
  - Open project modal case studies directly (`UniAssist-AI`, `AI Job Hunter`).
  - Download or open resume PDF.
  - One-click copy email address with visual toast feedback.
- **Audio Feedback:** Synthesizes custom Spider-web audio clicks and swooshes using the HTML5 Web Audio API (zero external sound file dependencies, with an instant mute/unmute toggle).
- **Proactive Engagement:** Non-intrusive floating teaser bubble nudges visitors on entry, auto-dismissing cleanly.
- **Dual Invocation Points:** Accessible via the bottom-right floating badge (FAB) and the top navigation bar (`Ask Spidey 🕷️`).

---

## 2. File Manifest

| File | Purpose |
|---|---|
| [`src/data/botResponses.json`](file:///d:/Figma/src/data/botResponses.json) | Central knowledge base containing bot info, greeting, intent patterns, keywords, and action definitions. |
| [`src/data/botLogic.ts`](file:///d:/Figma/src/data/botLogic.ts) | Intent resolution algorithm, token normalization, fallback triggers, and message typing. |
| [`src/components/SpideyBot.tsx`](file:///d:/Figma/src/components/SpideyBot.tsx) | Complete chatbot component (FAB, modal window, quick chips, message formatter, audio, action handlers). |
| [`src/App.tsx`](file:///d:/Figma/src/App.tsx) | Root application integration, custom trigger event dispatching, and project modal hooks. |
| [`src/index.css`](file:///d:/Figma/src/index.css) | Custom scrollbars, glowing spider animations, and nav badge styling. |

---

## 3. How to Update & Add New Bot Knowledge

All conversational knowledge is stored declaratively in [`src/data/botResponses.json`](file:///d:/Figma/src/data/botResponses.json).

### Adding a New Intent
To add a new response (e.g., for a new project, award, or certification), simply append a new object to the `"intents"` array in `src/data/botResponses.json`:

```json
{
  "intent": "hackathon_win",
  "keywords": [
    "hackathon",
    "competition",
    "prize",
    "award",
    "winner"
  ],
  "response": "🏆 Karan won 1st place in the Regional AI Hackathon for building an autonomous agent pipeline!",
  "actions": [
    {
      "type": "navigate",
      "target": "projects",
      "label": "View Projects 🚀"
    }
  ]
}
```

### Supported Action Types

| Action Type | `target` Parameter | Description |
|---|---|---|
| `"navigate"` | Section ID (e.g., `"skills"`, `"projects"`, `"contact"`) | Smoothly scrolls to that section on the page. |
| `"selectProject"` | Project number (e.g., `"01"`, `"02"`) | Opens the rich project modal case study. |
| `"downloadResume"` | *Not required* | Opens/downloads the resume PDF in a new tab. |
| `"copy"` | String to copy (e.g. email) | Copies string to clipboard and shows toast alert. |
| `"openExternal"` | URL (e.g. GitHub/LinkedIn URL) | Opens the link securely in a new tab. |

---

## 4. NLP Matching & Keyword Scoring

The matcher in `src/data/botLogic.ts` uses a multi-tier relevance scoring algorithm:
1. **Punctuation & Case Normalization:** Cleans inputs into clean word tokens.
2. **Exact / Substring Matches:** Rewards exact multi-word phrase containment (+15 to +8 points).
3. **Token Jaccard / Overlap Ratio:** Compares token overlap against keyword phrases (+5 points proportionally).
4. **Thresholding:** If the cumulative score exceeds `3.5`, the best-scoring intent fires.
5. **Contextual Fallbacks:** If the score is below the threshold, Spidey Bot provides a friendly fallback response along with 5 suggested query chips.

---

## 5. Testing & Verification

1. **Build Verification:**
   ```bash
   pnpm run build
   ```
2. **Interactive Testing Checklist:**
   - [x] Click the floating Spider FAB to open the chat window.
   - [x] Click "Ask Spidey 🕷️" in the desktop navigation bar.
   - [x] Test quick action chips: "Show Projects 🚀", "Technical Skills 💻", "Download Resume 📄".
   - [x] Test freeform queries: "Tell me about UniAssist", "What languages do you know?", "How can I contact Karan?", "Who is Peter Parker?".
   - [x] Test interactive action buttons inside replies (verify section jumping and modal opening).
   - [x] Test sound effects (toggle mute/unmute).
   - [x] Verify mobile responsiveness (< 700px viewport).
