"use client";

import { Check, Copy } from "lucide-react";
import { useState } from "react";

export function CopyEmail({ email }: { email: string }) {
  const [status, setStatus] = useState("");

  async function copy() {
    try {
      await navigator.clipboard.writeText(email);
      setStatus("Email copied to clipboard.");
    } catch {
      setStatus("Could not copy. You can select the email address to copy it.");
    }
  }

  return (
    <div className="copy-email">
      <button className="button button-secondary" type="button" onClick={copy}>
        {status === "Email copied to clipboard." ? <Check size={17} aria-hidden="true" /> : <Copy size={17} aria-hidden="true" />}
        Copy email
      </button>
      <span className="copy-status" role="status">{status}</span>
    </div>
  );
}
