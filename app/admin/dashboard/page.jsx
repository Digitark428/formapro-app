"use client";

import Link from "next/link";
import {
  Users, UserCheck, FolderClock, CalendarClock, FileSignature,
  ArrowUpRight, AlertTriangle, Phone, Mail, CalendarCheck, StickyNote, Plus,
  BellRing, FileText,
} from "lucide-react";
import StatCard from "@/components/admin/StatCard";
import { AreaChart, BarChart, Donut } from "@/components/ui/Charts";
import { useStore } from "@/lib/store";
import { STATUSES, statusById, KPI_SERIES } from "@/lib/mockData";
import { relativeTime, daysSince } from "@/lib/utils";

const ACT_ICONS = { creation: Plus, assignation: UserCheck, appel: Phone, email: Mail, rdv: CalendarCheck, statut: ArrowUpRight, note: StickyNote, relance: BellRing, doc: FileText };

export default function DashboardPage() {
  const { prospects, signatures, documents } = useStore();

  const clients = prospects.filter((p) => p.status === "gagne");
  const enAttente = prospects.filter((p) => ["attente", "proposition"].includes(p.status));
  const aPlanifier = clients.length; // formations gagnées à planifier
  const docsASigner = signatures.filter((s) => s.statut !== "signe");

  // Pipeline distribution
  const pipeline = STATUSES.map((s) => ({
    ...s,
    value: prospects.filter((p) => p.status === s.id).length,
  })).filter((s) => s.value > 0);

  // Recent activity (flatten histories)
  const activity = prospects
    .flatMap((p) =>
      p.historique.map((h) => ({ ...h, prospect: `${p.prenom} ${p.nom}`, entreprise: p.entreprise }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 7);

  return (
    <div className="reveal mx-auto max-w-7xl space-y-5">
      {/* KPI cards */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        <StatCard icon={Users} label="Prospects" value={prospects.length} trend={12} accent="#0FA980" sub="Total dans le pipeline" />
        <StatCard icon={UserCheck} label="Clients" value={clients.length} trend={8} accent="#1D4ED8" sub="Affaires gagnées" />
        <StatCard icon={FolderClock} label="Dossiers en attente" value={enAttente.length} trend={-3} accent="#0E7490" sub="Propositions & en attente" />
        <StatCard icon={CalendarClock} label="Formations à planifier" value={aPlanifier} trend={5} accent="#E89B1E" sub="Sessions à caler" />
        <StatCard icon={FileSignature} label="Documents à signer" value={docsASigner.length} trend={-2} accent="#7C3AED" sub="En attente de signature" />
      </div>

      {/* Charts row */}
      <div className="grid gap-4 lg:grid-cols-3">
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-display text-base font-bold text-ink">Acquisition de prospects</h3>
              <p className="text-sm text-ink-muted">6 derniers mois</p>
            </div>
            <span className="chip bg-teal-50 text-teal-700">+22% vs S-1</span>
          </div>
          <AreaChart data={KPI_SERIES.prospectsParMois} color="#0FA980" height={200} />
          <div className="mt-1 flex justify-between px-1 text-xs text-ink-muted">
            {KPI_SERIES.prospectsParMois.map((d) => <span key={d.mois}>{d.mois}</span>)}
          </div>
        </div>

        <div className="card p-6">
          <h3 className="font-display text-base font-bold text-ink">Répartition du pipeline</h3>
          <p className="text-sm text-ink-muted">Par statut</p>
          <div className="mt-4 flex items-center gap-5">
            <Donut segments={pipeline.map((p) => ({ value: p.value, color: p.color }))} size={140} thickness={20} />
            <ul className="flex-1 space-y-1.5 text-sm">
              {pipeline.map((p) => (
                <li key={p.id} className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: p.color }} />
                  <span className="flex-1 truncate text-ink/70">{p.label}</span>
                  <span className="font-semibold text-ink">{p.value}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom row */}
      <div className="grid gap-4 lg:grid-cols-3">
        {/* Activity */}
        <div className="card p-6 lg:col-span-2">
          <div className="flex items-center justify-between">
            <h3 className="font-display text-base font-bold text-ink">Activité récente</h3>
            <Link href="/admin/crm" className="text-sm font-semibold text-teal-600 hover:underline">
              Tout voir
            </Link>
          </div>
          <ul className="mt-4 space-y-1">
            {activity.map((a) => {
              const Icon = ACT_ICONS[a.type] || StickyNote;
              return (
                <li key={a.id} className="flex items-start gap-3 rounded-xl px-2 py-2.5 transition-colors hover:bg-cream">
                  <span className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-ink/5 text-ink/60">
                    <Icon size={15} />
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="text-sm text-ink">
                      <span className="font-semibold">{a.prospect}</span>{" "}
                      <span className="text-ink-muted">· {a.entreprise}</span>
                    </p>
                    <p className="truncate text-sm text-ink-muted">{a.texte}</p>
                  </div>
                  <span className="shrink-0 text-xs text-ink/40">{relativeTime(a.date)}</span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Alerts + CA */}
        <div className="space-y-4">
          <div className="card overflow-hidden">
            <div className="flex items-center gap-2 border-b border-ink/8 bg-amber-50 px-5 py-3">
              <AlertTriangle size={16} className="text-amber-500" />
              <h3 className="font-display text-sm font-bold text-ink">Alertes</h3>
            </div>
            <ul className="divide-y divide-ink/6">
              <AlertRow
                label="Prospects sans activité (7j+)"
                value={prospects.filter((p) => daysSince(p.lastActivity) >= 7 && !["gagne", "perdu"].includes(p.status)).length}
                href="/admin/relances"
              />
              <AlertRow
                label="Conventions à signer"
                value={signatures.filter((s) => s.statut !== "signe").length}
                href="/admin/signature"
              />
              <AlertRow
                label="Nouveaux prospects à traiter"
                value={prospects.filter((p) => p.status === "nouveau").length}
                href="/admin/crm"
              />
            </ul>
          </div>

          <div className="card p-6">
            <h3 className="font-display text-sm font-bold text-ink">Chiffre d'affaires (k€)</h3>
            <BarChart data={KPI_SERIES.caParMois} color="#1D4ED8" height={150} />
            <div className="mt-1 flex justify-between px-0.5 text-xs text-ink-muted">
              {KPI_SERIES.caParMois.map((d) => <span key={d.mois}>{d.mois}</span>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AlertRow({ label, value, href }) {
  return (
    <Link href={href} className="flex items-center justify-between px-5 py-3 transition-colors hover:bg-cream">
      <span className="text-sm text-ink/75">{label}</span>
      <span className="inline-flex items-center gap-2">
        <span className={`font-display text-lg font-bold ${value > 0 ? "text-ink" : "text-ink/30"}`}>{value}</span>
        <ArrowUpRight size={15} className="text-ink/40" />
      </span>
    </Link>
  );
}
