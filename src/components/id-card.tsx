"use client";

import Image from "next/image";
import { RotateCcw } from "lucide-react";
import { motion, useMotionValue, useSpring } from "motion/react";
import { useState } from "react";
import type { Focus, Identity } from "@/content/portfolio";

export function IdCard({ portrait, identity, focus }: { portrait: string | null; identity: Identity; focus: readonly Focus[] }) {
  const [flipped, setFlipped] = useState(false);
  const restAngle = -4;
  const angle = useMotionValue(restAngle);
  const swing = useSpring(angle, { stiffness: 88, damping: 13 });

  return (
    <div className="badge-display">
      <motion.div className="badge-hanging" style={{ rotate: swing }}>
        <div className="lanyard" aria-hidden="true">
          <span /><span /><i /><b />
        </div>
        <button
          className="id-card"
          type="button"
          aria-label="Flip developer ID"
          aria-pressed={flipped}
          aria-describedby="id-card-description"
          data-flipped={flipped}
          onClick={() => setFlipped(!flipped)}
          onPointerMove={(event) => {
            if (event.pointerType !== "mouse" || matchMedia("(prefers-reduced-motion: reduce)").matches) return;
            const bounds = event.currentTarget.getBoundingClientRect();
            angle.set((event.clientX - bounds.left) / bounds.width * 14 - 7);
          }}
          onPointerLeave={() => { if (!matchMedia("(prefers-reduced-motion: reduce)").matches) angle.set(restAngle); }}
        >
          <span className="id-card-inner">
            <span className="id-face id-front" aria-hidden={flipped}>
              <span className="id-slot" aria-hidden="true" />
              <span className="id-header"><span>{identity.mark}</span> Developer ID</span>
              {portrait && <span className="id-photo"><Image src={portrait} alt="" fill sizes="170px" /></span>}
              <span className="id-name">{identity.name ?? identity.role}</span>
              {identity.name && <span className="id-role">{identity.role}</span>}
            </span>
            <span className="id-face id-back" aria-hidden={!flipped}>
              <span className="id-slot" aria-hidden="true" />
              <span className="id-header"><span>{identity.mark}</span> Developer ID</span>
              <span className="id-back-label">Engineering interests</span>
              {focus.map(({ id, name }) => <span key={id} className="id-interest">{name}</span>)}
            </span>
          </span>
        </button>
      </motion.div>
      <p className="badge-instruction" id="id-card-description">
        <RotateCcw size={13} aria-hidden="true" />
        Select to flip the ID
      </p>
      <span className="sr-only" role="status">{flipped ? `Back of developer ID. ${focus.map(({ name }) => name).join(", ")}.` : "Front of developer ID."}</span>
    </div>
  );
}
