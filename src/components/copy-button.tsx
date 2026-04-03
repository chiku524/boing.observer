"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  label?: string;
  className?: string;
}

export function CopyButton({ value, label = "Copy", className = "" }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleCopy() {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // Fallback for older browsers
      const ta = document.createElement("textarea");
      ta.value = value;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand("copy");
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded px-3 py-2 text-xs font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-network-cyan/50 sm:min-h-0 sm:px-2 sm:py-1 ${
        copied
          ? "bg-green-500/20 text-green-300"
          : "bg-white/5 text-[var(--text-muted)] hover:bg-white/10 hover:text-[var(--text-secondary)]"
      } ${className}`}
      title={label}
      aria-label={copied ? "Copied!" : label}
    >
      {copied ? (
        <>
          <span aria-hidden className="text-green-400">✓</span>
          <span>Copied</span>
        </>
      ) : (
        <>
          <span aria-hidden className="opacity-70">⎘</span>
          <span>{label}</span>
        </>
      )}
    </button>
  );
}
