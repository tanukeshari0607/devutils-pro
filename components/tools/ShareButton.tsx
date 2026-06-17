"use client";

import { Share2 } from "lucide-react";
import { copyToClipboard } from "@/lib/toast";

export function ShareButton({ toolName }: { toolName: string }) {
  const share = () => {
    copyToClipboard(window.location.href, `Link to ${toolName} copied!`);
  };

  return (
    <button onClick={share} className="btn-secondary text-xs py-1.5">
      <Share2 size={13} /> Share
    </button>
  );
}
