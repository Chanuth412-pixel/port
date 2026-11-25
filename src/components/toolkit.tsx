"use client";

import Image from "next/image";
import { Braces, Cloud, GitBranch, Server, Workflow } from "lucide-react";
import { useState } from "react";
import type { Focus, TechnologyGroup } from "@/content/portfolio";

const focusIcons = { backend: Server, devops: Workflow, cloud: Cloud, "open-source": GitBranch } satisfies Record<Focus["id"], typeof Server>;

export function Toolkit({ focus, technologyGroups }: { focus: readonly Focus[]; technologyGroups: readonly TechnologyGroup[] }) {
  const groups = technologyGroups.filter(({ technologies }) => technologies.length > 0);
  const [groupId, setGroupId] = useState(groups[0]?.id);
  const [selectedId, setSelectedId] = useState(groups[0]?.technologies[0]?.id ?? focus[0]?.id);
  const group = groups.find(({ id }) => id === groupId);
  const items = group?.technologies ?? focus;
  const selected = items.find(({ id }) => id === selectedId) ?? items[0];
  if (!selected) return null;

  return (
    <div className="toolkit-explorer">
      {groups.length > 0 && (
        <div className="toolkit-filters" role="group" aria-label="Technology categories">
          {groups.map(({ id, name, technologies }) => (
            <button type="button" key={id} aria-pressed={groupId === id} onClick={() => {
              setGroupId(id);
              setSelectedId(technologies[0].id);
            }}>{name}</button>
          ))}
        </div>
      )}
      <div className="toolkit-layout">
        <div className="toolkit-options" role="group" aria-label={group?.name ?? "Engineering interests"}>
          {items.map((item) => {
            const interest = focus.find(({ id }) => id === item.id);
            const Icon = interest ? focusIcons[interest.id] : Braces;
            const logo = "logo" in item ? item.logo : undefined;
            return (
              <button type="button" key={item.id} aria-pressed={selected.id === item.id} onClick={() => setSelectedId(item.id)}>
                <span className="toolkit-logo" aria-hidden="true">
                  <Icon size={22} strokeWidth={1.65} />
                  {logo && <Image src={logo} alt="" width={28} height={28} loading="lazy" onLoad={({ currentTarget }) => { currentTarget.dataset.ready = "true"; }} onError={({ currentTarget }) => { currentTarget.hidden = true; }} />}
                </span>
                <span>{item.name}</span>
              </button>
            );
          })}
        </div>
        <div className="toolkit-detail" aria-live="polite" aria-atomic="true">
          <div key={selected.id} className="detail-content">
            <p className="eyebrow">{group?.name ?? "Area of interest"}</p>
            <h3>{selected.name}</h3>
            <p>{selected.description}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
