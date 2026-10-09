import Nav from "./components/Nav.jsx";
import Hero from "./components/Hero.jsx";
import Stats from "./components/Stats.jsx";
import About from "./components/About.jsx";
import Experience from "./components/Experience.jsx";
import Projects from "./components/Projects.jsx";
import PushTracker from "./components/PushTracker.jsx";
import GitHubGrid from "./components/GitHubGrid.jsx";
import SkillsCarousel from "./components/SkillsCarousel.jsx";
import Interests from "./components/Interests.jsx";
import Homelab from "./components/Homelab.jsx";
import Contact from "./components/Contact.jsx";
import Cursor from "./components/Cursor.jsx";
import Reveal from "./components/Reveal.jsx";

// Hero animates itself on load. Sections whose cards stagger in on their own
// (experience, projects, repos, interests, homelab) are not wrapped in Reveal,
// so the two effects don't stack.
export default function App() {
  return (
    <>
      <Cursor />
      <Nav />
      <main>
        <Hero />
        <Reveal delay={0.05}>
          <Stats />
        </Reveal>
        <Reveal>
          <About />
        </Reveal>
        <Experience />
        <Projects />
        <Reveal>
          <PushTracker />
        </Reveal>
        <GitHubGrid />
        <Reveal>
          <SkillsCarousel />
        </Reveal>
        <Interests />
        <Homelab />
      </main>
      <Reveal>
        <Contact />
      </Reveal>
    </>
  );
}
