"use client";

import { usePathname } from "next/navigation";
import { Menu, Search, Bell, RotateCcw } from "lucide-react";
import { useStore } from "@/lib/store";
import { daysSince } from "@/lib/utils";

const TITLES = {
  "/admin/dashboard": "Tableau de bord",
  "/admin/crm": "CRM — Prospects",
  "/admin/relances": "Relances & notifications",
  "/admin/documents": "Génération de documents",
  "/admin/signature": "Signature électronique",
  "/admin/archivage": "Archivage documentaire",
};

export default function Topbar({ onMenu }) {
  const pathname = usePathname();
  const { prospects, signatures, resetDemo } = useStore();

  const alerts =
    prospects.filter((p) => daysSince(p.lastActivity) >= 7 && !["gagne", "perdu"].includes(p.status)).length +
    signatures.filter((s) => s.statut !== "signe").length;

  return (
    <header className="sticky top-0 z-30 flex items-center gap-3 border-b border-ink/8 glass px-4 py-3 sm:px-6">
      <button className="grid h-9 w-9 place-items-center rounded-lg border border-ink/10 lg:hidden" onClick={onMenu}>
        <Menu size={18} />
      </button>

      <div className="min-w-0 flex-1">
        <h1 className="truncate font-display text-lg font-bold text-ink">
          {TITLES[pathname] || "Espace admin"}
        </h1>
      </div>

      <div className="relative hidden md:block">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        <input
          placeholder="Rechercher…"
          className="w-56 rounded-full border border-ink/10 bg-white/70 py-2 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
        />
      </div>

      <button
        onClick={resetDemo}
        title="Réinitialiser les données de démo"
        className="hidden items-center gap-1.5 rounded-full border border-ink/10 bg-white/70 px-3 py-2 text-xs font-semibold text-ink/70 transition-colors hover:border-ink/25 hover:text-ink sm:inline-flex"
      >
        <RotateCcw size={14} /> Réinitialiser
      </button>

      <button className="relative grid h-9 w-9 place-items-center rounded-full border border-ink/10 bg-white/70 text-ink/70 transition-colors hover:text-ink">
        <Bell size={17} />
        {alerts > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-4 min-w-4 place-items-center rounded-full bg-red-500 px-1 text-[0.65rem] font-bold text-white">
            {alerts}
          </span>
        )}
      </button>
    </header>
  );
}
