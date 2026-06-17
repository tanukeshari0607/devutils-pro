"use client";

import { useEffect } from "react";
import { recordToolUse } from "@/lib/usage";

export function UsageTracker({ slug }: { slug: string }) {
  useEffect(() => {
    recordToolUse(slug);
  }, [slug]);

  return null;
}
