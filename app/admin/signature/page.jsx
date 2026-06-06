"use client";

import { useMemo, useState } from "react";
import {
  PenLine, Send, CheckCircle2, Clock, Plus, X, ShieldCheck,
  MailCheck, FileSignature, ArrowRight, Loader2, Sparkles,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { FORMATIONS } from "@/lib/mockData";
import { formatDate, formatDateTime, relativeTime, initials, avatarColor } from "@/lib/utils";

const TABS = [
  { id: "tous", label: "Tous" },
  { id: "envoye", label: "Envoyés" },
  { id: "attente", label: "En attente" },
  { id: "signe", label: "Signés" },
];

const STATUT_META = {
  envoye: { label: "Envoyé", color: "text-sky-700", bg: "bg-sky-50", ring: "ring-sky-200", Icon: Send },
  attente: { label: "En attente", color: "text-amber-700", bg: "bg-amber-50", ring: "ring-amber-200", Icon: Clock },
  signe: { label: "Signé", color: "text-teal-700", bg: "bg-teal-50", ring: "ring-teal-200", Icon: CheckCircle2 },
};

function StatutChip({ statut }) {
  const m = STATUT_META[statut] || STATUT_META.envoye;
  const { Icon } = m;
  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold ring-1 ${m.bg} ${m.color} ${m.ring}`}>
      <Icon size={13} /> {m.label}
    </span>
  );
}

export default function SignaturePage() {
  const { signatures, prospects, addSignature, markSigned } = useStore();
  const [tab, setTab] = useState("tous");
  const [modal, setModal] = useState(false);

  // send-for-signature form
  const clients = prospects.filter((p) => p.status === "gagne" || p.status === "proposition" || p.status === "attente");
  const [doc, setDoc] = useState("Convention de formation");
  const [clientId, setClientId] = useState("");
  const [phase, setPhase] = useState("form"); // form | sending | done

  const counts = useMemo(() => ({
    tous: signatures.length,
    envoye: signatures.filter((s) => s.statut === "envoye").length,
    attente: signatures.filter((s) => s.statut === "attente").length,
    signe: signatures.filter((s) => s.statut === "signe").length,
  }), [signatures]);

  const completion = signatures.length
    ? Math.round((counts.signe / signatures.length) * 100)
    : 0;

  const list = tab === "tous" ? signatures : signatures.filter((s) => s.statut === tab);

  const openModal = () => {
    setDoc("Convention de formation");
    setClientId(clients[0]?.id || prospects[0]?.id || "");
    setPhase("form");
    setModal(true);
  };

  const send = () => {
    const c = prospects.find((p) => p.id === clientId);
    if (!c) return;
    setPhase("sending");
    setTimeout(() => {
      addSignature({
        document: `${doc} — ${c.entreprise}`,
        signataire: `${c.prenom} ${c.nom}`,
        email: c.email,
        statut: "envoye",
      });
      setPhase("done");
    }, 1400);
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Intro / Yousign banner */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-ink to-ink-soft p-6 text-cream">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/20 text-teal-300">
              <FileSignature size={22} />
            </span>
            <div>
              <h2 className="font-display text-xl font-bold">Signature électronique</h2>
              <p className="text-sm text-cream/60">
                Envoyez vos conventions et conventions à signer en un clic. Suivi en temps réel du statut.
              </p>
            </div>
          </div>
          <button onClick={openModal} className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:bg-teal-400">
            <Plus size={16} /> Envoyer pour signature
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <SigStat icon={Send} label="Envoyés" value={counts.envoye} accent="sky" />
        <SigStat icon={Clock} label="En attente" value={counts.attente} accent="amber" />
        <SigStat icon={CheckCircle2} label="Signés" value={counts.signe} accent="teal" />
        <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-soft">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">Taux de signature</span>
            <ShieldCheck size={16} className="text-teal-600" />
          </div>
          <p className="mt-2 font-display text-3xl font-extrabold text-ink">{completion}%</p>
          <div className="mt-3 h-2 overflow-hidden rounded-full bg-ink/8">
            <div className="h-full rounded-full bg-gradient-to-r from-teal-500 to-teal-400 transition-all duration-700" style={{ width: `${completion}%` }} />
          </div>
        </div>
      </div>

      {/* Tabs + list */}
      <div className="card overflow-hidden">
        <div className="flex flex-wrap items-center gap-1.5 border-b border-ink/8 px-4 py-3">
          {TABS.map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`inline-flex items-center gap-2 rounded-lg px-3 py-1.5 text-sm font-semibold transition-colors ${
                tab === t.id ? "bg-ink text-cream" : "text-ink-muted hover:bg-ink/5"
              }`}
            >
              {t.label}
              <span className={`rounded-full px-1.5 py-0.5 text-[11px] font-bold ${tab === t.id ? "bg-cream/20 text-cream" : "bg-ink/8 text-ink/60"}`}>
                {counts[t.id]}
              </span>
            </button>
          ))}
        </div>

        {list.length === 0 ? (
          <div className="grid place-items-center px-6 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 text-ink/40">
              <PenLine size={22} />
            </span>
            <p className="mt-3 text-sm font-medium text-ink-muted">Aucun document dans cette catégorie.</p>
          </div>
        ) : (
          <ul className="divide-y divide-ink/6">
            {list.map((s) => {
              const meta = STATUT_META[s.statut] || STATUT_META.envoye;
              return (
                <li key={s.id} className="flex flex-col gap-3 px-5 py-4 transition-colors hover:bg-cream sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl ${meta.bg} ${meta.color}`}>
                      <meta.Icon size={18} />
                    </span>
                    <div className="min-w-0">
                      <p className="truncate font-semibold text-ink">{s.document}</p>
                      <div className="mt-0.5 flex flex-wrap items-center gap-x-3 gap-y-0.5 text-xs text-ink-muted">
                        <span className="inline-flex items-center gap-1">
                          <span className="grid h-4 w-4 place-items-center rounded-full text-[9px] font-bold text-white" style={{ background: avatarColor(s.signataire) }}>
                            {initials(...s.signataire.split(" "))}
                          </span>
                          {s.signataire}
                        </span>
                        <span>{s.email}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 pl-13 sm:pl-0">
                    <div className="text-right text-xs text-ink-muted">
                      <p>Envoyé {relativeTime(s.envoye)}</p>
                      {s.signe && <p className="text-teal-600">Signé le {formatDate(s.signe)}</p>}
                    </div>
                    <StatutChip statut={s.statut} />
                    {s.statut !== "signe" ? (
                      <button
                        onClick={() => markSigned(s.id)}
                        className="inline-flex shrink-0 items-center gap-1.5 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-semibold text-teal-700 transition-colors hover:bg-teal-100"
                      >
                        <CheckCircle2 size={14} /> Marquer signé
                      </button>
                    ) : (
                      <span className="inline-flex shrink-0 items-center gap-1.5 rounded-lg px-3 py-1.5 text-xs font-semibold text-ink/30">
                        <MailCheck size={14} /> Archivé
                      </span>
                    )}
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>

      {/* Yousign integration note */}
      <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-teal-300 bg-teal-50/50 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-white text-teal-600 shadow-soft">
            <ShieldCheck size={20} />
          </span>
          <div>
            <p className="font-display text-sm font-bold text-ink">Intégration Yousign — à venir</p>
            <p className="mt-0.5 max-w-xl text-sm text-ink-muted">
              Cette interface simule le parcours de signature. La connexion à l'API Yousign permettra l'envoi réel,
              la signature qualifiée eIDAS et la récupération automatique des preuves de signature.
            </p>
          </div>
        </div>
        <span className="inline-flex shrink-0 items-center gap-1.5 self-start rounded-full bg-white px-3 py-1.5 text-xs font-bold text-teal-700 ring-1 ring-teal-200 sm:self-center">
          <Sparkles size={13} /> Bientôt disponible
        </span>
      </div>

      {/* MODAL — send for signature */}
      {modal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => phase !== "sending" && setModal(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-ink/8 bg-white p-6 shadow-float animate-scale-in">
            {phase === "form" && (
              <>
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/12 text-teal-600">
                      <Send size={18} />
                    </span>
                    <h3 className="font-display text-lg font-bold text-ink">Envoyer pour signature</h3>
                  </div>
                  <button onClick={() => setModal(false)} className="rounded-lg p-1.5 text-ink/40 hover:bg-ink/5 hover:text-ink">
                    <X size={18} />
                  </button>
                </div>

                <div className="mt-5 space-y-4">
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Document</span>
                    <select value={doc} onChange={(e) => setDoc(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-400 focus:bg-white">
                      <option>Convention de formation</option>
                      <option>Convocation stagiaire</option>
                      <option>Règlement intérieur</option>
                      <option>Devis commercial</option>
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-ink-muted">Destinataire</span>
                    <select value={clientId} onChange={(e) => setClientId(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3.5 py-2.5 text-sm text-ink outline-none transition-colors focus:border-teal-400 focus:bg-white">
                      {clients.map((c) => (
                        <option key={c.id} value={c.id}>{c.prenom} {c.nom} · {c.entreprise}</option>
                      ))}
                    </select>
                  </label>
                </div>

                <button onClick={send} className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-ink px-4 py-3 text-sm font-semibold text-cream transition-all hover:bg-ink-soft">
                  <Send size={16} /> Envoyer la demande de signature
                </button>
              </>
            )}

            {phase === "sending" && (
              <div className="grid place-items-center py-10 text-center">
                <Loader2 size={32} className="animate-spin text-teal-600" />
                <p className="mt-4 font-display text-base font-bold text-ink">Envoi en cours…</p>
                <p className="mt-1 text-sm text-ink-muted">Préparation de l'enveloppe de signature sécurisée.</p>
              </div>
            )}

            {phase === "done" && (
              <div className="grid place-items-center py-8 text-center">
                <span className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-50 text-teal-600">
                  <CheckCircle2 size={30} />
                </span>
                <p className="mt-4 font-display text-lg font-bold text-ink">Demande envoyée</p>
                <p className="mt-1 max-w-xs text-sm text-ink-muted">
                  Le destinataire va recevoir un e-mail l'invitant à signer le document. Le statut est suivi dans la liste.
                </p>
                <button onClick={() => setModal(false)} className="mt-6 inline-flex items-center gap-2 rounded-xl bg-ink px-4 py-2.5 text-sm font-semibold text-cream transition-all hover:bg-ink-soft">
                  Voir le suivi <ArrowRight size={15} />
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function SigStat({ icon: Icon, label, value, accent }) {
  const map = {
    sky: "bg-sky-50 text-sky-600",
    amber: "bg-amber-50 text-amber-600",
    teal: "bg-teal-50 text-teal-600",
  };
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
        <span className={`grid h-8 w-8 place-items-center rounded-lg ${map[accent]}`}>
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
