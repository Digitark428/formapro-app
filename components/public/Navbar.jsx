"use client";

import Link from "next/link";
import { useState, useEffect } from "react";
import { Menu, X, ArrowRight } from "lucide-react";
import Logo from "@/components/ui/Logo";

const links = [
  { href: "/#formations", label: "Formations" },
  { href: "/#avantages", label: "Avantages" },
  { href: "/#temoignages", label: "Témoignages" },
  { href: "/contact", label: "Contact" },
];

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled ? "glass border-b border-ink/8" : ""
      }`}
    >
      <nav className="mx-auto flex max-w-6xl items-center justify-between px-5 py-3.5">
        <Link href="/" aria-label="Accueil FormaPro">
          <Logo />
        </Link>

        <div className="hidden items-center gap-1 md:flex">
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              className="rounded-full px-3.5 py-2 text-sm font-medium text-ink/70 transition-colors hover:bg-ink/5 hover:text-ink"
            >
              {l.label}
            </Link>
          ))}
        </div>

        <div className="hidden items-center gap-2 md:flex">
          <Link href="/admin/login" className="btn-ghost">
            Espace admin
          </Link>
          <Link href="/contact" className="btn-primary">
            Demander un devis <ArrowRight size={15} />
          </Link>
        </div>

        <button
          className="grid h-10 w-10 place-items-center rounded-xl border border-ink/10 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label="Menu"
        >
          {open ? <X size={18} /> : <Menu size={18} />}
        </button>
      </nav>

      {open && (
        <div className="glass border-t border-ink/8 md:hidden">
          <div className="mx-auto flex max-w-6xl flex-col gap-1 px-5 py-4">
            {links.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-2.5 text-sm font-medium text-ink/80 hover:bg-ink/5"
              >
                {l.label}
              </Link>
            ))}
            <div className="mt-2 flex flex-col gap-2">
              <Link href="/admin/login" className="btn-ghost w-full" onClick={() => setOpen(false)}>
                Espace admin
              </Link>
              <Link href="/contact" className="btn-primary w-full" onClick={() => setOpen(false)}>
                Demander un devis
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
