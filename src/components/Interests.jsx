import { interests } from "../content.js";
import { Stagger, StaggerItem } from "./Stagger.jsx";
import { Icon } from "./icons.jsx";

export default function Interests() {
  return (
    <section className="interests section" id="interests">
      <div className="container">
        <p className="eyebrow">Beyond the terminal</p>
        <h2 className="section-title">Interests</h2>
        <Stagger className="interest-grid">
          {interests.map((i) => (
            <StaggerItem as="article" key={i.name} className="interest-card">
              <span className="interest-icon">
                <Icon name={i.icon} />
              </span>
              <h3>{i.name}</h3>
              <p>{i.detail}</p>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
