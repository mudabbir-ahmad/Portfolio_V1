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

export default function App() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <Stats />
        <About />
        <Experience />
        <Projects />
        <PushTracker />
        <GitHubGrid />
        <SkillsCarousel />
        <Interests />
        <Homelab />
      </main>
      <Contact />
    </>
  );
}
