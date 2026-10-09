import { Icon } from "./icons.jsx";

// Pill used for tech stacks and labels. Picks up a glyph when icons.jsx has one
// for the label; plain text otherwise.
export default function Tag({ children, variant }) {
  return (
    <span className={`tag${variant ? ` tag--${variant}` : ""}`}>
      <Icon name={children} className="tag-icon" />
      {children}
    </span>
  );
}
