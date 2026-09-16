import { interests } from "../content.js";

export default function Interests() {
  return (
    <section className="interests section" id="interests">
      <div className="container">
        <p className="eyebrow">Beyond the terminal</p>
        <h2 className="section-title">Interests</h2>
        <div className="interest-grid">
          {interests.map((i) => (
            <article key={i.name} className="interest-card">
              <h3>{i.name}</h3>
              <p>{i.detail}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
