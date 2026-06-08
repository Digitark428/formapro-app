"use client";

import { useState } from "react";
import {
  X, Phone, Mail, MapPin, Hash, Users, Briefcase, GraduationCap,
  Plus, Send, Clock, ArrowUpRight, StickyNote, CalendarClock, ChevronDown,
  UserPlus, UserCheck, BellRing, FileText, History, Check, Trash2, AlertTriangle,
} from "lucide-react";
import { Avatar, StatusBadge } from "@/components/ui/Badge";
import { STATUSES, FORMATIONS, RESPONSABLES } from "@/lib/mockData";
import { formatDate, formatDateTime, relativeTime } from "@/lib/utils";
import { useStore } from "@/lib/store";

const ACT_ICONS = {
  creation: Plus, assignation: UserCheck, appel: Phone, email: Mail,
  rdv: CalendarClock, statut: ArrowUpRight, note: StickyNote, relance: BellRing, doc: FileText,
};
const ACT_COLOR = {
  creation: "#5A636E", assignation: "#7C3AED", appel: "#1D4ED8", email: "#0FA980",
  rdv: "#B45309", statut: "#0A8568", note: "#5A636E", relance: "#E89B1E", doc: "#0E7490",
};

const frDate = (val) => {
  if (!val) return new Date().toLocaleDateString("fr-FR");
  return new Date(val).toLocaleDateString("fr-FR");
};
const todayISO = () => new Date().toISOString().slice(0, 10);

export default function ProspectDrawer({ prospect, onClose, autoAssign = false }) {
  const { updateProspectStatus, assignProspect, addNote, logActivity, deleteProspect } = useStore();
  const [note, setNote] = useState("");
  const [statusOpen, setStatusOpen] = useState(false);
  const [assignOpen, setAssignOpen] = useState(autoAssign);
  const [action, setAction] = useState(null); // 'appel' | 'email' | 'rdv'
  const [confirmDelete, setConfirmDelete] = useState(false);
  // action form fields
  const [aDate, setADate] = useState(todayISO());
  const [aTime, setATime] = useState("10:00");
  const [aObjet, setAObjet] = useState("");
  const [aNote, setANote] = useState("");

  if (!prospect) return null;
  const formation = FORMATIONS.find((f) => f.id === prospect.formation);

  // Historique chronologique (du plus ancien au plus récent)
  const timeline = [...prospect.historique].sort((a, b) => new Date(a.date) - new Date(b.date));

  const openAction = (kind) => {
    setADate(todayISO());
    setATime(kind === "rdv" ? "14:00" : "10:00");
    setAObjet("");
    setANote("");
    setAction(kind);
  };

  const submitAction = () => {
    if (action === "appel") {
      logActivity(prospect.id, "appel", `Appel programmé le ${frDate(aDate)} à ${aTime}${aNote.trim() ? ` — ${aNote.trim()}` : ""}`);
    } else if (action === "email") {
      logActivity(prospect.id, "email", `Email envoyé : ${aObjet.trim() || "(sans objet)"}${aNote.trim() ? ` — ${aNote.trim()}` : ""}`);
    } else if (action === "rdv") {
      logActivity(prospect.id, "rdv", `Rendez-vous fixé le ${frDate(aDate)} à ${aTime}`);
    }
    setAction(null);
  };

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
              <h2 className="font-display text-lg font-bold text-ink">{prospect.prenom} {prospect.nom}</h2>
              <p className="text-sm text-ink-muted">{prospect.entreprise}</p>
            </div>
          </div>
          <button onClick={onClose} className="grid h-9 w-9 place-items-center rounded-lg hover:bg-ink/5"><X size={18} /></button>
        </div>

        <div className="flex-1 space-y-5 overflow-y-auto p-5">
          {/* Responsable */}
          <div>
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Responsable</span>
            {prospect.responsable ? (
              <div className="flex items-center justify-between rounded-xl border border-ink/8 bg-white p-3">
                <div className="flex items-center gap-2.5">
                  <Avatar prenom={prospect.responsable.split(" ")[0]} nom={prospect.responsable.split(" ")[1]} size={34} />
                  <div>
                    <p className="text-sm font-bold text-ink">{prospect.responsable}</p>
                    <p className="text-xs text-ink-muted">Chargé d'affaires</p>
                  </div>
                </div>
                <button onClick={() => setAssignOpen((v) => !v)} className="rounded-lg border border-ink/10 px-2.5 py-1.5 text-xs font-semibold text-ink-muted hover:border-ink/30">
                  Réassigner
                </button>
              </div>
            ) : (
              !assignOpen && (
                <button onClick={() => setAssignOpen(true)} className="flex w-full items-center justify-center gap-2 rounded-xl bg-teal-600 px-4 py-3 text-sm font-bold text-white transition-colors hover:bg-teal-700">
                  <UserPlus size={16} /> Prendre en charge ce prospect
                </button>
              )
            )}
            {assignOpen && (
              <div className="mt-2 rounded-xl border border-ink/10 bg-white p-2">
                {RESPONSABLES.map((r) => (
                  <button
                    key={r}
                    onClick={() => { assignProspect(prospect.id, r); setAssignOpen(false); }}
                    className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm hover:bg-cream"
                  >
                    <Avatar prenom={r.split(" ")[0]} nom={r.split(" ")[1]} size={28} />
                    <span className="font-medium text-ink">{r}</span>
                    {prospect.responsable === r && <Check size={15} className="ml-auto text-teal-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Status changer (manuel) */}
          <div className="relative">
            <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Statut (modifiable manuellement)</span>
            <button onClick={() => setStatusOpen((v) => !v)} className="flex w-full items-center justify-between rounded-xl border border-ink/10 bg-white px-3 py-2.5">
              <StatusBadge statusId={prospect.status} />
              <ChevronDown size={16} className={`text-ink/40 transition-transform ${statusOpen ? "rotate-180" : ""}`} />
            </button>
            {statusOpen && (
              <div className="absolute z-10 mt-1 w-full overflow-hidden rounded-xl border border-ink/10 bg-white shadow-card">
                {STATUSES.map((s) => (
                  <button key={s.id} onClick={() => { updateProspectStatus(prospect.id, s.id, s.label); setStatusOpen(false); }} className="flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-cream">
                    <span className="h-2 w-2 rounded-full" style={{ backgroundColor: s.color }} />
                    {s.label}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Actions commerciales */}
          <div>
            <span className="mb-2 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Actions commerciales</span>
            <div className="grid grid-cols-3 gap-2">
              {[[Phone, "Appel", "appel"], [Mail, "Email", "email"], [CalendarClock, "Rendez-vous", "rdv"]].map(([Icon, label, kind]) => (
                <button key={kind} onClick={() => openAction(kind)} className="flex flex-col items-center gap-1 rounded-xl border border-ink/8 bg-white py-3 text-xs font-semibold text-ink/70 transition-colors hover:border-teal-300 hover:bg-teal-50/40 hover:text-teal-700">
                  <Icon size={18} className="text-teal-600" /> {label}
                </button>
              ))}
            </div>
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
            <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">Notes ({prospect.notes.length})</h3>
            <div className="flex gap-2">
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter" && note.trim()) { addNote(prospect.id, note.trim()); setNote(""); } }}
                placeholder="Ajouter une note…"
                className="flex-1 rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
              />
              <button onClick={() => { if (note.trim()) { addNote(prospect.id, note.trim()); setNote(""); } }} className="grid h-[38px] w-[38px] place-items-center rounded-xl bg-ink text-cream hover:bg-teal-700">
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
                <li className="rounded-xl border border-dashed border-ink/12 p-4 text-center text-sm text-ink/40">Aucune note pour le moment.</li>
              )}
            </ul>
          </div>

          {/* Historique des interactions */}
          <div>
            <h3 className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-ink-muted">
              <History size={14} /> Historique des interactions
            </h3>
            <ol className="space-y-0">
              {timeline.map((h, i) => {
                const Icon = ACT_ICONS[h.type] || Clock;
                const color = ACT_COLOR[h.type] || "#5A636E";
                return (
                  <li key={h.id} className="flex gap-3 pb-4 last:pb-0">
                    <div className="flex flex-col items-center">
                      <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-white" style={{ backgroundColor: color }}>
                        <Icon size={15} />
                      </span>
                      {i < timeline.length - 1 && <span className="mt-1 w-0.5 flex-1 bg-ink/10" />}
                    </div>
                    <div className="flex-1 pt-0.5">
                      <p className="text-sm font-medium text-ink/85">{h.texte}</p>
                      <p className="mt-0.5 text-xs text-ink/40">{formatDate(h.date, { year: true })} · {relativeTime(h.date)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </div>

          {/* Zone dangereuse */}
          <div className="mt-2 rounded-xl border border-red-200 bg-red-50/40 p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-red-700">Zone dangereuse</p>
            <button
              onClick={() => setConfirmDelete(true)}
              className="inline-flex w-full items-center justify-center gap-2 rounded-lg border border-red-200 bg-white px-3 py-2.5 text-sm font-semibold text-red-700 transition-colors hover:bg-red-50"
            >
              <Trash2 size={15} /> Supprimer définitivement ce prospect
            </button>
          </div>
        </div>
      </div>

      {/* Action modal */}
      {action && (
        <div className="absolute inset-0 z-10 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/30 backdrop-blur-sm" onClick={() => setAction(null)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-ink/8 bg-white p-6 shadow-float animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/12 text-teal-600">
                  {action === "appel" && <Phone size={18} />}
                  {action === "email" && <Mail size={18} />}
                  {action === "rdv" && <CalendarClock size={18} />}
                </span>
                <h3 className="font-display text-lg font-bold text-ink">
                  {action === "appel" && "Programmer un appel"}
                  {action === "email" && "Consigner un email"}
                  {action === "rdv" && "Fixer un rendez-vous"}
                </h3>
              </div>
              <button onClick={() => setAction(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/5"><X size={16} /></button>
            </div>

            <div className="mt-5 space-y-3">
              {action === "email" && (
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">Objet</span>
                  <input value={aObjet} onChange={(e) => setAObjet(e.target.value)} placeholder="Ex : Proposition commerciale" className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
              )}
              {(action === "appel" || action === "rdv") && (
                <div className="grid grid-cols-2 gap-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-ink-muted">Date</span>
                    <input type="date" value={aDate} onChange={(e) => setADate(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none" />
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-ink-muted">Heure</span>
                    <input type="time" value={aTime} onChange={(e) => setATime(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none" />
                  </label>
                </div>
              )}
              {(action === "appel" || action === "email") && (
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">Commentaire</span>
                  <textarea value={aNote} onChange={(e) => setANote(e.target.value)} rows={action === "email" ? 3 : 2} placeholder="Détails…" className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none" />
                </label>
              )}
            </div>

            <button onClick={submitAction} className="btn-primary mt-5 w-full py-3"><Check size={16} /> Enregistrer dans l'historique</button>
          </div>
        </div>
      )}

      {/* Confirmation suppression */}
      {confirmDelete && (
        <div className="absolute inset-0 z-20 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setConfirmDelete(false)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-ink/8 bg-white p-6 text-center shadow-float animate-scale-in">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><AlertTriangle size={26} /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">Supprimer ce prospect ?</h3>
            <p className="mt-1 text-sm text-ink-muted">
              <span className="font-semibold text-ink">{prospect.prenom} {prospect.nom}</span> ({prospect.entreprise}) et tout son historique seront définitivement supprimés. Cette action est irréversible.
            </p>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setConfirmDelete(false)} className="flex-1 rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-semibold">Annuler</button>
              <button
                onClick={() => { const id = prospect.id; setConfirmDelete(false); onClose && onClose(); deleteProspect(id); }}
                className="flex-1 inline-flex items-center justify-center gap-1.5 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700"
              >
                <Trash2 size={14} /> Supprimer
              </button>
            </div>
          </div>
        </div>
      )}
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
