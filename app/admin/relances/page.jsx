"use client";

import { useState } from "react";
import {
  BellRing, Clock, FileSignature, FileWarning, Send, Check, Phone,
  Mail, ChevronRight, Inbox,
} from "lucide-react";
import { Avatar } from "@/components/ui/Badge";
import { useStore } from "@/lib/store";
import { statusById } from "@/lib/mockData";
import { daysSince, relativeTime, formatDate } from "@/lib/utils";

export default function RelancesPage() {
  const { prospects, signatures, logActivity } = useStore();
  const [relances, setRelances] = useState({}); // id -> true (relance envoyée)

  const inactifs = prospects.filter(
    (p) => daysSince(p.lastActivity) >= 7 && !["gagne", "perdu"].includes(p.status)
  );
  const devis = prospects.filter((p) => ["proposition", "attente"].includes(p.status));
  const conventions = signatures.filter((s) => s.statut !== "signe");

  const sendRelance = (id, prospectId) => {
    setRelances((r) => ({ ...r, [id]: true }));
    if (prospectId) logActivity(prospectId, "email", "Relance automatique envoyée");
  };

  return (
    <div className="mx-auto max-w-6xl space-y-5">
      {/* Summary tiles */}
      <div className="grid gap-4 sm:grid-cols-3">
        <SummaryTile icon={Clock} accent="#E89B1E" value={inactifs.length} label="Sans activité (7j+)" />
        <SummaryTile icon={FileWarning} accent="#7C3AED" value={devis.length} label="Devis à relancer" />
        <SummaryTile icon={FileSignature} accent="#0E7490" value={conventions.length} label="Conventions non signées" />
      </div>

      <div className="grid gap-5 lg:grid-cols-2">
        {/* Inactifs */}
        <Panel icon={Clock} title="Prospects sans activité (7 jours et +)" count={inactifs.length}>
          {inactifs.length === 0 ? (
            <Empty label="Tous vos prospects sont à jour 🎉" />
          ) : (
            inactifs.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <Avatar prenom={p.prenom} nom={p.nom} size={36} />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{p.prenom} {p.nom}</p>
                  <p className="truncate text-xs text-ink-muted">
                    {p.entreprise} · <span style={{ color: statusById(p.status).color }}>{statusById(p.status).label}</span>
                  </p>
                </div>
                <span className="hidden text-xs text-amber-600 sm:block">{relativeTime(p.lastActivity)}</span>
                <RelanceBtn done={relances[p.id]} onClick={() => sendRelance(p.id, p.id)} />
              </div>
            ))
          )}
        </Panel>

        {/* Devis */}
        <Panel icon={FileWarning} title="Devis & propositions à relancer" count={devis.length}>
          {devis.length === 0 ? (
            <Empty label="Aucun devis en attente de relance." />
          ) : (
            devis.map((p) => (
              <div key={p.id} className="flex items-center gap-3 px-4 py-3">
                <span className="grid h-9 w-9 place-items-center rounded-lg bg-violet-50 text-violet-600">
                  <Mail size={16} />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-semibold text-ink">{p.entreprise}</p>
                  <p className="truncate text-xs text-ink-muted">{p.prenom} {p.nom} · proposition du {formatDate(p.createdAt)}</p>
                </div>
                <RelanceBtn done={relances[`d-${p.id}`]} onClick={() => sendRelance(`d-${p.id}`, p.id)} />
              </div>
            ))
          )}
        </Panel>
      </div>

      {/* Conventions */}
      <Panel icon={FileSignature} title="Conventions non signées" count={conventions.length}>
        {conventions.length === 0 ? (
          <Empty label="Toutes les conventions sont signées." />
        ) : (
          conventions.map((s) => (
            <div key={s.id} className="flex items-center gap-3 px-4 py-3">
              <span className="grid h-9 w-9 place-items-center rounded-lg bg-cyan-50 text-cyan-700">
                <FileSignature size={16} />
              </span>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-semibold text-ink">{s.document}</p>
                <p className="truncate text-xs text-ink-muted">
                  {s.signataire} · envoyé {relativeTime(s.envoye)} ·{" "}
                  <span className={s.statut === "attente" ? "text-amber-600" : "text-blue-600"}>
                    {s.statut === "attente" ? "En attente de signature" : "Envoyé"}
                  </span>
                </p>
              </div>
              <RelanceBtn done={relances[s.id]} onClick={() => sendRelance(s.id)} />
            </div>
          ))
        )}
      </Panel>

      {/* Notification center */}
      <div className="card overflow-hidden">
        <div className="flex items-center gap-2 border-b border-ink/8 px-5 py-3">
          <BellRing size={16} className="text-teal-600" />
          <h3 className="font-display text-sm font-bold text-ink">Centre de notifications</h3>
        </div>
        <ul className="divide-y divide-ink/6">
          {[
            ["Nouveau prospect", `${prospects.filter((p) => p.status === "nouveau").length} fiche(s) à qualifier dans le CRM`, "teal"],
            ["Relances dues", `${inactifs.length} prospect(s) sans activité depuis plus de 7 jours`, "amber"],
            ["Signatures en attente", `${conventions.length} document(s) attendent une signature`, "cyan"],
          ].map(([t, d, c], i) => (
            <li key={i} className="flex items-start gap-3 px-5 py-3">
              <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full bg-${c}-500`} style={{ backgroundColor: c === "teal" ? "#0FA980" : c === "amber" ? "#E89B1E" : "#0E7490" }} />
              <div>
                <p className="text-sm font-semibold text-ink">{t}</p>
                <p className="text-sm text-ink-muted">{d}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function SummaryTile({ icon: Icon, accent, value, label }) {
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

function Panel({ icon: Icon, title, count, children }) {
  return (
    <div className="card overflow-hidden">
      <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
        <span className="inline-flex items-center gap-2 font-display text-sm font-bold text-ink">
          <Icon size={16} className="text-ink/50" /> {title}
        </span>
        <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/60">{count}</span>
      </div>
      <div className="divide-y divide-ink/6">{children}</div>
    </div>
  );
}

function RelanceBtn({ done, onClick }) {
  if (done)
    return (
      <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700">
        <Check size={13} /> Relancé
      </span>
    );
  return (
    <button
      onClick={onClick}
      className="inline-flex shrink-0 items-center gap-1.5 rounded-full border border-ink/12 bg-white px-3 py-1.5 text-xs font-semibold text-ink/70 transition-colors hover:border-teal-300 hover:bg-teal-50 hover:text-teal-700"
    >
      <Send size={12} /> Relancer
    </button>
  );
}

function Empty({ label }) {
  return (
    <div className="flex flex-col items-center gap-2 py-10 text-center">
      <Inbox size={28} className="text-ink/25" />
      <p className="text-sm text-ink/45">{label}</p>
    </div>
  );
}
