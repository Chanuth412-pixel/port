"use client";

import { Box, Cloud, Database, GitBranch, PanelsTopLeft } from "lucide-react";
import { useState } from "react";
import type { Architecture as Diagram, ArchitectureNode } from "@/content/portfolio";

const nodeKinds = {
  interface: { label: "Interface", icon: PanelsTopLeft },
  service: { label: "Service", icon: Box },
  data: { label: "Data", icon: Database },
  pipeline: { label: "Pipeline", icon: GitBranch },
  infrastructure: { label: "Infrastructure", icon: Cloud },
} satisfies Record<ArchitectureNode["kind"], { label: string; icon: typeof Box }>;

export function Architecture({ diagram }: { diagram: Diagram }) {
  const [selectedId, setSelectedId] = useState(diagram.nodes[0]?.id);
  const selected = diagram.nodes.find(({ id }) => id === selectedId) ?? diagram.nodes[0];
  const nodeById = new Map(diagram.nodes.map((node) => [node.id, node]));
  if (!selected) return null;

  function nodeButton(node: ArchitectureNode) {
    const Icon = nodeKinds[node.kind].icon;
    return (
      <button type="button" aria-pressed={selected.id === node.id} onClick={() => setSelectedId(node.id)}>
        <Icon size={17} aria-hidden="true" /> <span>{node.name}</span>
      </button>
    );
  }

  const connections = diagram.connections.flatMap(({ from, to, label }) => {
    const source = nodeById.get(from);
    const target = nodeById.get(to);
    return source && target ? [{ source, target, label }] : [];
  });
  const connected = new Set(connections.flatMap(({ source, target }) => [source.id, target.id]));

  return (
    <figure className="architecture">
      <figcaption>{diagram.title}{diagram.illustrative && <span>Illustrative diagram</span>}</figcaption>
      <ul className="architecture-connections" aria-label="Component connections">
        {connections.map(({ source, target, label }, index) => (
          <li key={`${source.id}-${target.id}-${index}`} data-related={source.id === selected.id || target.id === selected.id}>
            {nodeButton(source)}
            <span className="architecture-edge"><span>{label}</span><span className="sr-only">to</span></span>
            {nodeButton(target)}
          </li>
        ))}
      </ul>
      <div className="architecture-nodes" role="group" aria-label="Independent components">
        {diagram.nodes.filter(({ id }) => !connected.has(id)).map((node) => <div key={node.id}>{nodeButton(node)}</div>)}
      </div>
      <div className="architecture-detail" aria-live="polite" aria-atomic="true">
        <div key={selected.id} className="detail-content">
          <strong>{selected.name}</strong> <span>{nodeKinds[selected.kind].label}</span>
          <p>{selected.description}</p>
        </div>
      </div>
    </figure>
  );
}
