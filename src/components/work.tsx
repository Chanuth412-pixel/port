import { ChevronDown, GitMerge, GitPullRequest, GitPullRequestClosed } from "lucide-react";
import { portfolio, type PullRequest } from "@/content/portfolio";
import { Architecture } from "./architecture";
import { Reveal } from "./reveal";

const statuses = {
  merged: { label: "Merged", icon: GitMerge },
  open: { label: "Open", icon: GitPullRequest },
  closed: { label: "Closed", icon: GitPullRequestClosed },
} satisfies Record<PullRequest["status"], { label: string; icon: typeof GitMerge }>;

export function Contributions() {
  const { contributions } = portfolio;
  return (
    <section className="section contributions-section" id="open-source" aria-labelledby="open-source-title" tabIndex={-1}>
      <div className="shell work-split">
        <div className="section-intro">
          <p className="eyebrow section-label">Open Source</p>
          <h2 id="open-source-title">Working<br /><em>in the open.</em></h2>
          <p>Pull requests with the context behind each change and the discussion on GitHub.</p>
        </div>
        <div className="contribution-list">
          {contributions.length ? contributions.map((pr) => {
            const { label, icon: Icon } = statuses[pr.status];
            return (
              <details className="contribution" key={`${pr.repository}#${pr.number}`}>
                <summary>
                  <span className="contribution-title">
                    <span className="contribution-meta">{pr.repository} · #{pr.number} · {pr.type}</span>
                    <strong>{pr.title}</strong>
                  </span>
                  <span className="pr-status" data-status={pr.status}><Icon size={16} aria-hidden="true" />{label}</span>
                  <ChevronDown size={18} className="contribution-chevron" aria-hidden="true" />
                </summary>
                <div className="contribution-body">
                  <dl><div><dt>Problem</dt><dd>{pr.problem}</dd></div><div><dt>Solution</dt><dd>{pr.solution}</dd></div></dl>
                  <div className="contribution-footer">
                    <a className="text-link" href={pr.url}>View pull request #{pr.number} on GitHub</a>
                    <span>Verified <time dateTime={pr.verifiedOn}>{pr.verifiedOn}</time></span>
                  </div>
                </div>
              </details>
            );
          }) : (
            <div className="section-empty"><GitPullRequest size={25} strokeWidth={1.5} aria-hidden="true" /><p>Verified pull requests are pending.</p></div>
          )}
        </div>
      </div>
    </section>
  );
}

export function Projects() {
  const { projects } = portfolio;
  return (
    <section className="section projects-section" id="projects" aria-labelledby="projects-title" tabIndex={-1}>
      <div className="shell">
        <div className="section-intro">
          <p className="eyebrow section-label">Projects</p>
          <h2 id="projects-title">Engineering <em>projects.</em></h2>
        </div>
        {projects.length ? (
          <div className="project-list">
            {projects.map((project, index) => (
              <Reveal key={project.id}>
                <article className="project">
                  <div className="project-intro">
                    <p className="eyebrow project-context">{project.context}</p>
                    <h3>{project.name}</h3>
                    <p>{project.summary}</p>
                    {project.technologies.length > 0 && <ul className="project-technologies" aria-label="Technologies">{project.technologies.map((technology) => <li key={technology}>{technology}</li>)}</ul>}
                    {(project.repositoryUrl || project.demoUrl || project.article) && <div className="project-links">
                      {project.repositoryUrl && <a className="text-link" href={project.repositoryUrl}>Repository<span className="sr-only"> for {project.name}</span></a>}
                      {project.demoUrl && <a className="text-link" href={project.demoUrl}>Live site<span className="sr-only"> for {project.name}</span></a>}
                      {project.article && <a className="text-link" href={project.article.url}>{project.article.label}</a>}
                    </div>}
                  </div>
                  <details className="project-detail" open={index === 0}>
                    <summary>Engineering notes<span className="sr-only"> for {project.name}</span><ChevronDown size={18} aria-hidden="true" /></summary>
                    <div className="project-body">
                      <dl>
                        <div><dt>Problem</dt><dd>{project.problem}</dd></div>
                        <div><dt>Implementation</dt><dd>{project.implementation}</dd></div>
                        {project.decisions.length > 0 && <div><dt>Engineering decisions</dt><dd><ul>{project.decisions.map((decision) => <li key={decision}>{decision}</li>)}</ul></dd></div>}
                      </dl>
                      {project.architecture && <Architecture diagram={project.architecture} />}
                    </div>
                  </details>
                </article>
              </Reveal>
            ))}
          </div>
        ) : <p className="project-empty">Project write-ups are pending.</p>}
      </div>
    </section>
  );
}
