import { ArrowDown, Download } from "lucide-react";
import { Character } from "@/components/character";
import { CopyEmail } from "@/components/contact";
import { IdCard } from "@/components/id-card";
import { Navigation } from "@/components/navigation";
import { Reveal } from "@/components/reveal";
import { Toolkit } from "@/components/toolkit";
import { Contributions, Projects } from "@/components/work";
import { getPortfolioMedia } from "@/content/media";
import { portfolio } from "@/content/portfolio";

const { identity, hero, about, focus, timeline, achievements, contact, technologyGroups } = portfolio;

export default function Home() {
  const { character, portrait, resume } = getPortfolioMedia();

  return (
    <>
      <Navigation mark={identity.mark} name={identity.name} />
      <main id="main" tabIndex={-1}>
        <section className="hero" id="home" aria-labelledby="hero-title">
          <div className="shell hero-inner">
            <div className="hero-copy">
              <p className="eyebrow hero-eyebrow hero-enter"><span />{identity.role}</p>
              <h1 id="hero-title">
                <span className="hero-title-line hero-enter">{hero.title}</span>{" "}
                <em className="hero-title-accent hero-enter">{hero.accent}</em>
              </h1>
              <p className="hero-description hero-enter">{hero.description}</p>
              <div className="hero-actions hero-enter">
                <a className="button button-primary" href="#projects">Explore projects</a>
                {resume && <a className="button button-secondary" href={resume} download><Download size={17} aria-hidden="true" /> Résumé</a>}
                <a className="button button-text" href="#contact">Get in touch</a>
              </div>
            </div>
            <div className="hero-visual">{character && <Character media={character} name={identity.name} />}</div>
            <div className="hero-footer">
              <a href="#about"><ArrowDown size={16} aria-hidden="true" /> About me</a>
            </div>
          </div>
        </section>

        <section className="section about-section" id="about" aria-labelledby="about-title" tabIndex={-1}>
          <div className="shell about-layout">
            <div className="section-intro about-intro">
              <p className="eyebrow section-label">About</p>
              <h2 id="about-title">{about.title}<br /><em>{about.accent}</em></h2>
              <p>{about.description}</p>
            </div>
            <IdCard portrait={portrait} identity={identity} focus={focus} />
            <div className="about-focus">
              <h3 className="eyebrow">Engineering interests</h3>
              <ul>{focus.map(({ id, name }) => <li key={id}>{name}</li>)}</ul>
            </div>
          </div>
        </section>

        <section className="section toolkit-section" id="toolkit" aria-labelledby="toolkit-title" tabIndex={-1}>
          <div className="shell work-split">
            <div className="section-intro">
              <p className="eyebrow section-label">Toolkit</p>
              <h2 id="toolkit-title">{technologyGroups.some(({ technologies }) => technologies.length) ? <>Tools of<br /><em>the trade.</em></> : <>What I’m<br /><em>exploring.</em></>}</h2>
            </div>
            <Toolkit focus={focus} technologyGroups={technologyGroups} />
          </div>
        </section>

        <Contributions />
        <Projects />

        <section className="section journey-section" id="journey" aria-labelledby="journey-title" tabIndex={-1}>
          <div className="shell work-split">
            <div className="section-intro">
              <p className="eyebrow section-label">Journey</p>
              <h2 id="journey-title">Experience<br /><em>&amp; education.</em></h2>
            </div>
            <div>
              {timeline.length ? <ol className="timeline">{timeline.map((entry) => (
                <li key={entry.id}>
                  <Reveal>
                    <p className="eyebrow timeline-kind">{entry.kind}</p>
                    <h3>{entry.title}</h3>
                    <p className="timeline-organization">{entry.organization}{entry.period && <span> · {entry.period}</span>}</p>
                    {entry.description && <p>{entry.description}</p>}
                    {entry.evidence && <a className="text-link timeline-evidence" href={entry.evidence}>View certificate<span className="sr-only"> for {entry.title}</span></a>}
                  </Reveal>
                </li>
              ))}</ol> : <p className="section-empty">Résumé details are pending.</p>}
              {achievements.length > 0 && <div className="achievements">
                <h3 className="eyebrow">Competitions</h3>
                <dl>{achievements.map(({ name, result }) => <div key={name}><dt>{name}</dt><dd>{result}</dd></div>)}</dl>
              </div>}
            </div>
          </div>
        </section>

        <section className="section contact-section" id="contact" aria-labelledby="contact-title" tabIndex={-1}>
          <div className="shell">
            <p className="eyebrow section-label">Contact</p>
            <h2 id="contact-title">Let’s talk <em>engineering.</em></h2>
            {contact.email && <div className="contact-email">
              <a className="contact-address" href={`mailto:${contact.email}`}>{contact.email}</a>
              <CopyEmail email={contact.email} />
            </div>}
            {contact.links.length > 0 && <ul className="contact-links">{contact.links.map(({ label, url }) => <li key={url}><a className="text-link" href={url}>{label}</a></li>)}</ul>}
            {!contact.email && contact.links.length === 0 && <p className="contact-empty">Contact details are pending.</p>}
          </div>
        </section>
      </main>
      <footer className="site-footer">
        <div className="shell">
          <span>{identity.name ?? "Engineering Portfolio"}</span>
          <a href="#home">Back to top</a>
        </div>
      </footer>
    </>
  );
}
