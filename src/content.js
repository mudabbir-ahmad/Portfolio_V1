// ---------------------------------------------------------------------------
// Single source of truth for all personal content.
// Swap the name, links, or any section by editing this file only.
// ---------------------------------------------------------------------------

// Personal details live in secrets/.env (VITE_* vars) so the repo itself
// never carries private data. The fallbacks below keep a fresh clone buildable.
const NAME = import.meta.env.VITE_NAME || "Bob";
const LOCATION = import.meta.env.VITE_LOCATION || "London, UK";
const EMAIL = import.meta.env.VITE_EMAIL || "";
const GITHUB_USER = import.meta.env.VITE_GITHUB_USER || "your-github-username";
const LINKEDIN = import.meta.env.VITE_LINKEDIN || "";
const CV_URL = import.meta.env.VITE_CV_URL || "/CV/Bob-CV.pdf";

export const profile = {
  name: NAME,
  role: "Recent graduate software engineer",
  location: LOCATION,
  email: EMAIL,
  github: `https://github.com/${GITHUB_USER}`,
  githubUser: GITHUB_USER,
  linkedin: LINKEDIN,
  cvUrl: CV_URL,

  heroTagline:
    "I build software end to end — from React front ends and mobile apps to the servers, networks, and self-hosted infrastructure that run them.",

  availability: "Open to graduate software engineering roles",

  education: {
    degree: "BSc Computer Science (Hons)",
    classification: "First Class (1:1)",
    institution: "A London University",
  },

  about: [
    "I'm a recent graduate software engineer based in London. I studied Computer Science at first-class level, and spent my degree building real systems — a network-attached storage product for my final-year project, mobile apps with React Native, and coursework that pushed me to think like an engineer, not just a coder.",
    "Outside of work I run a home lab: a Proxmox host carrying a stack of self-hosted services, three cloud VPS instances, and a growing interest in running local AI models on my own hardware. If it can be self-hosted, I've probably tried to.",
  ],
};

// Numbers shown in the stats strip under the hero.
export const stats = [
  { value: "7+", label: "Projects built end to end" },
  { value: "10", label: "Languages & frameworks" },
  { value: "11", label: "Self-hosted services running" },
  { value: "1:1", label: "First-class BSc Computer Science" },
];

// Experience & education timeline, newest first.
export const experience = [
  {
    period: "2025 — Present",
    title: "Graduate Software Engineer",
    org: "Open to roles · London / Remote",
    detail:
      "Seeking graduate and early-career software engineering roles. Open to placements, contracts, and full-time starts.",
  },
  {
    period: "2024 — 2025",
    title: "Final-Year Project — MASS NAS",
    org: "A London University",
    detail:
      "Designed and built a network-attached storage client end to end: REST API integration, Base64-encoded file payloads in the database, and full project documentation.",
  },
  {
    period: "2021 — 2025",
    title: "BSc Computer Science (Hons)",
    org: "A London University · First Class (1:1)",
    detail:
      "Coursework spanning web and mobile development, databases, networking, and systems programming, capped by the final-year NAS project.",
  },
];

// Compact cards in the "Beyond the terminal" section.
export const interests = [
  {
    name: "Self-hosting",
    detail:
      "If it can run on my own hardware, it probably does — a Proxmox host carrying a dozen services.",
  },
  {
    name: "Local LLMs",
    detail:
      "Running Gemma 31B at home to learn how inference actually works under the hood.",
  },
  {
    name: "Hardware tinkering",
    detail:
      "Arduino projects and sensor experiments — the gyroscope treasure hunt started as one of those.",
  },
  {
    name: "Browser mods",
    detail:
      "Customising Floorp with an Opera GX–styled sidebar. Small UI details matter to me.",
  },
];

// Case-study project cards. `role` is a short context line; `features` are
// the highlight bullets; `stack` replaces the old tag list.
export const projects = [
  {
    title: "MASS — Network Attached Storage",
    year: "2025",
    role: "Final-year project · Solo",
    description:
      "A NAS client that talks to a home server over a REST API, with file payloads stored Base64-encoded in the database. Designed, built, and documented end to end.",
    features: [
      "REST API client for a home storage server",
      "Base64-encoded file payloads persisted in the database",
      "Full project write-up — design decisions, trade-offs, testing",
    ],
    stack: ["JavaScript", "REST APIs", "Databases"],
    repo: `https://github.com/${GITHUB_USER}/Abstracted-MASS-PublicVer`,
    highlight: true,
  },
  {
    title: "QR Treasure Hunt",
    year: "2023",
    role: "Group project · Year 2 final coursework",
    description:
      "A React.js treasure hunt where players scan QR codes to progress through the game. Built as a group under deadline for my Professional Environments final.",
    features: [
      "QR-code scanning drives game progression",
      "React.js front end with stateful game flow",
      "Shipped as a team within a fixed coursework window",
    ],
    stack: ["React.js", "JavaScript"],
    repo: `https://github.com/${GITHUB_USER}/Treasure-Hunt-App`,
  },
  {
    title: "CRUDL — React Native Demo",
    year: "2024",
    role: "University project",
    description:
      "A full CRUD(L) application built to learn React Native properly — create, read, update, delete, and list flows across screens.",
    features: [
      "Complete CRUD(L) flows across multiple screens",
      "Navigation between list, detail, and edit views",
      "First serious pass at mobile state management",
    ],
    stack: ["React Native", "JavaScript"],
    repo: `https://github.com/${GITHUB_USER}/Project-MAD-crudler`,
  },
  {
    title: "Habit Tracker",
    year: "2024",
    role: "Personal project · Android",
    description:
      "An Android habit-tracking app built with Kotlin using the MVVM architecture and Room for local persistence.",
    features: [
      "MVVM architecture with a dedicated ViewModel layer",
      "Room database for offline-first local persistence",
      "Create, track, and review daily habits",
    ],
    stack: ["Kotlin", "Android", "MVVM", "Room"],
  },
  {
    title: "Gyro & GPS Treasure Hunt",
    year: "2023",
    role: "Personal project · Cross-platform",
    description:
      "A cross-platform React Native game (iOS and Android) that combines device gyroscope input with GPS for map-based treasure hunting.",
    features: [
      "Gyroscope input for physical, device-driven gameplay",
      "GPS positioning on a live map",
      "One codebase shipping to both iOS and Android",
    ],
    stack: ["React Native", "GPS", "Sensor APIs"],
  },
  {
    title: "AI Discord Bot",
    year: "2025",
    role: "Personal project · Self-hosted",
    description:
      "A Python Discord bot with text chat and voice, powered by a self-hosted Gemma 4 31B-IT model running on my own hardware.",
    features: [
      "Text and voice channels backed by a local LLM",
      "Self-hosted Gemma 4 31B-IT — no cloud round-trips",
      "Runs continuously on home hardware via Discord API",
    ],
    stack: ["Python", "Local LLM", "Voice", "Discord API"],
  },
  {
    title: "CV Builder",
    year: "2022",
    role: "Personal project · Desktop",
    description:
      "A desktop CV builder written in Java with a Swing interface — form-driven editing that generates a clean, printable CV.",
    features: [
      "Form-driven editing of CV sections",
      "Live preview before export",
      "Clean, printable output from the desktop app",
    ],
    stack: ["Java", "Swing"],
  },
];

export const githubRepos = [
  {
    name: "Abstracted-MASS-PublicVer",
    description:
      "Public version of my final-year project — a NAS client over REST with Base64 file storage.",
    language: "JavaScript",
    stars: 1,
    url: `https://github.com/${GITHUB_USER}/Abstracted-MASS-PublicVer`,
  },
  {
    name: "Treasure-Hunt-App",
    description:
      "QR-code treasure hunt built for my Professional Environments year 2 final coursework.",
    language: "JavaScript",
    stars: 3,
    url: `https://github.com/${GITHUB_USER}/Treasure-Hunt-App`,
  },
  {
    name: "Project-MAD-crudler",
    description: "University project for learning React Native — a CRUD(L) demo app.",
    language: "JavaScript",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/Project-MAD-crudler`,
  },
  {
    name: "Opera-GX-Styled-Floorp-Sidebar",
    description: "Opera GX–styled sidebar mod for the Floorp browser.",
    language: "CSS",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/Opera-GX-Styled-Floorp-Sidebar`,
  },
];

export const skills = {
  languages: [
    "React Native",
    "Kotlin",
    "Java",
    "C++",
    "Go",
    "HTML",
    "CSS",
    "JavaScript",
    "Python",
    "Bash",
  ],
  tools: [
    "IntelliJ IDEA",
    "WebStorm",
    "PyCharm",
    "Arduino IDE",
    "Docker",
    "Git",
    "RESTful APIs",
  ],
};

export const homelab = [
  { name: "Proxmox", detail: "Single-node hypervisor running the whole stack" },
  { name: "Jellyfin + own media server", detail: "Self-hosted streaming — media server WIP" },
  { name: "SearXNG", detail: "Private metasearch engine" },
  { name: "Dockhand", detail: "Container management UI" },
  { name: "Nginx", detail: "Reverse proxy for the house network" },
  { name: "Pi-hole + AdGuard Home", detail: "Network-wide ad and tracker blocking" },
  { name: "Tailscale", detail: "Mesh networking between home and VPS" },
  { name: "3 cloud VPS instances", detail: "Off-site services and failover" },
  { name: "OpenVPN + WireGuard", detail: "Self-hosted VPN for devices on the move" },
  { name: "OpenWebUI", detail: "Chat front end for local models" },
  { name: "Gitea", detail: "Self-hosted Git server" },
];

export const localAI = {
  heading: "Local AI, on my own hardware",
  body: [
    "I run self-hosted language models on hardware I own — currently a quantised Qwen 3.8 27B served through LM Studio and OpenWebUI — as a way to learn how LLMs actually work under the hood: inference, context, and serving.",
    "It's not just theory: a Gemma 4 31B-IT instance powers the text chat and voice in my Discord bot. No cloud round-trips, no data leaving the house.",
  ],
};
