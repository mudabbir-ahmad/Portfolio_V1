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
const CV_URL = import.meta.env.VITE_CV_URL || "/CV/my_cv.pdf";

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
    degree: "BSc Computer Science & Distributed Systems (Hons)",
    classification: "First Class (1:1)",
    institution: "Kingston University",
  },

  about: [
    "I'm a recent graduate software engineer based in London. I studied Computer Science at first-class level, and spent my degree building real systems — a media aggregation & sorting system for my final-year project, mobile apps with React Native, and coursework that pushed me to think like an engineer, not just a coder.",
    "Outside of work I run a home lab: a Proxmox host carrying a stack of self-hosted services, three cloud VPS instances, and a growing interest in running local AI models on my own hardware. If it can be self-hosted, I've probably tried to.",
  ],
};

// Numbers shown in the stats strip under the hero.
export const stats = [
  { value: "7+", label: "Projects built end to end" },
  { value: "19", label: "Languages & frameworks" },
  { value: "15", label: "Self-hosted services running" },
  { value: "1:1", label: "First-class BSc Computer Science" },
];

// Experience & education timeline, newest first.
export const experience = [
  {
    period: "2025 — Present",
    title: "Graduate Software Engineer",
    org: "Open to roles · London / Remote",
    detail:
      "Seeking graduate and early-career software engineering roles. Open to full-time starts only.",
  },
  {
    period: "Summers 2020 — 2026",
    title: "Network Infrastructure Engineer (Volunteer)",
    org: "Jalsa Salana UK · Ahmadiyya Muslim Association",
    detail:
      "Engineered a high-availability network for 20,000+ concurrent users with 99.9% uptime, automating hardware monitoring via custom Linux scripts; configured hardware and structured cabling across multi-site event environments, troubleshooting in real time under time-critical conditions.",
  },
  {
    period: "Nov 2025 — Feb 2026",
    title: "Optical Assistant",
    org: "Specsavers · London",
    detail:
      "Managed sensitive patient data systems with 100% accuracy in a high-volume clinical environment; advised customers on eyewear options and completed sales; fitted and adjusted spectacle frames with precision.",
  },
  {
    period: "2025 — 2026",
    title: "Final-Year Project — MASS",
    org: "Kingston University",
    detail:
      "Built MASS (Media Aggregation & Sorting System), a cross-platform React Native app that aggregates media from device storage, Google Photos, and a home NAS into one timeline view, backed by a RESTful Express.js backend; cut data retrieval latency 30% via API caching.",
  },
  {
    period: "2023 — 2026",
    title: "BSc Computer Science (Hons) & Distributed Systems",
    org: "Kingston University · First Class (1:1)",
    detail:
      "Coursework spanning web and mobile development, databases, networking, and systems programming, capped by the MASS final-year project.",
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
      "Running local LLMs at home to learn how inference actually works under the hood.",
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
    title: "MASS — Media Aggregation & Sorting System",
    year: "2026",
    role: "Final-year project · Solo",
    description:
      "A cross-platform React Native app that aggregates media from multiple services — device storage, Google Photos, and a home NAS — into one timeline view, backed by a RESTful Express.js backend.",
    features: [
      "Reduced data retrieval latency 30% through optimized API caching",
      "Metadata-driven sorting across diverse media types",
      "RESTful Express.js backend cutting server response time 15% via middleware design",
      "CI/CD pipelines reducing manual testing and integration time 20%",
    ],
    stack: ["React Native", "Expo", "Node.js", "Express.js"],
    repo: `https://github.com/${GITHUB_USER}/Abstracted-MASS-PublicVer`,
    highlight: true,
  },
  {
    title: "QR Code Treasure Hunt",
    year: "2024",
    role: "Group project · Year 2 final coursework",
    description:
      "A web-based scavenger hunt where participants scan physical QR codes to claim items and accumulate points, with a real-time leaderboard for competitive gameplay.",
    features: [
      "QR generation with server-side validation logic",
      "Real-time leaderboard driving competitive play",
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
    title: "Routines App",
    year: "2024",
    role: "Personal project · Android",
    description:
      "A native Android habit tracker built in Kotlin with MVVM architecture and Room Database for offline-first persistence, plus notification-driven reminders and progress visualization.",
    features: [
      "MVVM architecture with a dedicated ViewModel layer",
      "Room database for offline-first local persistence",
      "Notification-driven reminders and habit completion trends",
    ],
    stack: ["Kotlin", "Android Studio", "MVVM", "Room"],
    repo: `https://github.com/${GITHUB_USER}/Kotlin-TB2P1`,
  },
  {
    title: "Location-Based Treasure Hunt App",
    year: "2024",
    role: "Personal project · Cross-platform",
    description:
      "A GPS and proximity-driven React Native game where players claim hidden caches based on physical location and device orientation, backed by a RESTful API.",
    features: [
      "Geolocation and compass APIs for real-time bearing and distance",
      "Responsive UI that updates dynamically as the player moves",
      "RESTful API backend at 90% code coverage via automated unit testing",
    ],
    stack: ["React Native", "GPS", "Sensor APIs"],
    repo: `https://github.com/${GITHUB_USER}/MAD-Treasure-Hunt`,
  },
  {
    title: "AI Discord Bot",
    year: "2025",
    role: "Personal project · Self-hosted",
    description:
      "A Python Discord bot with text chat and voice, powered by a Cloud Gemma 4 31B-IT model with a local fallback to a quantised Gemma 4 E4B.",
    features: [
      "Text and voice channels backed by an LLM",
      "Cloud Gemma 4 31B-IT primary, with a local Gemma 4 E4B QAT fallback",
      "Runs continuously on home hardware via Discord API",
    ],
    stack: ["Python", "LLM", "Voice", "Discord API"],
    tags: ["Private-Repo"],
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
    tags: ["Private-Repo"],
  },
];

export const githubRepos = [
  {
    name: "Abstracted-MASS-PublicVer",
    description:
      "Public version of my final-year project — a media aggregation & sorting app across device storage, Google Photos, and a home NAS.",
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
    name: "MAD-Treasure-Hunt",
    description:
      "GPS and proximity-driven React Native treasure hunt — players claim hidden caches from physical location.",
    language: "JavaScript",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/MAD-Treasure-Hunt`,
  },
  {
    name: "Kotlin-TB2P1",
    description:
      "Native Android habit tracker in Kotlin — MVVM architecture, Room persistence, and reminder notifications.",
    language: "Kotlin",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/Kotlin-TB2P1`,
  },
  {
    name: "Project-MAD-crudler",
    description: "University project for learning React Native — a CRUD(L) demo app.",
    language: "JavaScript",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/Project-MAD-crudler`,
  },
  {
    name: "LearningGo",
    description: "Small programs and notes from my self-taught Go journey.",
    language: "Go",
    stars: 0,
    url: `https://github.com/${GITHUB_USER}/LearningGo`,
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
    "TypeScript",
    "Python",
    "Bash",
    "PHP",
    "SQL",
    "JSON",
    "LaTeX",
    "React.js",
    "Node.js",
    "Express.js",
    "Oracle Apex",
  ],
  tools: [
    "IntelliJ IDEA",
    "WebStorm",
    "PyCharm",
    "Jupyter",
    "Arduino IDE",
    "Docker",
    "Git",
    "RESTful APIs",
    "VS Code",
    "NeoVim",
    "Android Studio",
    "Expo",
    "Linux",
    "Agile/Scrum",
    "CI/CD",
    "NetBeans",
    "Debian",
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
  { name: "Vaultwarden", detail: "Self-hosted password manager" },
  { name: "Immich", detail: "Private photo and video library" },
  { name: "Home Assistant", detail: "Home automation hub" },
  { name: "Termix", detail: "Self-built containerised SSH manager for hopping between device sessions via a central web UI" },
];

export const localAI = {
  heading: "Local AI, on my own hardware",
  body: [
    "I run self-hosted language models on hardware I own — currently a custom flavour of Qwen 3.8 27B served through LM Studio and OpenWebUI — as a way to learn how LLMs actually work under the hood: inference, context, and serving.",
    "It's not just theory: my Discord bot pairs a Cloud Gemma 4 31B-IT model for text chat and voice with a local Gemma 4 E4B QAT fallback.",
  ],
};

// Share of code across my 27 self-made GitHub repos, excluding AI-agent-built
// repos and this site's repo. Jupyter Notebook bytes count as Python.
// Snapshot via the GitHub API on 2026-09-17; refresh by re-fetching /languages
// per repo and re-aggregating bytes.
export const languageStats = [
  { name: "Python", pct: 55.9 },
  { name: "JavaScript", pct: 33.3 },
  { name: "TypeScript", pct: 4.7 },
  { name: "Kotlin", pct: 3.1 },
  { name: "CSS", pct: 1.1 },
];
