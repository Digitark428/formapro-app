"use client";

import { useState } from "react";
import {
  FileText, FileSignature, CalendarCheck, ListChecks, ScrollText, BookOpen,
  Sparkles, Check, Download, Loader2, X, Wand2,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { MODELES_DOCUMENTS, FORMATIONS } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

const ICONS = { FileText, FileSignature, CalendarCheck, ListChecks, ScrollText, BookOpen };

const GEN_STEPS = [
  "Récupération des données client…",
  "Application du modèle Qualiopi…",
  "Insertion des champs dynamiques…",
  "Mise en page et génération du PDF…",
  "Document prêt à l'envoi.",
];

export default function DocumentsPage() {
  const { documents, prospects, addDocument } = useStore();
  const [active, setActive] = useState(null); // modele in modal
  const [client, setClient] = useState("");
  const [formation, setFormation] = useState("");
  const [phase, setPhase] = useState("form"); // form | generating | done
  const [step, setStep] = useState(0);

  const clients = prospects.filter((p) => p.status === "gagne");

  const open = (modele) => {
    setActive(modele);
    setPhase("form");
    setStep(0);
    setClient(clients[0]?.entreprise || prospects[0]?.entreprise || "");
    setFormation(FORMATIONS[0].titre);
  };

  const generate = () => {
    setPhase("generating");
    setStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setStep(i);
      if (i >= GEN_STEPS.length - 1) {
        clearInterval(timer);
        addDocument({ modele: active.nom, client, formation });
        setTimeout(() => setPhase("done"), 500);
      }
    }, 650);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-ink to-ink-soft p-6 text-cream">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/20 text-teal-300">
            <Wand2 size={22} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">Génération automatique de documents</h2>
            <p className="text-sm text-cream/60">
              Choisissez un modèle : FormaPro fusionne vos données et produit un document conforme en quelques secondes.
            </p>
          </div>
        </div>
      </div>

      {/* Templates */}
      <div>
        <h3 className="mb-3 text-xs font-semibold uppercase tracking-wider text-ink-muted">Modèles disponibles</h3>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MODELES_DOCUMENTS.map((m) => {
            const Icon = ICONS[m.icon];
            return (
              <button
                key={m.id}
                onClick={() => open(m)}
                className="group flex flex-col rounded-2xl border border-ink/8 bg-white p-5 text-left shadow-soft transition-all hover:-translate-y-1 hover:border-teal-200 hover:shadow-card"
              >
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/12 text-teal-600">
                  <Icon size={20} />
                </span>
                <h4 className="mt-4 font-display text-base font-bold text-ink">{m.nom}</h4>
                <p className="mt-1 flex-1 text-sm text-ink-muted">{m.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-teal-600">
                  <Sparkles size={14} /> Générer <span className="text-ink/30">· {m.duree}</span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* History */}
      <div className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
          <h3 className="font-display text-sm font-bold text-ink">Documents générés récemment</h3>
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/60">{documents.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[600px] text-sm">
            <thead>
              <tr className="border-b border-ink/8 bg-cream text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3">Document</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Formation</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {documents.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-cream">
                  <td className="px-5 py-3 font-semibold text-ink">{d.modele}</td>
                  <td className="px-5 py-3 text-ink/70">{d.client}</td>
                  <td className="px-5 py-3 text-ink/60">{d.formation}</td>
                  <td className="px-5 py-3 text-ink/60">{formatDate(d.date)}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline">
                      <Download size={13} /> PDF
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {active && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => phase !== "generating" && setActive(null)} />
          <div className="relative w-full max-w-md rounded-3xl border border-ink/8 bg-white p-6 shadow-float animate-scale-in">
            <div className="flex items-start justify-between">
              <h3 className="font-display text-lg font-bold text-ink">{active.nom}</h3>
              {phase !== "generating" && (
                <button onClick={() => setActive(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/5">
                  <X size={17} />
                </button>
              )}
            </div>

            {phase === "form" && (
              <div className="mt-4 space-y-4">
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink/80">Client</span>
                  <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                    {prospects.map((p) => <option key={p.id} value={p.entreprise}>{p.entreprise}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1.5 block text-sm font-medium text-ink/80">Formation</span>
                  <select value={formation} onChange={(e) => setFormation(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-white px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                    {FORMATIONS.map((f) => <option key={f.id} value={f.titre}>{f.titre}</option>)}
                  </select>
                </label>
                <button onClick={generate} className="btn-primary w-full py-3">
                  <Sparkles size={16} /> Générer le document
                </button>
              </div>
            )}

            {phase === "generating" && (
              <div className="mt-6">
                <div className="flex flex-col items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                    <Loader2 size={28} className="animate-spin" />
                  </span>
                  <p className="mt-4 text-sm font-semibold text-ink">Génération en cours…</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {GEN_STEPS.map((s, i) => (
                    <li key={i} className={`flex items-center gap-2.5 text-sm transition-opacity ${i <= step ? "opacity-100" : "opacity-30"}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full ${i < step ? "bg-teal-500 text-white" : i === step ? "bg-teal-100 text-teal-600" : "bg-ink/8 text-ink/40"}`}>
                        {i < step ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                      <span className={i <= step ? "text-ink" : "text-ink/40"}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {phase === "done" && (
              <div className="mt-4 flex flex-col items-center text-center animate-scale-in">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-500/15 text-teal-600">
                  <Check size={30} />
                </span>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">Document généré !</h4>
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">{active.nom}</span> pour {client} est prêt.
                </p>
                <div className="mt-5 flex w-full gap-2">
                  <button className="btn-primary flex-1 py-2.5"><Download size={15} /> Télécharger</button>
                  <button onClick={() => setActive(null)} className="btn-ghost flex-1 py-2.5">Fermer</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
