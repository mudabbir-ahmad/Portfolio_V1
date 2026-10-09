import { homelab, homelabMore, localAI } from "../content.js";
import { Stagger, StaggerItem } from "./Stagger.jsx";
import { Icon } from "./icons.jsx";

export default function Homelab() {
  return (
    <section className="homelab section" id="homelab">
      <div className="container">
        <p className="eyebrow">Infrastructure</p>
        <h2 className="section-title">Homelab &amp; side endeavours</h2>
        <p className="section-lede">
          Everything below runs on hardware I own: a single Proxmox node at home,
          three cloud VPS instances, and the services that live on top of them.
        </p>
        <Stagger as="ul" className="homelab-grid" gap={0.04}>
          {homelab.map((h) => (
            <StaggerItem as="li" key={h.name} className="homelab-item">
              <span className="homelab-icon">
                <Icon name={h.name} />
              </span>
              <div>
                <h3>
                  {h.name}
                  {h.wip && <span className="homelab-wip">In progress</span>}
                </h3>
                <p>{h.detail}</p>
              </div>
            </StaggerItem>
          ))}
        </Stagger>
        <p className="homelab-more">{homelabMore}</p>

        <div className="local-ai">
          <span className="local-ai-icon">
            <Icon name="cpu" />
          </span>
          <h3 className="section-title">{localAI.heading}</h3>
          {localAI.body.map((p) => (
            <p key={p.slice(0, 24)}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
