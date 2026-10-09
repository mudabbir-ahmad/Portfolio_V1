// Small glyphs for tags, homelab tiles and interest cards. Brand marks come from
// simple-icons (CC0) or the existing skill-icons.js; the generic ones are
// lucide-style strokes (ISC).
import {
  siTailwindcss, siProxmox, siNginx, siTailscale, siEspressif, siArduino, siDiscord,
  siGitlab, siPihole, siVaultwarden, siImmich, siSearxng, siWireguard, siGitea,
  siHomeassistant, siReact, siGnubash,
} from "simple-icons";
import { skillIcons } from "./skill-icons.js";

const si = (icon) => ({ vb: "0 0 24 24", inner: `<path d="${icon.path}"/>` });
const stroke = (inner) => ({
  vb: "0 0 24 24",
  inner: `<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`,
});

const generic = {
  pin: stroke('<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0 1 16 0z"/><circle cx="12" cy="10" r="3"/>'),
  activity: stroke('<path d="M22 12h-4l-3 9L9 3l-3 9H2"/>'),
  layers: stroke('<path d="m12 2 10 5-10 5L2 7z"/><path d="m2 12 10 5 10-5"/><path d="m2 17 10 5 10-5"/>'),
  database: stroke('<ellipse cx="12" cy="5" rx="9" ry="3"/><path d="M3 5v14c0 1.7 4 3 9 3s9-1.3 9-3V5"/><path d="M3 12c0 1.7 4 3 9 3s9-1.3 9-3"/>'),
  sparkles: stroke('<path d="m12 3 1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z"/><path d="M19 15v4M17 17h4"/>'),
  mic: stroke('<rect x="9" y="2" width="6" height="12" rx="3"/><path d="M5 10a7 7 0 0 0 14 0M12 17v5"/>'),
  window: stroke('<rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 9h18"/>'),
  lock: stroke('<rect x="4" y="11" width="16" height="10" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/>'),
  award: stroke('<circle cx="12" cy="8" r="6"/><path d="M8.2 13 7 22l5-3 5 3-1.2-9"/>'),
  network: stroke('<rect x="9" y="2" width="6" height="6" rx="1"/><rect x="2" y="16" width="6" height="6" rx="1"/><rect x="16" y="16" width="6" height="6" rx="1"/><path d="M12 8v4M5 16v-2a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v2"/>'),
  server: stroke('<rect x="2" y="3" width="20" height="8" rx="2"/><rect x="2" y="13" width="20" height="8" rx="2"/><path d="M6 7h.01M6 17h.01"/>'),
  cpu: stroke('<rect x="5" y="5" width="14" height="14" rx="2"/><rect x="9" y="9" width="6" height="6"/><path d="M9 2v3M15 2v3M9 19v3M15 19v3M2 9h3M2 15h3M19 9h3M19 15h3"/>'),
  chip: stroke('<circle cx="12" cy="12" r="9"/><path d="M12 12h.01M12 3v4M12 17v4M3 12h4M17 12h4"/>'),
  phone: stroke('<rect x="6" y="2" width="12" height="20" rx="2.5"/><path d="M11 18h2"/>'),
  cloud: stroke('<path d="M17.5 19a4.5 4.5 0 0 0 .5-9 6 6 0 0 0-11.7 1.5A4 4 0 0 0 7 19z"/>'),
  terminal: stroke('<path d="m4 17 6-6-6-6M12 19h8"/>'),
  chat: stroke('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>'),
  play: stroke('<rect x="2" y="4" width="20" height="16" rx="2"/><path d="m10 9 5 3-5 3z"/>'),
  boxes: stroke('<path d="M21 8 12 3 3 8v8l9 5 9-5z"/><path d="m3 8 9 5 9-5M12 13v8"/>'),
  arrow: stroke('<path d="M5 12h14M13 6l6 6-6 6"/>'),
  external: stroke('<path d="M7 17 17 7M8 7h9v9"/>'),
  download: stroke('<path d="M12 3v12M7 10l5 5 5-5M5 21h14"/>'),
  cap: stroke('<path d="M22 10 12 5 2 10l10 5z"/><path d="M6 12v5c3 2 9 2 12 0v-5"/>'),
};

// Keys match the strings used in src/data/*.json.
export const icons = {
  ...generic,
  // tech stack tags
  "React": si(siReact),
  "React.js": si(siReact),
  "React Native": si(siReact),
  "Expo": skillIcons["Expo"],
  "Node.js": skillIcons["Node.js"],
  "Express.js": skillIcons["Express.js"],
  "Tailwind CSS": si(siTailwindcss),
  "Docker": skillIcons["Docker"],
  "Linux": skillIcons["Linux"],
  "Bash": si(siGnubash),
  "JavaScript": skillIcons["JavaScript"],
  "Python": skillIcons["Python"],
  "Java": skillIcons["Java"],
  "Kotlin": skillIcons["Kotlin"],
  "Android Studio": skillIcons["Android Studio"],
  "ESP32": si(siEspressif),
  "Arduino": si(siArduino),
  "Proxmox": si(siProxmox),
  "Nginx": si(siNginx),
  "Tailscale": si(siTailscale),
  "Discord API": si(siDiscord),
  "GitLab": si(siGitlab),
  "GPS": generic.pin,
  "Sensor APIs": generic.activity,
  "MVVM": generic.layers,
  "Room": generic.database,
  "LLM": generic.sparkles,
  "Voice": generic.mic,
  "Swing": generic.window,
  "Networking": generic.network,
  "Private repo": generic.lock,
  // homelab tiles
  "Own Media Server": generic.play,
  "SearXNG": si(siSearxng),
  "Dockhand": generic.boxes,
  "Pi-hole + AdGuard Home": si(siPihole),
  "3 cloud VPS instances": generic.cloud,
  "OpenVPN + WireGuard": si(siWireguard),
  "OpenWebUI": generic.chat,
  "Gitea": si(siGitea),
  "Vaultwarden": si(siVaultwarden),
  "Immich": si(siImmich),
  "Home Assistant": si(siHomeassistant),
  "Termix": generic.terminal,
};

export function Icon({ name, className = "icon" }) {
  const icon = icons[name];
  if (!icon) return null;
  return (
    <svg
      viewBox={icon.vb}
      fill="currentColor"
      className={className}
      aria-hidden="true"
      dangerouslySetInnerHTML={{ __html: icon.inner }}
    />
  );
}
