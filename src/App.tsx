import { useEffect, useRef, useState } from "react"
import resumeUrl from "./imports/Karan_Parwani_4th_resume.pdf"
import portraitUrl from "./imports/20290c02-4688-4d07-be16-721dca7b49df.jpg"
import portraiturl1 from "./imports/afc40005-8535-4f62-9345-af60e36d0cb6.jpg"
import SpiderLogo from "./components/SpiderLogo"
import SpideyBot, { triggerSpideyBot } from "./components/SpideyBot"

type IconName = "arrow" | "down" | "download" | "github" | "linkedin" | "mail" | "phone" | "menu" | "close" | "send" | "external"

interface IconProps {
  name: IconName
  size?: number
}

function Icon({ name, size = 18 }: IconProps) {
  const paths: Record<IconName, React.ReactNode> = {
    arrow: (
      <>
        <path d="M5 12h14M13 6l6 6-6 6" />
      </>
    ),
    down: (
      <>
        <path d="M12 4v16m-6-6 6 6 6-6" />
      </>
    ),
    download: (
      <>
        <path d="M12 3v12m-4-4 4 4 4-4M4 17v4h16v-4" />
      </>
    ),
    github: (
      <>
        <path d="M9 19c-4 1.5-4-2-6-2m12 4v-3.4a3 3 0 0 0-.8-2.3c2.7-.3 5.5-1.3 5.5-6A4.7 4.7 0 0 0 18.4 6a4.4 4.4 0 0 0-.1-3.2S17.2 2.5 15 4a11.3 11.3 0 0 0-6 0C6.8 2.5 5.7 2.8 5.7 2.8A4.4 4.4 0 0 0 5.6 6a4.7 4.7 0 0 0-1.3 3.3c0 4.7 2.8 5.7 5.5 6A3 3 0 0 0 9 17.6V21" />
      </>
    ),
    linkedin: (
      <>
        <rect x="3" y="3" width="18" height="18" rx="2" />
        <path d="M8 10v7m0-10v.01M12 17v-7h3v1a3 3 0 0 1 5 2.5V17" />
      </>
    ),
    mail: (
      <>
        <rect x="2.5" y="4.5" width="19" height="15" rx="2" />
        <path d="m3 6 9 7 9-7" />
      </>
    ),
    phone: (
      <>
        <path d="M21 16.5v3a2 2 0 0 1-2.2 2A18 18 0 0 1 2.5 5.2 2 2 0 0 1 4.5 3h3a2 2 0 0 1 2 1.7l.4 2.8a2 2 0 0 1-.6 1.7L7.6 11a14 14 0 0 0 5.4 5.4l1.8-1.7a2 2 0 0 1 1.7-.6l2.8.4a2 2 0 0 1 1.7 2Z" />
      </>
    ),
    menu: (
      <>
        <path d="M4 7h16M4 12h16M4 17h16" />
      </>
    ),
    close: (
      <>
        <path d="M5 5l14 14M19 5 5 19" />
      </>
    ),
    send: (
      <>
        <path d="m22 2-7 20-4-9-9-4 20-7ZM11 13 22 2" />
      </>
    ),
    external: (
      <>
        <path d="M13 4h7v7M20 4 10 14M20 13v7H4V4h7" />
      </>
    ),
  }
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function WebMark({ size = 32 }: { size?: number }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className="web-mark"
    >
      <circle cx="40" cy="40" r="3" fill="currentColor" />
      <path
        d="M40 3v74M3 40h74M14 14l52 52M66 14 14 66M40 15c14 0 25 11 25 25S54 65 40 65 15 54 15 40 26 15 40 15ZM40 26c8 0 14 6 14 14s-6 14-14 14-14-6-14-14 6-14 14-14Z"
        stroke="currentColor"
        strokeWidth="1.6"
      />
    </svg>
  )
}

function WebParticles() {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const hero = canvas?.parentElement
    if (
      !canvas ||
      !hero ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    )
      return
    const context = canvas.getContext("2d")
    if (!context) return
    const mouse = { x: -1000, y: -1000 }
    let points: {
      x: number
      y: number
      vx: number
      vy: number
    }[] = []
    let frame = 0
    let visible = true
    let width = 0
    let height = 0
    const resize = () => {
      width = hero.clientWidth
      height = hero.clientHeight
      const ratio = Math.min(window.devicePixelRatio || 1, 2)
      canvas.width = width * ratio
      canvas.height = height * ratio
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
      points = Array.from(
        { length: window.innerWidth < 700 ? 14 : 33 },
        () => ({
          x: Math.random() * width,
          y: Math.random() * height,
          vx: (Math.random() - 0.5) * 0.22,
          vy: (Math.random() - 0.5) * 0.22,
        }),
      )
    }
    const move = (event: PointerEvent) => {
      const rect = hero.getBoundingClientRect()
      mouse.x = event.clientX - rect.left
      mouse.y = event.clientY - rect.top
    }
    const draw = () => {
      if (visible) {
        context.clearRect(0, 0, width, height)
        points.forEach((point, i) => {
          point.x += point.vx
          point.y += point.vy
          if (point.x < 0 || point.x > width) point.vx *= -1
          if (point.y < 0 || point.y > height) point.vy *= -1
          context.fillStyle = "rgba(194,218,247,.45)"
          context.beginPath()
          context.arc(point.x, point.y, 1.3, 0, Math.PI * 2)
          context.fill()
          points.slice(i + 1).forEach((other) => {
            const distance = Math.hypot(point.x - other.x, point.y - other.y)
            if (distance < 115) {
              context.strokeStyle = `rgba(144,174,211,${(1 - distance / 115) * 0.16})`
              context.beginPath()
              context.moveTo(point.x, point.y)
              context.lineTo(other.x, other.y)
              context.stroke()
            }
          })
          const distanceToMouse = Math.hypot(
            point.x - mouse.x,
            point.y - mouse.y,
          )
          if (distanceToMouse < 175) {
            context.strokeStyle = `rgba(241,86,107,${(1 - distanceToMouse / 175) * 0.35})`
            context.beginPath()
            context.moveTo(point.x, point.y)
            context.lineTo(mouse.x, mouse.y)
            context.stroke()
          }
        })
      }
      frame = requestAnimationFrame(draw)
    }
    const observer = new IntersectionObserver(
      (entries) => {
        visible = entries[0].isIntersecting
      },
      { threshold: 0 },
    )
    resize()
    observer.observe(hero)
    hero.addEventListener("pointermove", move)
    window.addEventListener("resize", resize)
    frame = requestAnimationFrame(draw)
    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      hero.removeEventListener("pointermove", move)
      window.removeEventListener("resize", resize)
    }
  }, [])
  return <canvas ref={canvasRef} className="web-particles" aria-hidden="true" />
}

const navItems = [
  "Home",
  "About",
  "Skills",
  "Projects",
  "Experience",
  "Education",
  "Certifications",
  "Contact",
]
const projects = [
  {
    number: "01",
    name: "UniAssist-AI",
    category: "Multilingual RAG chatbot",
    subtitle: "University admissions Q&A in three languages.",
    description:
      "A multilingual, retrieval-augmented university admissions chatbot built to answer questions from source documents.",
    technologies: [
      "Python",
      "FastAPI",
      "LangChain",
      "FAISS",
      "Groq",
      "HuggingFace Embeddings",
    ],
    details: [
      "Built a production RAG pipeline with PDF ingestion, section-aware chunking, HuggingFace embeddings and FAISS vector retrieval, served through a FastAPI backend.",
      "Implemented English, Hindi and Japanese support through language detection and pre-retrieval translation.",
      "Debugged FAISS retrieval issues involving metadata tagging and per-request service reconstruction.",
    ],
    visual: "rag",
  },
  {
    number: "02",
    name: "AI Job Hunter",
    category: "Full-stack career platform",
    subtitle: "AI-assisted tools for the job search.",
    description:
      "A full-stack, AI-powered career assistant platform bringing essential job-search tools into one experience.",
    technologies: [
      "Next.js",
      "TypeScript",
      "Supabase",
      "Clerk",
      "Groq",
      "AI SDK",
      "RAG",
    ],
    details: [
      "Built resume upload and parsing, ATS scoring, and job-matching features.",
      "Created AI cover-letter generation and an interview-prep question generator using Groq LLM.",
    ],
    visual: "career",
  },
]
type Project = typeof projects[number]

const skillGroups = [
  {
    label: "AI / Machine Learning",
    index: "01",
    skills: [
      "RAG",
      "LLM Integration",
      "LangChain",
      "Prompt Engineering",
      "FAISS",
      "HuggingFace Embeddings",
      "Semantic Search",
      "Groq",
      "Gemini API",
      "Regression",
      "Classification",
      "CNN",
      "TensorFlow",
      "Scikit-learn",
      "Feature Engineering",
      "Hyperparameter Tuning",
      "Model Evaluation",
      "Data Preprocessing",
    ],
  },
  {
    label: "Data Science",
    index: "02",
    skills: [
      "Pandas",
      "NumPy",
      "EDA",
      "Statistical Analysis",
      "Matplotlib",
      "Seaborn",
    ],
  },
  {
    label: "Web Development",
    index: "03",
    skills: [
      "FastAPI",
      "Streamlit",
      "Next.js",
      "React",
      "REST APIs",
      "TypeScript",
      "Clerk",
      "AI SDK",
    ],
  },
  {
    label: "Databases",
    index: "04",
    skills: ["SQL", "Supabase", "FAISS"],
  },
  {
    label: "Tools & Technologies",
    index: "05",
    skills: [
      "Git/GitHub",
      "OpenCV",
      "Hugging Face Hub",
      "Google Cloud Platform (foundational)",
    ],
  },
  {
    label: "Programming",
    index: "06",
    skills: ["Python", "R", "SQL", "Java", "C"],
  },
]

const experiences = [
  {
    role: "Frontend Developer Intern",
    company: "Global Bizz Tech Solutions",
    date: "May 2026 — Jul 2026",
    place: "Hyderabad, Telangana · Remote",
    points: [
      "Built and styled reusable UI components and pages using React and Next.js, translating designs into responsive, functional interfaces.",
      "Collaborated on frontend feature development while following existing project structure and coding conventions.",
    ],
    tags: ["React", "Next.js", "Frontend Development"],
  },
  {
    role: "Data Science Intern",
    company: "Grras Solutions Pvt. Ltd.",
    date: "May 2024 — Jul 2024",
    place: "Jaipur, Rajasthan",
    points: [
      "Built and optimized ML classification models with Python and Scikit-learn, tuning hyperparameters and engineering features.",
      "Preprocessed real-world datasets; performed EDA and created visualizations for stakeholder decisions.",
      "Queried structured data with SQL for extraction and reporting.",
    ],
    tags: ["Python", "Scikit-learn", "Pandas", "SQL"],
  },
]
const education = [
  {
    degree: "Master of Computer Application (MCA)",
    school: "Birla Institute of Technology, Mesra",
    date: "Aug 2025 — Apr 2027",
    location: "Jaipur, Rajasthan",
    detail: "",
  },
  {
    degree: "Bachelor of Computer Application (BCA)",
    school: "Poornima University",
    date: "Sep 2022 — Jul 2025",
    location: "Jaipur, Rajasthan",
    detail: "AI & Data Science · CGPA: 7.60",
  },
]
const certifications = [
  {
    title: "Tata Group Data Analytics Job Simulation",
    issuer: "Forage",
    date: "Jun 2025",
    number: "01",
  },
  {
    title: "Deloitte Australia Data Analytics Job Simulation",
    issuer: "Forage",
    date: "May 2025",
    number: "02",
  },
  {
    title: "Generative AI & Google Cloud Computing Foundations",
    issuer: "Google Cloud Study Jam, GDSC",
    date: "",
    number: "03",
  },
]

function SectionHeading({
  eyebrow,
  title,
  accent,
  description,
}: {
  eyebrow: string
  title: string
  accent?: string
  description?: string
}) {
  return (
    <div className="section-heading">
      <div className="eyebrow">
        <span className="eyebrow-line" />
        {eyebrow}
      </div>
      <h2>
        {title} {accent && <em>{accent}</em>}
      </h2>
      {description && <p>{description}</p>}
    </div>
  )
}

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="tag">{children}</span>
}

function ProjectVisual({ variant }: { variant: string }) {
  return (
    <div
      className={`project-visual project-visual-${variant}`}
      aria-hidden="true"
    >
      <div className="mockup-glow" />
      <div className="app-mockup">
        <div className="mockup-topbar">
          <span /><span /><span />
          <small>{variant === "rag" ? "ASK UNIVERSE" : "CAREER ENGINE"}</small>
        </div>
        {variant === "rag" ? (
          <div className="mockup-interface">
            <aside className="mockup-sidebar">
              <div className="mini-brand">
                <WebMark size={24} />
                <strong>Ask Uni</strong>
              </div>
              <span className="mock-nav active">New question</span>
              <span className="mock-nav">Admission guide</span>
              <span className="mock-nav">Saved answers</span>
              <div className="language-pill">EN / हिंदी</div>
            </aside>
            <div className="mockup-main">
              <span className="mock-label">AI ADMISSION ASSISTANT</span>
              <div className="mock-heading">What would you like to know?</div>
              <div className="mock-question">What is the MCA admission process?</div>
              <div className="mock-answer">
                <span className="answer-icon">AI</span>
                <div>
                  <strong>Here’s what I found</strong>
                  <i /><i /><i className="short" />
                </div>
              </div>
              <div className="source-row">
                <span>3 verified sources</span>
                <span>98% match</span>
              </div>
            </div>
          </div>
        ) : (
          <div className="mockup-interface">
            <aside className="mockup-sidebar">
              <div className="mini-brand">
                <span className="mini-ai">AI</span>
                <strong>CareerOS</strong>
              </div>
              <span className="mock-nav active">Overview</span>
              <span className="mock-nav">Resume score</span>
              <span className="mock-nav">Role matching</span>
              <span className="mock-nav">Interview lab</span>
            </aside>
            <div className="mockup-main">
              <div className="dashboard-head">
                <div>
                  <span className="mock-label">CAREER DASHBOARD</span>
                  <div className="mock-heading">Your next best move.</div>
                </div>
                <span className="profile-dot">KP</span>
              </div>
              <div className="dashboard-grid">
                <div className="score-card">
                  <span>Resume score</span>
                  <strong>86</strong>
                  <div className="score-line"><i /></div>
                </div>
                <div className="match-card">
                  <span>Top role match</span>
                  <strong>AI Engineer</strong>
                  <small>94% aligned</small>
                </div>
              </div>
              <div className="activity-card">
                <span>Skill readiness</span>
                <div className="activity-bars">
                  <i /><i /><i /><i /><i />
                </div>
              </div>
            </div>
          </div>
        )}
        <div className="mockup-statusbar">
          <span className="status-live">LIVE</span>
          <span>{variant === "rag" ? "RAG PIPELINE CONNECTED" : "PROFILE SYNCED"}</span>
        </div>
      </div>
      <div className="mockup-caption">
        {variant === "rag" ? <WebMark size={20} /> : <span className="mini-ai">AI</span>}
        <span>
          {variant === "rag"
            ? "Retrieval intelligence, made clear."
            : "One workspace for the next step."}
        </span>
      </div>
    </div>
  )
}

function ProjectCard({
  project,
  onOpen,
}: {
  project: Project
  onOpen: () => void
}) {
  const cardRef = useRef<HTMLElement>(null)
  function onMove(e: React.MouseEvent<HTMLElement>) {
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      window.innerWidth < 900 ||
      !cardRef.current
    )
      return
    const rect = cardRef.current.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    cardRef.current.style.setProperty("--tilt-x", `${-y * 3}deg`)
    cardRef.current.style.setProperty("--tilt-y", `${x * 3}deg`)
  }
  function onLeave() {
    cardRef.current?.style.setProperty("--tilt-x", "0deg")
    cardRef.current?.style.setProperty("--tilt-y", "0deg")
  }
  return (
    <article
      className="project-card"
      ref={cardRef}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      onClick={onOpen}
    >
      <div className="project-content">
        <div className="project-topline">
          <span>Project {project.number}</span>
          <span className="project-type">{project.category}</span>
        </div>
        <div className="project-main">
          <span className="project-number">/{project.number}</span>
          <h3>{project.name}</h3>
          <p className="project-subtitle">{project.subtitle}</p>
          <p className="project-description">{project.description}</p>
          <div className="tag-row">
            {project.technologies.slice(0, 5).map((tech) => (
              <Tag key={tech}>{tech}</Tag>
            ))}
          </div>
          <button
            className="text-link project-link"
            onClick={onOpen}
            aria-label={`Explore ${project.name} case study`}
          >
            Explore project{" "}
            <span className="round-arrow">
              <Icon name="arrow" size={18} />
            </span>
          </button>
        </div>
      </div>
      <ProjectVisual variant={project.visual} />
    </article>
  )
}

function App() {
  const [showIntro, setShowIntro] = useState(true)
  const [introLeaving, setIntroLeaving] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeSkill, setActiveSkill] = useState(0)
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [formStatus, setFormStatus] = useState("")
  const [scrollProgress, setScrollProgress] = useState(0)
  const [activeSection, setActiveSection] = useState("Home")
  const cursorRef = useRef<HTMLDivElement>(null)
  const introRef = useRef<HTMLDivElement>(null)

  function enterPortfolio() {
    if (introLeaving) return
    const launchButton = introRef.current?.querySelector(".intro-explore")
    const buttonBounds = launchButton?.getBoundingClientRect()
    if (buttonBounds && introRef.current) {
      introRef.current.style.setProperty(
        "--launch-x",
        `${buttonBounds.left + buttonBounds.width / 2}px`,
      )
      introRef.current.style.setProperty(
        "--launch-y",
        `${buttonBounds.top + buttonBounds.height / 2}px`,
      )
    }
    setIntroLeaving(true)
    window.setTimeout(() => {
      setShowIntro(false)
      window.setTimeout(() => {
        document.querySelector<HTMLButtonElement>(".brand")?.focus({
          preventScroll: true,
        })
      }, 0)
      document.getElementById("home")?.scrollIntoView({
        behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
          ? "instant"
          : "smooth",
      })
    }, 850)
  }

  useEffect(() => {
    if (!showIntro) return
    document.body.style.overflow = "hidden"
    introRef.current?.focus({ preventScroll: true })
    const containFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab" || !introRef.current) return
      const focusable = Array.from(
        introRef.current.querySelectorAll<HTMLElement>(
          "button:not(:disabled), a[href]",
        ),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (
        event.shiftKey &&
        (document.activeElement === first ||
          document.activeElement === introRef.current)
      ) {
        event.preventDefault()
        last?.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first?.focus()
      } else if (
        !event.shiftKey &&
        document.activeElement === introRef.current
      ) {
        event.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener("keydown", containFocus)
    return () => {
      document.removeEventListener("keydown", containFocus)
      document.body.style.overflow = ""
    }
  }, [showIntro])

  useEffect(() => {
    document.title = "Karan Parwani | AI & Data Science Portfolio"
    const updateScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      setScrollProgress(max > 0 ? (window.scrollY / max) * 100 : 0)
    }
    window.addEventListener("scroll", updateScroll, { passive: true })
    updateScroll()
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting)
            setActiveSection(
              entry.target.id.charAt(0).toUpperCase() +
                entry.target.id.slice(1),
            )
        })
      },
      { rootMargin: "-30% 0px -60% 0px" },
    )
    document
      .querySelectorAll("main > section[id]")
      .forEach((section) => observer.observe(section))
    return () => {
      window.removeEventListener("scroll", updateScroll)
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    function moveCursor(e: MouseEvent) {
      cursorRef.current?.style.setProperty(
        "transform",
        `translate3d(${e.clientX}px, ${e.clientY}px, 0)`,
      )
    }
    window.addEventListener("pointermove", moveCursor, { passive: true })
    return () => window.removeEventListener("pointermove", moveCursor)
  }, [])

  useEffect(() => {
    if (!selectedProject) return
    const previousFocus = document.activeElement as HTMLElement | null
    const dialog = document.querySelector<HTMLElement>(".project-modal")
    dialog?.querySelector<HTMLButtonElement>(".modal-top button")?.focus()
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelectedProject(null)
      if (e.key !== "Tab" || !dialog) return
      const focusable = Array.from(
        dialog.querySelectorAll<HTMLElement>("button, a[href]"),
      )
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
    document.addEventListener("keydown", onKey)
    document.body.style.overflow = "hidden"
    return () => {
      document.removeEventListener("keydown", onKey)
      document.body.style.overflow = ""
      previousFocus?.focus()
    }
  }, [selectedProject])

  function navigate(id: string) {
    setMobileOpen(false)
    document.getElementById(id)?.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    })
  }

  function handleSelectProjectById(idOrNumber: string) {
    const proj = projects.find(
      (p) =>
        p.number === idOrNumber ||
        p.name.toLowerCase().includes(idOrNumber.toLowerCase()),
    )
    if (proj) {
      setSelectedProject(proj)
    } else {
      navigate("projects")
    }
  }

  function sendMessage(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const data = new FormData(e.currentTarget)
    const name = String(data.get("name") || "")
    const email = String(data.get("email") || "")
    const message = String(data.get("message") || "")
    const subject = encodeURIComponent(`Portfolio inquiry from ${name}`)
    const body = encodeURIComponent(`${message}\n\nFrom: ${name} (${email})`)
    window.location.href = `mailto:Karanparwani9904@gmail.com?subject=${subject}&body=${body}`
    setFormStatus("Your email app should open with your message ready to send.")
  }

  return (
    <>
      {showIntro && (
        <div
          ref={introRef}
          className={`intro-screen ${introLeaving ? "intro-leaving" : ""}`}
          role="dialog"
          tabIndex={-1}
          aria-modal="true"
          aria-labelledby="intro-title"
          onPointerMove={(event) => {
            if (
              event.pointerType === "touch" ||
              window.matchMedia("(prefers-reduced-motion: reduce)").matches
            )
              return
            const bounds = event.currentTarget.getBoundingClientRect()
            const x = (event.clientX - bounds.left) / bounds.width
            const y = (event.clientY - bounds.top) / bounds.height
            event.currentTarget.style.setProperty(
              "--intro-glow-x",
              `${x * 100}%`,
            )
            event.currentTarget.style.setProperty(
              "--intro-glow-y",
              `${y * 100}%`,
            )
            event.currentTarget.style.setProperty(
              "--intro-drift-x",
              `${(x - 0.5) * 18}px`,
            )
            event.currentTarget.style.setProperty(
              "--intro-drift-y",
              `${(y - 0.5) * 12}px`,
            )
          }}
          onPointerLeave={(event) => {
            event.currentTarget.style.setProperty("--intro-drift-x", "0px")
            event.currentTarget.style.setProperty("--intro-drift-y", "0px")
            event.currentTarget.style.setProperty("--intro-glow-x", "64%")
            event.currentTarget.style.setProperty("--intro-glow-y", "42%")
          }}
        >
          <WebParticles />
          <div className="intro-grain" aria-hidden="true" />
          <div className="intro-vignette" aria-hidden="true" />
          <div className="intro-city" aria-hidden="true" />
          <div className="intro-web" aria-hidden="true">
            <WebMark size={900} />
          </div>
          <div className="intro-thread" aria-hidden="true" />
          <div className="intro-layout">
            <div className="intro-copy">
              <span className="intro-kicker">
                <i aria-hidden="true" /> AI <b>·</b> MACHINE LEARNING <b>·</b> DATA
              </span>
              <h1 className="intro-title" id="intro-title">
                Karan <span className="intro-surname">Parwani<span className="intro-period">.</span></span>
              </h1>
              <p className="intro-role">
                MCA Student <span aria-hidden="true">·</span> AI &amp; Data Science
              </p>
              <p className="intro-description">
                I build Generative AI applications and full-stack projects,
                drawing on machine learning and data.
              </p>
              <div className="intro-actions">
                <button
                  className="intro-explore"
                  type="button"
                  onClick={enterPortfolio}
                >
                  <span>Explore Portfolio</span>
                  <Icon name="arrow" size={19} />
                </button>
                <a
                  className="intro-resume"
                  href={resumeUrl}
                  target="_blank"
                  rel="noreferrer"
                >
                  View Resume <Icon name="external" size={15} />
                </a>
              </div>
            </div>
            <div className="intro-core-stage">
              <SpiderLogo className="pointer-events-none relative z-0" />
              <div className="intro-core-dust">
                <i className="core-dust-one" />
                <i className="core-dust-two" />
                <i className="core-dust-three" />
                <i className="core-dust-four" />
                <i className="core-dust-five" />
                <i className="core-dust-six" />
              </div>
            </div>
          </div>
          <svg
            className="intro-transition-web"
            viewBox="0 0 100 100"
            aria-hidden="true"
          >
            <g fill="none" stroke="currentColor" strokeWidth=".18">
              <circle cx="50" cy="50" r="13" />
              <circle cx="50" cy="50" r="27" />
              <circle cx="50" cy="50" r="41" />
              <circle cx="50" cy="50" r="49" />
              <path d="M50 1v98M1 50h98M15.35 15.35l69.3 69.3m0-69.3-69.3 69.3M31.62 3.25l36.76 93.5M3.25 31.62l93.5 36.76m0-42.76L3.25 68.38M68.38 3.25l-36.76 93.5" />
            </g>
          </svg>
        </div>
      )}
      <div
        className="scroll-progress"
        style={{ width: `${scrollProgress}%` }}
      />
      <div className="cursor-glow" ref={cursorRef} aria-hidden="true" />
      <header className="site-header">
        <nav className="nav-shell" aria-label="Main navigation">
          <button
            className="brand"
            onClick={() => navigate("home")}
            aria-label="Karan Parwani, go to home"
          >
            <span className="brand-icon">
              <WebMark size={27} />
            </span>
            <span className="brand-text">
              KARAN<span className="brand-dot">.</span>
            </span>
          </button>
          <div className={`nav-links ${mobileOpen ? "nav-links-open" : ""}`}>
            {navItems.map((item) => (
              <button
                key={item}
                onClick={() => navigate(item.toLowerCase())}
                className={
                  activeSection === item ? "nav-link active" : "nav-link"
                }
              >
                {item}
              </button>
            ))}
            <a
              className="mobile-resume"
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              View Resume <Icon name="external" size={15} />
            </a>
            <button
              className="mobile-resume"
              type="button"
              onClick={() => {
                setMobileOpen(false)
                triggerSpideyBot()
              }}
              style={{ borderTop: "1px solid #2d3d54", paddingTop: "12px", background: "none", borderLeft: "0", borderRight: "0", borderBottom: "0", width: "100%", cursor: "pointer" }}
            >
              Ask Spidey Bot 🕷️
            </button>
          </div>
          <div className="nav-actions">
            <button
              className="nav-spidey-btn"
              type="button"
              onClick={triggerSpideyBot}
              title="Open Spidey Bot Assistant"
              aria-label="Open Spidey Bot Assistant"
            >
              <span className="nav-spidey-dot" />
              <span>Ask Spidey 🕷️</span>
            </button>
            <a
              className="nav-resume"
              href={resumeUrl}
              target="_blank"
              rel="noreferrer"
            >
              Resume <Icon name="external" size={14} />
            </a>
            <button
              className="menu-toggle"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              aria-expanded={mobileOpen}
            >
              <Icon name={mobileOpen ? "close" : "menu"} size={22} />
            </button>
          </div>
        </nav>
      </header>

      <main>
        <section id="home" className="hero section">
          <div className="hero-atmosphere" />
          <div className="hero-grid" />
          <WebParticles />
          <div className="hero-web hero-web-top" aria-hidden="true">
            <WebMark size={560} />
          </div>
          <div className="hero-web-line web-line-one" />
          <div className="hero-web-line web-line-two" />
          <div className="hero-art">
            <div className="hero-art-halo" aria-hidden="true" />
            <div className="hero-art-ring ring-one" aria-hidden="true" />
            <div className="hero-art-ring ring-two" aria-hidden="true" />
            <div className="hero-photo-frame">
              <img
                src={portraitUrl}
                alt="Portrait of Karan Parwani"
                className="hero-photo"
                fetchPriority="high"
              />
            </div>
          </div>
          <div className="hero-city" aria-hidden="true" />
          <div className="hero-inner container">
            <div className="hero-copy">
              <h1>
                <span className="name-first" data-text="KARAN">KARAN</span>
                <span className="name-last" data-text="PARWANI.">
                  PARWANI<span className="hero-period">.</span>
                </span>
              </h1>
              <div className="hero-title">
                MCA STUDENT <span className="title-divider">/</span> AI & DATA
                SCIENCE
              </div>
              <p className="hero-description">
                I’m an MCA student with an AI & Data Science background. I build
                Generative AI applications, work with machine learning and data,
                and develop full-stack projects.
              </p>
              <div className="hero-actions">
                <button
                  className="btn btn-primary"
                  onClick={() => navigate("projects")}
                >
                  View Projects <Icon name="arrow" size={19} />
                </button>
                <a
                  className="btn btn-outline"
                  href={resumeUrl}
                  download="Karan_Parwani_Resume.pdf"
                >
                  Download Resume <Icon name="download" size={17} />
                </a>
                <button
                  className="hero-contact-link"
                  onClick={() => navigate("contact")}
                >
                  Contact Me <Icon name="arrow" size={17} />
                </button>
              </div>
            </div>
          </div>
          <div className="hero-bottom container">
            <button className="scroll-cue" onClick={() => navigate("about")}>
              <span className="scroll-icon">
                <Icon name="down" size={17} />
              </span>{" "}
              Scroll to explore
            </button>
          </div>
        </section>

        <div className="ticker" aria-hidden="true">
          <div className="ticker-track">
            {Array.from({ length: 4 }).map((_, i) => (
              <span key={i}>
                Generative AI <span>✳</span> Machine Learning <span>✳</span>{" "}
                Full-Stack Development <span>✳</span> Data Science{" "}
                <span>✳</span>{" "}
              </span>
            ))}
          </div>
        </div>

        <section id="about" className="section about-section">
          <div className="container about-layout">
            <div className="about-visual">
              <div className="about-visual-frame">
                <div className="about-photo-shell">
                  <img
                    src={portraiturl1}
                    alt="Karan Parwani, AI and Data Science developer"
                    className="about-photo"
                    loading="lazy"
                  />
                </div>
                <div className="about-photo-index">PORTRAIT / 01</div>
              </div>
              <div className="floating-card floating-card-top">
                <span className="float-indicator" /> Currently studying
                <strong>MCA · BIT Mesra</strong>
              </div>
              <div className="floating-card floating-card-bottom">
                <span className="float-indicator blue" /> Background
                <strong>AI & Data Science</strong>
              </div>
            </div>
            <div className="about-copy">
              <SectionHeading eyebrow="01 / About" title="About" accent="Me." />
              <p className="about-lead">
                Hey, I’m Karan. I build things with AI.
              </p>
              <p className="body-muted">
                I’m an MCA student at BIT Mesra. Before this, I did a BCA in AI & Data Science at Poornima University. I mostly work with Python, machine learning, and LLMs, and I enjoy turning an idea into something people can actually use.
              </p>
              <p className="body-muted">
                Lately I’ve been building a multilingual chatbot that answers university admission questions, and a career platform that scores your resume, matches you to jobs, and writes cover letters. Next.js, FastAPI, LangChain, and Supabase are my usual tools.
              </p>
              <p className="body-muted">
                I’ve done internships in Data Science and frontend development, and I’m contributing to open source with GSSoC 2026. I’m looking for AI Engineer, Data Scientist, or Data Analyst roles. If you’re hiring or just want to chat, say hi.
              </p>
              <div className="about-facts">
                <div>
                  <span>Education</span>
                  <strong>MCA · BIT Mesra</strong>
                </div>
                <div>
                  <span>Background</span>
                  <strong>AI & Data Science</strong>
                </div>
                <div>
                  <span>Interests</span>
                  <strong>AI · Data · Development</strong>
                </div>
              </div>
              <button
                className="text-link"
                onClick={() => navigate("experience")}
              >
                View experience{" "}
                <span className="round-arrow">
                  <Icon name="arrow" size={18} />
                </span>
              </button>
            </div>
          </div>
        </section>

        <section id="skills" className="section skills-section">
          <div className="container">
            <div className="section-head-row">
              <SectionHeading
                eyebrow="02 / Skills"
                title="Skills &"
                accent="tools."
                description="Technologies I’ve used across my projects, coursework, and internships."
              />
            </div>
            <div className="skills-interface">
              <div
                className="skill-tabs"
                role="tablist"
                aria-label="Skill categories"
              >
                {skillGroups.map((group, i) => (
                  <button
                    key={group.label}
                    role="tab"
                    id={`skill-tab-${i}`}
                    aria-controls="skill-panel"
                    aria-selected={activeSkill === i}
                    className={`skill-tab ${
                      activeSkill === i ? "selected" : ""
                    }`}
                    onClick={() => setActiveSkill(i)}
                  >
                    <span className="skill-index">{group.index}</span>
                    <span>{group.label}</span>
                    <Icon name="arrow" size={18} />
                  </button>
                ))}
              </div>
              <div
                className="skill-display"
                role="tabpanel"
                id="skill-panel"
                aria-labelledby={`skill-tab-${activeSkill}`}
              >
                <div className="skill-display-content">
                  <div className="skill-orbit-decoration" aria-hidden="true">
                    <WebMark size={260} />
                  </div>
                  <h3>{skillGroups[activeSkill].label}</h3>
                  <div className="skill-nodes" key={activeSkill}>
                    {skillGroups[activeSkill].skills.map((skill, i) => (
                      <span
                        className="skill-node"
                        key={skill}
                        style={{ animationDelay: `${i * 45}ms` }}
                      >
                        <span className="node-spark" />
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section id="projects" className="section projects-section">
          <div className="container">
            <div className="section-head-row">
              <SectionHeading
                eyebrow="03 / Projects"
                title="Selected"
                accent="projects."
                description="A closer look at two projects from my resume."
              />
            </div>
            <div className="projects-list">
              {projects.map((project) => (
                <ProjectCard
                  key={project.number}
                  project={project}
                  onOpen={() => setSelectedProject(project)}
                />
              ))}
            </div>
            <div className="projects-footer">
              <span>More of my work on GitHub</span>
              <a
                href="https://github.com/karan635"
                target="_blank"
                rel="noreferrer"
                className="text-link"
              >
                View GitHub profile{" "}
                <span className="round-arrow">
                  <Icon name="external" size={17} />
                </span>
              </a>
            </div>
          </div>
        </section>

        <section className="section ai-section" aria-labelledby="ai-heading">
          <div className="container ai-layout">
            <div className="ai-copy">
              <div className="eyebrow">
                <span className="eyebrow-line" />
                04 / Areas of interest
              </div>
              <h2 id="ai-heading">
                AI & Machine
                <br />
                <em>Learning.</em>
              </h2>
              <p>
                My projects and internships have given me hands-on experience
                with Generative AI, machine learning, and data analysis. Here’s
                how those areas show up in my work.
              </p>
              <button
                className="text-link"
                onClick={() => navigate("projects")}
              >
                View my projects{" "}
                <span className="round-arrow">
                  <Icon name="arrow" size={18} />
                </span>
              </button>
            </div>
            <div className="focus-list">
              <div className="focus-web" aria-hidden="true">
                <WebMark size={360} />
              </div>
              <article className="focus-card">
                <span className="focus-number">01</span>
                <div>
                  <h3>Generative AI</h3>
                  <p>
                    Built a multilingual admissions chatbot using LLMs,
                    LangChain, HuggingFace embeddings, and FAISS retrieval.
                  </p>
                </div>
              </article>
              <article className="focus-card">
                <span className="focus-number">02</span>
                <div>
                  <h3>Machine learning</h3>
                  <p>
                    Worked with classification models, feature engineering, and
                    hyperparameter tuning during my Data Science internship.
                  </p>
                </div>
              </article>
              <article className="focus-card">
                <span className="focus-number">03</span>
                <div>
                  <h3>Data analysis</h3>
                  <p>
                    Used Python, SQL, Pandas, NumPy, Matplotlib, and Seaborn to
                    work with and visualize real-world datasets.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>

        <section
          id="experience"
          className="section timeline-section experience-section"
        >
          <div className="container timeline-layout">
            <div className="timeline-intro">
              <SectionHeading
                eyebrow="05 / Experience"
                title="Work"
                accent="experience."
                description="Frontend development and data science internship experience."
              />
              <div className="timeline-aside">
                <WebMark size={50} />
                <span>
                  INTERNSHIPS
                  <br />& WORK
                </span>
              </div>
            </div>
            <div className="timeline-list">
              {experiences.map((item, i) => (
                <article className="timeline-item" key={item.company}>
                  <div className="timeline-node" />
                  <div className="timeline-meta">
                    <span>Experience 0{i + 1}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3>{item.role}</h3>
                  <div className="timeline-company">
                    {item.company} <span>— {item.place}</span>
                  </div>
                  <ul>
                    {item.points.map((point) => (
                      <li key={point}>{point}</li>
                    ))}
                  </ul>
                  <div className="tag-row">
                    {item.tags.map((tag) => (
                      <Tag key={tag}>{tag}</Tag>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section
          id="education"
          className="section timeline-section education-section"
        >
          <div className="container timeline-layout">
            <div className="timeline-intro">
              <SectionHeading
                eyebrow="06 / Education"
                title="My"
                accent="education."
                description="Computer applications, AI, and data science."
              />
            </div>
            <div className="timeline-list">
              {education.map((item, i) => (
                <article
                  className="timeline-item education-item"
                  key={item.school}
                >
                  <div className="timeline-node" />
                  <div className="timeline-meta">
                    <span>Education 0{i + 1}</span>
                    <span>{item.date}</span>
                  </div>
                  <h3>{item.degree}</h3>
                  <div className="timeline-company">{item.school}</div>
                  <p>
                    {item.location}
                    {item.detail && (
                      <>
                        <span className="detail-separator"> / </span>
                        {item.detail}
                      </>
                    )}
                  </p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="certifications" className="section certifications-section">
          <div className="container">
            <SectionHeading
              eyebrow="07 / Certifications"
              title="Certifications"
              description="Certifications and simulations listed on my resume."
            />
            <div className="cert-grid">
              {certifications.map((cert) => (
                <article className="cert-card" key={cert.number}>
                  <div className="cert-card-top">
                    <span>Certification {cert.number}</span>
                    <WebMark size={31} />
                  </div>
                  <div className="cert-emblem">
                    <span>✳</span>
                  </div>
                  <div className="cert-card-bottom">
                    <span className="cert-issuer">{cert.issuer}</span>
                    <h3>{cert.title}</h3>
                    {cert.date && <div className="cert-date">{cert.date}</div>}
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section className="resume-section section" id="resume">
          <div className="container resume-inner">
            <div className="resume-web" aria-hidden="true">
              <WebMark size={390} />
            </div>
            <div className="eyebrow">
              <span className="eyebrow-line" /> Resume
            </div>
            <h2>
              My <em>resume.</em>
            </h2>
            <p>
              A one-page overview of my education, internship experience,
              projects, and skills.
            </p>
            <div className="resume-actions">
              <a
                className="btn btn-primary"
                href={resumeUrl}
                download="Karan_Parwani_Resume.pdf"
              >
                Download Resume <Icon name="download" size={18} />
              </a>
              <a
                className="btn btn-outline"
                href={resumeUrl}
                target="_blank"
                rel="noreferrer"
              >
                View Resume <Icon name="external" size={17} />
              </a>
            </div>
          </div>
        </section>

        <section id="contact" className="section contact-section">
          <div className="container contact-layout">
            <div className="contact-copy">
              <SectionHeading
                eyebrow="08 / Contact"
                title="Get in"
                accent="touch."
              />
              <p>
                I’m interested in AI Engineer, Data Scientist, and Data Analyst
                roles. If you’d like to discuss an opportunity, I’d love to hear
                from you.
              </p>
              <div className="contact-links">
                <a href="mailto:Karanparwani9904@gmail.com">
                  <span className="contact-icon">
                    <Icon name="mail" size={20} />
                  </span>
                  <span>
                    <small>Email</small>Karanparwani9904@gmail.com
                  </span>
                  <Icon name="arrow" size={18} />
                </a>
                <a
                  href="https://github.com/karan635"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon">
                    <Icon name="github" size={20} />
                  </span>
                  <span>
                    <small>GitHub</small>github.com/karan635
                  </span>
                  <Icon name="arrow" size={18} />
                </a>
                <a
                  href="https://www.linkedin.com/in/karan-parwani-93511k/"
                  target="_blank"
                  rel="noreferrer"
                >
                  <span className="contact-icon">
                    <Icon name="linkedin" size={20} />
                  </span>
                  <span>
                    <small>LinkedIn</small>linkedin.com/in/karan-parwani
                  </span>
                  <Icon name="arrow" size={18} />
                </a>
                <a href="tel:+917737741159">
                  <span className="contact-icon">
                    <Icon name="phone" size={20} />
                  </span>
                  <span>
                    <small>Phone</small>+91 77377 41159
                  </span>
                  <Icon name="arrow" size={18} />
                </a>
              </div>
            </div>
            <div className="contact-panel">
              <div className="contact-panel-heading">
                <span>Contact form</span>
                <span className="live-indicator">
                  <span className="live-dot" /> Available by email
                </span>
              </div>
              <h3>
                Send a message<span>.</span>
              </h3>
              <p>
                This form opens your email app with your message ready to send.
              </p>
              <form onSubmit={sendMessage}>
                <label htmlFor="contact-name">Your name</label>
                <input
                  id="contact-name"
                  name="name"
                  placeholder="Enter your name"
                  required
                  autoComplete="name"
                />
                <label htmlFor="contact-email">Your email</label>
                <input
                  id="contact-email"
                  name="email"
                  type="email"
                  placeholder="Enter your email"
                  required
                  autoComplete="email"
                />
                <label htmlFor="contact-message">Your message</label>
                <textarea
                  id="contact-message"
                  name="message"
                  placeholder="Tell me about your idea or opportunity..."
                  rows={4}
                  required
                />
                <button className="btn btn-primary form-submit" type="submit">
                  Send Message <Icon name="send" size={17} />
                </button>
                {formStatus && (
                  <p className="form-status" role="status">
                    {formStatus}
                  </p>
                )}
              </form>
            </div>
          </div>
        </section>
      </main>

      <footer className="footer">
        <div className="container footer-inner">
          <div className="footer-brand">
            <WebMark size={32} />
            <span>
              Karan Parwani<small>MCA student / AI & Data Science</small>
            </span>
          </div>
          <div className="footer-socials">
            <a
              href="https://github.com/karan635"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub"
            >
              <Icon name="github" size={19} />
            </a>
            <a
              href="https://linkedin.com/in/karan-parwani"
              target="_blank"
              rel="noreferrer"
              aria-label="LinkedIn"
            >
              <Icon name="linkedin" size={19} />
            </a>
            <a href="mailto:Karanparwani9904@gmail.com" aria-label="Email">
              <Icon name="mail" size={19} />
            </a>
          </div>
          <div className="footer-end">
            <span>© {new Date().getFullYear()} Karan Parwani</span>
            <button onClick={() => navigate("home")}>Back to top ↑</button>
          </div>
        </div>
      </footer>

      <SpideyBot
        onNavigate={navigate}
        onSelectProject={handleSelectProjectById}
        resumeUrl={resumeUrl}
      />

      {selectedProject && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) setSelectedProject(null)
          }}
        >
          <div
            className="project-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="modal-title"
          >
            <div className="modal-top">
              <span>Project {selectedProject.number}</span>
              <button
                onClick={() => setSelectedProject(null)}
                aria-label="Close case study"
              >
                <Icon name="close" size={22} />
              </button>
            </div>
            <div className="modal-content">
              <span className="eyebrow">
                <span className="eyebrow-line" /> {selectedProject.category}
              </span>
              <h2 id="modal-title">
                {selectedProject.name}
                <span>.</span>
              </h2>
              <p className="modal-subtitle">{selectedProject.subtitle}</p>
              <p className="modal-description">{selectedProject.description}</p>
              <div className="modal-divider" />
              <h3>What I built</h3>
              <ul>
                {selectedProject.details.map((detail) => (
                  <li key={detail}>{detail}</li>
                ))}
              </ul>
              <h3>Technologies</h3>
              <div className="tag-row">
                {selectedProject.technologies.map((tech) => (
                  <Tag key={tech}>{tech}</Tag>
                ))}
              </div>
            </div>
            <div className="modal-bottom">
              <span>Karan Parwani</span>
              <button
                className="text-link"
                onClick={() => setSelectedProject(null)}
              >
                Close project <Icon name="close" size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}

export default App
