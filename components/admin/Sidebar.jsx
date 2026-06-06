"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BellRing, FileText, PenLine, Archive,
  LogOut, X,
} from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useStore } from "@/lib/store";
import { daysSince } from "@/lib/utils";

const NAV = [
  { href: "/admin/dashboard", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/crm", label: "CRM Prospects", icon: Users, key: "crm" },
  { href: "/admin/relances", label: "Relances", icon: BellRing, key: "relances" },
  { href: "/admin/documents", label: "Documents", icon: FileText },
  { href: "/admin/signature", label: "Signature", icon: PenLine, key: "signature" },
  { href: "/admin/archivage", label: "Archivage", icon: Archive },
];

export default function Sidebar({ mobileOpen, onClose }) {
  const pathname = usePathname();
  const { prospects, signatures, logout } = useStore();

  const badge = (key) => {
    if (key === "crm") return prospects.filter((p) => p.status === "nouveau").length;
    if (key === "relances")
      return prospects.filter((p) => daysSince(p.lastActivity) >= 7 && !["gagne", "perdu"].includes(p.status)).length;
    if (key === "signature") return signatures.filter((s) => s.statut !== "signe").length;
    return 0;
  };

  return (
    <>
      {mobileOpen && (
        <div className="fixed inset-0 z-40 bg-ink/40 backdrop-blur-sm lg:hidden" onClick={onClose} />
      )}
      <aside
        className={`fixed inset-y-0 left-0 z-50 flex w-[262px] flex-col border-r border-ink/8 bg-white transition-transform duration-300 lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between px-5 py-4">
          <Link href="/admin/dashboard"><Logo /></Link>
          <button className="lg:hidden" onClick={onClose}><X size={20} /></button>
        </div>

        <div className="mx-3 mb-3 rounded-xl bg-cream px-3 py-2.5">
          <div className="text-[0.7rem] font-semibold uppercase tracking-wider text-ink-muted">
            Organisme
          </div>
          <div className="mt-0.5 text-sm font-semibold text-ink">FormaPro Conseil</div>
        </div>

        <nav className="flex-1 space-y-1 px-3">
          {NAV.map((item) => {
            const active = pathname === item.href;
            const Icon = item.icon;
            const count = item.key ? badge(item.key) : 0;
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                  active
                    ? "bg-ink text-cream"
                    : "text-ink/70 hover:bg-ink/5 hover:text-ink"
                }`}
              >
                <Icon size={18} className={active ? "text-teal-300" : ""} />
                <span className="flex-1">{item.label}</span>
                {count > 0 && (
                  <span
                    className={`grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.7rem] font-bold ${
                      active ? "bg-teal-400 text-ink" : "bg-teal-500 text-white"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>

        <div className="border-t border-ink/8 p-3">
          <div className="flex items-center gap-3 rounded-xl px-2 py-2">
            <span className="grid h-9 w-9 place-items-center rounded-full bg-teal-500 text-sm font-bold text-white">
              SF
            </span>
            <div className="flex-1 leading-tight">
              <div className="text-sm font-semibold text-ink">Sophie Fournier</div>
              <div className="text-xs text-ink-muted">Administratrice</div>
            </div>
          </div>
          <button
            onClick={logout}
            className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ink/60 transition-colors hover:bg-red-50 hover:text-red-600"
          >
            <LogOut size={18} /> Déconnexion
          </button>
        </div>
      </aside>
    </>
  );
}
