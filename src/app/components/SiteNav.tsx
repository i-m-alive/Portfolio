// src/app/components/SiteNav.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const ROUTES = [
  { href: "/", label: "Home" },
  { href: "/professional-ai", label: "AI/ML Career" },
  { href: "/professional", label: "Professional Summary" },
  { href: "/work-experience", label: "Work Experience" },
  { href: "/skills", label: "Skills" },
  { href: "/projects", label: "Projects" },
  { href: "/certificates", label: "Certificates" },
  { href: "/education", label: "Education" },
  { href: "/contact", label: "Contact" },
] as const;

/**
 * Persistent site navigation.
 *
 * Exists so the site has a real, crawlable link graph: before this, every
 * page-to-page transition went through a window CustomEvent -> router.push,
 * which meant zero <a href> tags in the DOM and four pages with no way out.
 */
export default function SiteNav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-[10050] border-b border-white/10 bg-black/70 backdrop-blur-md">
      <nav
        aria-label="Main"
        className="flex items-center gap-3 px-4 py-2 mx-auto max-w-7xl"
      >
        <Link
          href="/"
          className="text-sm font-semibold shrink-0 text-cyan-200 hover:text-cyan-100"
        >
          Kumar Shivraj Bhakat
        </Link>

        {/* desktop */}
        <ul className="items-center hidden gap-1 ml-auto lg:flex">
          {ROUTES.slice(1).map((r) => {
            const active = pathname === r.href;
            return (
              <li key={r.href}>
                <Link
                  href={r.href}
                  aria-current={active ? "page" : undefined}
                  className={`rounded px-2.5 py-1.5 text-[13px] transition-colors ${
                    active
                      ? "bg-cyan-400/15 text-cyan-100"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`}
                >
                  {r.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* mobile toggle */}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="site-nav-mobile"
          className="px-3 py-1.5 ml-auto rounded border border-white/20 text-[13px] text-white/80 lg:hidden"
        >
          {open ? "Close" : "Menu"}
        </button>
      </nav>

      {/* mobile panel — always in the DOM as real links, just visually collapsed */}
      <ul
        id="site-nav-mobile"
        hidden={!open}
        className="grid grid-cols-2 gap-1 px-4 pb-3 lg:hidden"
      >
        {ROUTES.slice(1).map((r) => {
          const active = pathname === r.href;
          return (
            <li key={r.href}>
              <Link
                href={r.href}
                onClick={() => setOpen(false)}
                aria-current={active ? "page" : undefined}
                className={`block rounded px-3 py-2 text-sm ${
                  active
                    ? "bg-cyan-400/15 text-cyan-100"
                    : "text-white/75 hover:bg-white/10"
                }`}
              >
                {r.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </header>
  );
}
