"use client";

import { useState, useMemo } from "react";
import {
  LayoutGrid, List, Search, Phone, Mail, ChevronRight, GripVertical,
} from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui/Badge";
import ProspectDrawer from "@/components/admin/ProspectDrawer";
import { useStore } from "@/lib/store";
import { STATUSES, statusById } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

export default function CrmPage() {
  const { prospects, updateProspectStatus } = useStore();
  const [view, setView] = useState("kanban");
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState(null);
  const [dragId, setDragId] = useState(null);
  const [dragOver, setDragOver] = useState(null);

  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return prospects;
    return prospects.filter(
      (p) =>
        `${p.prenom} ${p.nom}`.toLowerCase().includes(q) ||
        p.entreprise.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q)
    );
  }, [prospects, query]);

  const selectedProspect = prospects.find((p) => p.id === selected) || null;

  const handleDrop = (statusId) => {
    if (dragId) {
      const p = prospects.find((x) => x.id === dragId);
      if (p && p.status !== statusId) {
        updateProspectStatus(dragId, statusId, statusById(statusId).label);
      }
    }
    setDragId(null);
    setDragOver(null);
  };

  return (
    <div className="mx-auto max-w-[1500px] space-y-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="relative max-w-xs flex-1">
          <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Rechercher un prospect…"
            className="w-full rounded-full border border-ink/10 bg-white py-2.5 pl-9 pr-3 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
          />
        </div>
        <div className="flex items-center gap-1 rounded-full border border-ink/10 bg-white p-1">
          <ViewBtn active={view === "kanban"} onClick={() => setView("kanban")} icon={LayoutGrid} label="Kanban" />
          <ViewBtn active={view === "list"} onClick={() => setView("list")} icon={List} label="Liste" />
        </div>
      </div>

      {/* KANBAN */}
      {view === "kanban" && (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {STATUSES.map((s) => {
            const items = filtered.filter((p) => p.status === s.id);
            return (
              <div
                key={s.id}
                onDragOver={(e) => { e.preventDefault(); setDragOver(s.id); }}
                onDragLeave={() => setDragOver((v) => (v === s.id ? null : v))}
                onDrop={() => handleDrop(s.id)}
                className={`flex w-[280px] shrink-0 flex-col rounded-2xl border bg-white/60 transition-colors ${
                  dragOver === s.id ? "border-teal-400 bg-teal-50/60" : "border-ink/8"
                }`}
              >
                <div className="flex items-center justify-between border-b border-ink/8 px-4 py-3">
                  <span className="inline-flex items-center gap-2 text-sm font-semibold text-ink">
                    <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </span>
                  <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/60">
                    {items.length}
                  </span>
                </div>
                <div className="flex-1 space-y-2.5 p-3">
                  {items.map((p) => (
                    <article
                      key={p.id}
                      draggable
                      onDragStart={() => setDragId(p.id)}
                      onDragEnd={() => { setDragId(null); setDragOver(null); }}
                      onClick={() => setSelected(p.id)}
                      className={`group cursor-pointer rounded-xl border border-ink/8 bg-white p-3 shadow-soft transition-all hover:-translate-y-0.5 hover:shadow-card ${
                        dragId === p.id ? "opacity-40" : ""
                      }`}
                    >
                      <div className="flex items-start gap-2.5">
                        <Avatar prenom={p.prenom} nom={p.nom} size={34} />
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-semibold text-ink">{p.prenom} {p.nom}</p>
                          <p className="truncate text-xs text-ink-muted">{p.entreprise}</p>
                        </div>
                        <GripVertical size={15} className="text-ink/20 group-hover:text-ink/40" />
                      </div>
                      <div className="mt-2.5 flex items-center justify-between text-xs text-ink/45">
                        <span className="inline-flex items-center gap-1"><Phone size={11} /> {p.telephone || "—"}</span>
                        <span>{formatDate(p.createdAt)}</span>
                      </div>
                      {p.notes.length > 0 && (
                        <p className="mt-2 truncate rounded-lg bg-cream px-2 py-1 text-xs text-ink/55">
                          {p.notes[0].texte}
                        </p>
                      )}
                    </article>
                  ))}
                  {items.length === 0 && (
                    <div className="rounded-xl border border-dashed border-ink/12 py-6 text-center text-xs text-ink/30">
                      Déposez ici
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* LIST */}
      {view === "list" && (
        <div className="overflow-hidden rounded-2xl border border-ink/8 bg-white shadow-soft">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[760px] text-sm">
              <thead>
                <tr className="border-b border-ink/8 bg-cream text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                  <th className="px-5 py-3">Nom</th>
                  <th className="px-5 py-3">Entreprise</th>
                  <th className="px-5 py-3">Téléphone</th>
                  <th className="px-5 py-3">Email</th>
                  <th className="px-5 py-3">Créé le</th>
                  <th className="px-5 py-3">Statut</th>
                  <th className="px-5 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-ink/6">
                {filtered.map((p) => (
                  <tr
                    key={p.id}
                    onClick={() => setSelected(p.id)}
                    className="cursor-pointer transition-colors hover:bg-cream"
                  >
                    <td className="px-5 py-3">
                      <div className="flex items-center gap-3">
                        <Avatar prenom={p.prenom} nom={p.nom} size={34} />
                        <span className="font-semibold text-ink">{p.prenom} {p.nom}</span>
                      </div>
                    </td>
                    <td className="px-5 py-3 text-ink/75">{p.entreprise}</td>
                    <td className="px-5 py-3 text-ink/60">{p.telephone || "—"}</td>
                    <td className="px-5 py-3 text-ink/60">{p.email}</td>
                    <td className="px-5 py-3 text-ink/60">{formatDate(p.createdAt, { year: true })}</td>
                    <td className="px-5 py-3"><StatusBadge statusId={p.status} /></td>
                    <td className="px-5 py-3 text-right"><ChevronRight size={16} className="text-ink/30" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && (
            <div className="py-12 text-center text-sm text-ink/40">Aucun prospect trouvé.</div>
          )}
        </div>
      )}

      {selectedProspect && (
        <ProspectDrawer prospect={selectedProspect} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function ViewBtn({ active, onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-sm font-semibold transition-colors ${
        active ? "bg-ink text-cream" : "text-ink/60 hover:text-ink"
      }`}
    >
      <Icon size={15} /> {label}
    </button>
  );
}
