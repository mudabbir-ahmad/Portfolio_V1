import { homelab, localAI } from "../content.js";

export default function Homelab() {
  return (
    <section className="homelab section" id="homelab">
      <div className="container">
        <h2 className="section-title">Homelab &amp; side endeavours</h2>
        <p className="section-lede">
          Everything below runs on hardware I own: a single Proxmox node at home,
          three cloud VPS instances, and the services that live on top of them.
        </p>
        <ul className="homelab-grid">
          {homelab.map((h) => (
            <li key={h.name} className="homelab-item">
              <h3>{h.name}</h3>
              <p>{h.detail}</p>
            </li>
          ))}
        </ul>

        <div className="local-ai">
          <h2 className="section-title">{localAI.heading}</h2>
          {localAI.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
