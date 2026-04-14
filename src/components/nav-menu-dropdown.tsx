"use client";

import Link from "next/link";
import { useEffect, useId, useRef, useState } from "react";

export type NavMenuItem = { href: string; label: string; external?: boolean };

type NavMenuDropdownProps = {
  label: string;
  items: readonly NavMenuItem[];
};

export function NavMenuDropdown({ label, items }: NavMenuDropdownProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);
  const menuId = useId();

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onDoc);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  return (
    <div className="relative" ref={ref}>
      <button
        type="button"
        id={`${menuId}-btn`}
        aria-expanded={open}
        aria-haspopup="menu"
        aria-controls={menuId}
        className="nav-link flex items-center gap-0.5 whitespace-nowrap px-1 py-2 text-sm"
        onClick={() => setOpen((v) => !v)}
      >
        {label}
        <span className="select-none text-[10px] leading-none opacity-70" aria-hidden>
          ▾
        </span>
      </button>
      {open ? (
        <div
          id={menuId}
          role="menu"
          aria-labelledby={`${menuId}-btn`}
          className="absolute left-0 top-full z-[300] mt-1 min-w-[12rem] rounded-lg border border-[var(--border-color)] bg-[color-mix(in_srgb,var(--card-bg)_96%,transparent)] py-1 shadow-xl backdrop-blur-xl"
        >
          {items.map((it) =>
            it.external ? (
              <a
                key={it.href}
                role="menuitem"
                href={it.href}
                target="_blank"
                rel="noopener noreferrer"
                className="block px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </a>
            ) : (
              <Link
                key={it.href}
                role="menuitem"
                href={it.href}
                className="block px-3 py-2 text-sm text-[var(--text-primary)] hover:bg-white/5"
                onClick={() => setOpen(false)}
              >
                {it.label}
              </Link>
            ),
          )}
        </div>
      ) : null}
    </div>
  );
}
