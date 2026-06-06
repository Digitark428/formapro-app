"use client";

import { useState } from "react";
import { BellRing, Flame, Users, Send, Check, Info, ListTodo } from "lucide-react";
import { Avatar } from "@/components/ui/Badge";
import ProspectDrawer from "@/components/admin/ProspectDrawer";
import { useStore } from "@/lib/store";
import { statusById } from "@/lib/mockData";
import { daysSince, formatDate } from "@/lib/utils";

function urgence(p) {
  const d = daysSince(p.lastActivity);
  if (d >= 10) return { key: "Élevée", color: "#B91C1C", bg: "#FEE2E2" };
  if (d >= 7) return { key: "Moyenne", color: "#B45309", bg: "#FEF3C7" };
  return { key: "Faible", color: "#0A8568", bg: "#CFF6E8" };
}
function nextRelanceDate(p) {
  const d = new Date(p.lastActivity);
  d.setDate(d.getDate() + 7);
  return d;
}

export default function RelancesPage() {
  const { prospects, logRelance } = useStore();
  const [done, setDone] = useState({});
  const [selected, setSelected] = useState(null);

  const actifs = prospects.filter((p) => !["gagne", "perdu"].includes(p.status));
  const rank = { "Élevée": 0, "Moyenne": 1, "Faible": 2 };
  const rows = [...actifs].sort(
    (a, b) => rank[urgence(a).key] - rank[urgence(b).key] || daysSince(b.lastActivity) - daysSince(a.lastActivity)
  );
  const due = actifs.filter((p) => daysSince(p.lastActivity) >= 7);
  const elevee = actifs.filter((p) => urgence(p).key === "Élevée");

  const relancer = (id) => {
    logRelance(id);
    setDone((d) => ({ ...d, [id]: true }));
  };

  const selectedProspect = prospects.find((p) => p.id === selected) || null;

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <Tile icon={BellRing} accent="#E89B1E" value={due.length} label="À relancer (7 jours et +)" />
        <Tile icon={Flame} accent="#B91C1C" value={elevee.length} label="Urgence élevée" />
        <Tile icon={Users} accent="#0FA980" value={actifs.length} label="Prospects actifs" />
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink/8 px-5 py-3">
          <ListTodo size={16} className="text-teal-600" />
          <h3 className="font-display text-sm font-bold text-ink">File de relances priorisée</h3>
          <span className="ml-auto text-xs text-ink-muted">Triée par niveau d'urgence</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[880px] text-sm">
            <thead>
              <tr className="border-b border-ink/8 bg-cream text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3">Prospect</th>
                <th className="px-5 py-3">Responsable</th>
                <th className="px-5 py-3">Dernier contact</th>
                <th className="px-5 py-3">Prochaine relance</th>
                <th className="px-5 py-3">Urgence</th>
                <th className="px-5 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {rows.map((p) => {
                const u = urgence(p);
                const ds = daysSince(p.lastActivity);
                const nr = nextRelanceDate(p);
                const late = nr < new Date();
                return (
                  <tr key={p.id} className="transition-colors hover:bg-cream">
                    <td className="px-5 py-3">
                      <button onClick={() => setSelected(p.id)} className="flex items-center gap-2.5 text-left">
                        <Avatar prenom={p.prenom} nom={p.nom} size={34} />
                        <span>
                          <span className="block font-semibold text-ink hover:text-teal-700">{p.entreprise}</span>
                          <span className="block text-xs text-ink-muted">{p.prenom} {p.nom} · {statusById(p.status).label}</span>
                        </span>
                      </button>
                    </td>
                    <td className="px-5 py-3">
                      {p.responsable ? (
                        <span className="inline-flex items-center gap-1.5 text-ink/75">
                          <Avatar prenom={p.responsable.split(" ")[0]} nom={p.responsable.split(" ")[1]} size={22} />
                          {p.responsable}
                        </span>
                      ) : (
                        <span className="font-semibold text-amber-600">Non assigné</span>
                      )}
                    </td>
                    <td className="px-5 py-3 text-ink/70">{ds === 0 ? "aujourd'hui" : `il y a ${ds} j`}</td>
                    <td className={`px-5 py-3 ${late ? "font-semibold text-red-600" : "text-ink/70"}`}>
                      {late ? "En retard" : formatDate(nr.toISOString(), { year: true })}
                    </td>
                    <td className="px-5 py-3">
                      <span className="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold" style={{ backgroundColor: u.bg, color: u.color }}>
                        <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: u.color }} />
                        {u.key}
                      </span>
                    </td>
                    <td className="px-5 py-3 text-right">
                      {done[p.id] ? (
                        <span className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700">
                          <Check size={13} /> Relancé
                        </span>
                      ) : (
                        <button onClick={() => relancer(p.id)} className="inline-flex items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-700 transition-colors hover:bg-teal-100">
                          <Send size={13} /> Relancer
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
              {rows.length === 0 && (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-sm text-ink/40">Aucun prospect à relancer 🎉</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <p className="flex items-start gap-2 px-1 text-xs text-ink-muted">
        <Info size={14} className="mt-0.5 shrink-0" />
        Cliquer « Relancer » enregistre la relance et ajoute automatiquement une ligne dans l'historique du prospect (visible dans sa fiche). La prochaine relance est planifiée à J+7 après le dernier contact.
      </p>

      {selectedProspect && (
        <ProspectDrawer prospect={selectedProspect} onClose={() => setSelected(null)} />
      )}
    </div>
  );
}

function Tile({ icon: Icon, accent, value, label }) {
  return (
    <div className="card flex items-center gap-4 p-5">
      <span className="grid h-12 w-12 place-items-center rounded-xl" style={{ backgroundColor: `${accent}18`, color: accent }}>
        <Icon size={22} />
      </span>
      <div>
        <div className="font-display text-2xl font-bold text-ink">{value}</div>
        <div className="text-sm text-ink-muted">{label}</div>
      </div>
    </div>
  );
}
