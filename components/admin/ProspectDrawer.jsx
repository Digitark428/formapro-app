"use client";

import { useState } from "react";
import {
  X, Phone, Mail, MapPin, Hash, Users, Briefcase, Building2, GraduationCap,
  Plus, Send, Clock, ArrowUpRight, StickyNote, CalendarCheck, ChevronDown,
} from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui/Badge";
import { STATUSES, statusById, FORMATIONS } from "@/lib/mockData";
import { formatDateTime, relativeTime } from "@/lib/utils";
import { useStore } from "@/lib/store";

const ACT_ICONS = { creation: Plus, appel: Phone, email: Mail, rdv: CalendarCheck, statut: ArrowUpRight, note: StickyNote };

export default function ProspectDrawer({ prospect, onClose }) {
  const { updateProspectStatus, addNote, logActivity } = useStore();
  const [note, setNote] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);

  if (!prospect) return null;
  const formation = FORMATIONS.find((f) => f.id === prospect.formation);

  const timeline = [
    ...prospect.historique.map((h) => ({ ...h, kind: "hist" })),
  ].sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <div className="fixed inset-0 z-50">
      <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm animate-fade-in" onClick={onClose} />
      <div className="absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-float animate-[slidein_0.3s_cubic-bezier(0.16,1,0.3,1)]">
        <style jsx>{`@keyframes slidein{from{transform:translateX(100%)}to{transform:translateX(0)}}`}</style>

        {/* Header */}
        <div className="flex items-start justify-between border-b border-ink/8 bg-white px-5 py-4">
          <div className="flex gap-3">
            <Avatar prenom={prospect.prenom} nom={prospect.nom} size={44} />
            <div>
              <h2 className="font-display text-lg font-bold text-ink">
                {prospect.prenom} {prospect.nom}
              </h2>
              <p className="text-sm text-ink-muted">{prospect.entreprise}</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/5">
            <X size={18} />
          </button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Status changer */}
          <div className="relative">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Statut
            </span>
            <button
              onClick={() => setStatusOpen((v) => !v)}
              className="flex w-full items-center justify-between rounded-xl border border-ink/10 bg-white px-3 py-2.5"
            >
              <StatusBadge statusId={prospect.status} />
              <ChevronDown size={16} className={`text-ink/40 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card">
                {STATUSES.map((s) => (
                  <button
                    key={s.id}
                    onClick={() => { updateProspectStatus(prospect.id, s.id, s.label); setStatusOpen(false); }}
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-cream"
                  >
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Quick actions */}
          <div className="grid grid-cols-3 gap-2">
            {[
              [Phone, "Appel", "appel", "Appel téléphonique enregistré"],
              [Mail, "Email", "email", "Email envoyé au prospect"],
              [CalendarCheck, "RDV", "rdv", "Rendez-vous planifié"],
            ].map(([Icon, label, type, msg]) => (
              <button
                key={label}
                onClick={() => logActivity(prospect.id, type, msg)}
                className="flex flex-col items-center gap-1 rounded-xl border border-ink/8 bg-white py-3 text-xs font-medium text-ink/70 transition-colors hover:border-teal-300 hover:text-teal-700"
              >
                <Icon size={17} /> {label}
              </button>
            ))}
          </div>

          {/* Info */}
          <div className="card divide-y divide-ink/6">
            <InfoRow icon={Mail} label="Email" value={prospect.email} />
            <InfoRow icon={Phone} label="Téléphone" value={prospect.telephone} />
            <InfoRow icon={MapPin} label="Adresse" value={prospect.adresse} />
            <InfoRow icon={Hash} label="SIRET" value={prospect.siret} />
            <InfoRow icon={Users} label="Salariés" value={prospect.salaries} />
            <InfoRow icon={Briefcase} label="Secteur" value={prospect.secteur} />
            {formation && <InfoRow icon={GraduationCap} label="Formation" value={formation.titre} />}
          </div>

          {/* Notes */}
          <div>
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Notes ({prospect.notes.length})
            </h3>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && note.trim()) { addNote(prospect.id, note.trim()); setNote(""); } }}
                placeholder="Ajouter une note…"
                className="flex-1 rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
              />
              <button
                onClick={() => { if (note.trim()) { addNote(prospect.id, note.trim()); setNote(""); } }}
                className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-ink text-cream hover:bg-teal-700"
              >
                <Send size={15} />
              </button>
            </div>
            <ul className="mt-3 space-y-2">
              {prospect.notes.map((n) => (
                <li key={n.id} className="rounded-xl border border-ink/8 bg-white p-3">
                  <p className="text-sm text-ink/80">{n.texte}</p>
                  <p className="mt-1.5 text-xs text-ink/40">{formatDateTime(n.date)}</p>
                </li>
              ))}
              {prospect.notes.length === 0 && (
                <li className="rounded-xl border border-dashed border-ink/12 p-4 text-center text-sm text-ink/40">
                  Aucune note pour le moment.
                </li>
              )}
            </ul>
          </div>

          {/* History */}
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              Historique des échanges
            </h3>
            <ol className="relative space-y-4 border-l border-ink/10 pl-5">
              {timeline.map((h) => {
                const Icon = ACT_ICONS[h.type] || Clock;
                return (
                  <li key={h.id} className="relative">
                    <span className="absolute -left-[27px] grid h-6 w-6 place-items-center rounded-full border border-ink/10 bg-white text-ink/60">
                      <Icon size={12} />
                    </span>
                    <p className="text-sm text-ink/80">{h.texte}</p>
                    <p className="text-xs text-ink/40">{formatDateTime(h.date)} · {relativeTime(h.date)}</p>
                  </li>
                );
              })}
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({ icon: Icon, label, value }) {
  return (
    <div className="flex items-center gap-3 px-4 py-2.5">
      <Icon size={15} className="shrink-0 text-ink/35" />
      <span className="w-24 shrink-0 text-xs text-ink-muted">{label}</span>
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-ink">{value || "—"}</span>
    </div>
  );
}
