"use client";

import Link from "next/link";
import { NetworkSelector } from "./network-selector";
import { SearchBar } from "./search-bar";

export function Header() {
  return (
    <header
      className="sticky top-0 z-50 border-b border-[var(--border-color)] bg-boing-black/90 backdrop-blur-md"
      role="banner"
    >
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6">
        <Link
          href="/"
          className="font-display text-lg font-bold tracking-tight text-[var(--text-primary)] hover:text-network-primary-light transition-colors shrink-0"
          aria-label="Boing Observer - Home"
        >
          ⬡ Boing Observer
        </Link>
        <div className="hidden md:block flex-1 max-w-md" role="search">
          <SearchBar />
        </div>
        <nav className="flex items-center gap-4 shrink-0" aria-label="Main navigation">
          <Link
            href="/"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Home
          </Link>
          <Link
            href="/about"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            About
          </Link>
          <a
            href="https://boing.network/network/faucet"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            Faucet
          </a>
          <NetworkSelector />
        </nav>
      </div>
    </header>
  );
}
