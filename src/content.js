// ---------------------------------------------------------------------------
// Content assembly. The words themselves live in src/data/*.json, one file per
// section (profile, stats, experience, projects, repos, skills, homelab,
// languages, interests). Edit those to change what the site says.
//
// Only identity and contact details come from env (secrets/.env in dev,
// `docker run -e` in a container), so a demo can swap them without touching
// any content:
//   VITE_NAME, VITE_EMAIL, VITE_GITHUB_USER, VITE_LINKEDIN,
//   VITE_CV_URL, VITE_UNIVERSITY (fills {{university}} in the JSON files).  Empty email / LinkedIn / CV hides that button.
// ---------------------------------------------------------------------------

import profileData from "./data/profile.json";
import statsData from "./data/stats.json";
import experienceData from "./data/experience.json";
import interestsData from "./data/interests.json";
import projectsData from "./data/projects.json";
import reposData from "./data/repos.json";
import skillsData from "./data/skills.json";
import homelabData from "./data/homelab.json";
import languagesData from "./data/languages.json";

// Runtime values (served by server/index.js at /env.js, filled from `docker run -e`)
// win over build-time ones (secrets/.env, used by `npm run dev`).
const env = { ...import.meta.env, ...(typeof window !== "undefined" ? window.__ENV__ : {}) };
const GITHUB_USER = env.VITE_GITHUB_USER || "your-github-username";
// Replaces {{university}} anywhere in a JSON section with VITE_UNIVERSITY.
const UNIVERSITY = env.VITE_UNIVERSITY || "Your University";
const fill = (v) =>
  typeof v === "string"
    ? v.replaceAll("{{university}}", UNIVERSITY)
    : Array.isArray(v)
      ? v.map(fill)
      : v && typeof v === "object"
        ? Object.fromEntries(Object.entries(v).map(([k, x]) => [k, fill(x)]))
        : v;
const repoUrl = (name) => `https://github.com/${GITHUB_USER}/${name}`;

export const profile = {
  ...fill(profileData),
  name: env.VITE_NAME || "Your Name",
  email: env.VITE_EMAIL || "",
  github: `https://github.com/${GITHUB_USER}`,
  githubUser: GITHUB_USER,
  linkedin: env.VITE_LINKEDIN || "",
  cvUrl: env.VITE_CV_URL || "",
};

export const experience = fill(experienceData);
export const interests = fill(interestsData);

// `repo` in projects.json / repos.json is just the repository name; the full
// GitHub URL is built from VITE_GITHUB_USER. `images` lists filenames from
// public/images/projects/ (several = carousel); empty falls back to `image`.
export const projects = fill(projectsData).map((p) => ({
  ...p,
  repo: p.repo ? repoUrl(p.repo) : undefined,
}));
export const githubRepos = reposData.map((r) => ({ ...r, url: repoUrl(r.name) }));

export const skills = skillsData;

// A stat either carries its own `value` or is counted `from` another section,
// so the numbers can't drift from what the page actually lists.
const counts = { projects: projects.length, skills: skillsData.languages.length };
export const stats = fill(statsData).map((s) => ({
  label: s.label,
  value: s.from ? String(counts[s.from]) : s.value,
}));

export const homelab = homelabData.items;
export const homelabMore = homelabData.more;
export const localAI = homelabData.localAI;
export const languageStats = languagesData;
