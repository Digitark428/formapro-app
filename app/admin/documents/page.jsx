"use client";

import { useState } from "react";
import {
  FileText, FileSignature, CalendarCheck, ListChecks, Award, Receipt, BookOpen,
  Plus, Pencil, Trash2, UploadCloud, Paperclip, Wand2, Loader2, Check, CheckCircle2,
  Download, X, Files,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { DOC_TYPES, DOC_TYPE_ICON, FORMATIONS } from "@/lib/mockData";
import { formatDate } from "@/lib/utils";

const ICONS = { FileText, FileSignature, CalendarCheck, ListChecks, Award, Receipt, BookOpen };
const typeIcon = (type) => ICONS[DOC_TYPE_ICON[type]] || FileText;

const GEN_STEPS = (tpl, fmt) => [
  "Récupération des données du prospect…",
  `Application du modèle « ${tpl} »…`,
  "Insertion des champs dynamiques…",
  `Génération du fichier ${fmt}…`,
  "Document prêt.",
];

const slug = (s) => (s || "modele").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^\w]+/g, "_").replace(/^_|_$/g, "");

export default function DocumentsPage() {
  const { templates, documents, prospects, addTemplate, updateTemplate, deleteTemplate, addDocument, logActivity } = useStore();

  // template editor modal
  const [tplModal, setTplModal] = useState(null); // null | {id|null}
  const [tNom, setTNom] = useState("");
  const [tType, setTType] = useState(DOC_TYPES[0]);
  const [tFormat, setTFormat] = useState("PDF");
  const [tFile, setTFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // delete confirm
  const [delId, setDelId] = useState(null);

  // generate modal
  const [genOpen, setGenOpen] = useState(false);
  const [gProspect, setGProspect] = useState("");
  const [gTpl, setGTpl] = useState("");
  const [gPhase, setGPhase] = useState("form"); // form | generating | done
  const [gStep, setGStep] = useState(0);

  const openTpl = (tpl) => {
    setTplModal({ id: tpl?.id || null });
    setTNom(tpl?.nom || "");
    setTType(tpl?.type || DOC_TYPES[0]);
    setTFormat(tpl?.format || "PDF");
    setTFile(tpl?.fichier || null);
    setUploading(false);
  };

  const simulateUpload = () => {
    setUploading(true);
    setTimeout(() => {
      setTFile(`${slug(tNom)}.${tFormat.toLowerCase()}`);
      setUploading(false);
    }, 900);
  };

  const saveTpl = () => {
    if (!tNom.trim()) return;
    const fichier = tFile || `${slug(tNom)}.${tFormat.toLowerCase()}`;
    if (tplModal.id) updateTemplate(tplModal.id, { nom: tNom.trim(), type: tType, format: tFormat, fichier });
    else addTemplate({ nom: tNom.trim(), type: tType, format: tFormat, fichier });
    setTplModal(null);
  };

  const openGen = () => {
    setGProspect(prospects[0]?.id || "");
    setGTpl(templates[0]?.id || "");
    setGPhase("form");
    setGStep(0);
    setGenOpen(true);
  };

  const runGen = () => {
    const p = prospects.find((x) => x.id === gProspect);
    const t = templates.find((x) => x.id === gTpl);
    if (!p || !t) return;
    const steps = GEN_STEPS(t.nom, t.format);
    setGPhase("generating");
    setGStep(0);
    let i = 0;
    const timer = setInterval(() => {
      i += 1;
      setGStep(i);
      if (i >= steps.length - 1) {
        clearInterval(timer);
        const formation = FORMATIONS.find((f) => f.id === p.formation);
        addDocument({ modele: t.nom, type: t.type, client: p.entreprise, formation: formation ? formation.titre : "Documents généraux" });
        logActivity(p.id, "doc", `Document généré : ${t.nom}`);
        setTimeout(() => setGPhase("done"), 450);
      }
    }, 600);
  };

  const genProspect = prospects.find((x) => x.id === gProspect);
  const genTpl = templates.find((x) => x.id === gTpl);
  const steps = genTpl ? GEN_STEPS(genTpl.nom, genTpl.format) : [];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-ink to-ink-soft p-6 text-cream">
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="relative flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/20 text-teal-300"><Files size={22} /></span>
            <div>
              <h2 className="font-display text-xl font-bold">Gestion documentaire</h2>
              <p className="text-sm text-cream/60">Gérez vos modèles, puis générez des documents pré-remplis pour vos prospects.</p>
            </div>
          </div>
          <button onClick={openGen} className="inline-flex items-center gap-2 rounded-xl bg-teal-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-teal-400">
            <Wand2 size={16} /> Générer un document
          </button>
        </div>
      </div>

      {/* Modèles */}
      <section>
        <div className="mb-3 flex items-center justify-between">
          <h3 className="font-display text-lg font-extrabold text-ink">Modèles de documents</h3>
          <button onClick={() => openTpl(null)} className="inline-flex items-center gap-1.5 rounded-xl border border-ink/10 bg-white px-3 py-2 text-sm font-semibold hover:border-ink/30">
            <Plus size={16} /> Ajouter un modèle
          </button>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((t) => {
            const Icon = typeIcon(t.type);
            return (
              <div key={t.id} className="flex flex-col rounded-2xl border border-ink/8 bg-white p-5 shadow-soft">
                <div className="flex items-start justify-between">
                  <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/12 text-teal-600"><Icon size={20} /></span>
                  <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${t.format === "PDF" ? "bg-red-50 text-red-600" : "bg-blue-50 text-blue-700"}`}>{t.format}</span>
                </div>
                <h4 className="mt-4 font-display text-base font-bold leading-snug text-ink">{t.nom}</h4>
                <p className="mt-0.5 text-xs font-semibold text-ink-muted">{t.type}</p>
                <p className="mt-2 flex items-center gap-1.5 truncate text-xs text-ink/50"><Paperclip size={13} /> {t.fichier}</p>
                <div className="mt-4 flex gap-2 border-t border-ink/6 pt-3">
                  <button onClick={() => openTpl(t)} className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-ink/10 px-2 py-1.5 text-xs font-semibold hover:border-ink/30">
                    <Pencil size={13} /> Modifier
                  </button>
                  <button onClick={() => setDelId(t.id)} className="inline-flex items-center justify-center gap-1.5 rounded-lg border border-red-200 bg-red-50 px-2.5 py-1.5 text-xs font-semibold text-red-600 hover:bg-red-100">
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Documents générés */}
      <section className="card overflow-hidden">
        <div className="flex items-center justify-between border-b border-ink/8 px-5 py-3">
          <h3 className="font-display text-sm font-bold text-ink">Documents générés</h3>
          <span className="rounded-full bg-ink/5 px-2 py-0.5 text-xs font-bold text-ink/60">{documents.length}</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-sm">
            <thead>
              <tr className="border-b border-ink/8 bg-cream text-left text-xs font-semibold uppercase tracking-wider text-ink-muted">
                <th className="px-5 py-3">Document</th>
                <th className="px-5 py-3">Type</th>
                <th className="px-5 py-3">Client</th>
                <th className="px-5 py-3">Date</th>
                <th className="px-5 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-ink/6">
              {documents.map((d) => (
                <tr key={d.id} className="transition-colors hover:bg-cream">
                  <td className="px-5 py-3 font-semibold text-ink">{d.modele}</td>
                  <td className="px-5 py-3">{d.type ? <span className="rounded-full bg-teal-50 px-2 py-0.5 text-xs font-semibold text-teal-700">{d.type}</span> : "—"}</td>
                  <td className="px-5 py-3 text-ink/70">{d.client}</td>
                  <td className="px-5 py-3 text-ink/60">{formatDate(d.date)}</td>
                  <td className="px-5 py-3 text-right">
                    <button className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600 hover:underline"><Download size={13} /> PDF</button>
                  </td>
                </tr>
              ))}
              {documents.length === 0 && (
                <tr><td colSpan={5} className="px-5 py-10 text-center text-sm text-ink/40">Aucun document généré pour l'instant.</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </section>

      {/* TEMPLATE MODAL */}
      {tplModal && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setTplModal(null)} />
          <div className="relative w-full max-w-md rounded-3xl border border-ink/8 bg-white p-6 shadow-float animate-scale-in">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/12 text-teal-600">{tplModal.id ? <Pencil size={18} /> : <Plus size={18} />}</span>
                <h3 className="font-display text-lg font-bold text-ink">{tplModal.id ? "Modifier le modèle" : "Ajouter un modèle"}</h3>
              </div>
              <button onClick={() => setTplModal(null)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/5"><X size={16} /></button>
            </div>
            <div className="mt-5 space-y-3">
              <label className="block">
                <span className="mb-1 block text-xs font-semibold text-ink-muted">Nom du modèle *</span>
                <input value={tNom} onChange={(e) => setTNom(e.target.value)} placeholder="Ex : Convention de formation" className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none" />
              </label>
              <div className="grid grid-cols-2 gap-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">Type</span>
                  <select value={tType} onChange={(e) => setTType(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                    {DOC_TYPES.map((x) => <option key={x} value={x}>{x}</option>)}
                  </select>
                </label>
                <label className="block">
                  <span className="mb-1 block text-xs font-semibold text-ink-muted">Format</span>
                  <select value={tFormat} onChange={(e) => setTFormat(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                    <option>PDF</option><option>DOCX</option>
                  </select>
                </label>
              </div>
              <div>
                <span className="mb-1 block text-xs font-semibold text-ink-muted">Fichier modèle</span>
                <button onClick={simulateUpload} disabled={uploading} className="flex w-full items-center justify-center gap-2 rounded-xl border border-dashed border-ink/20 bg-cream px-3 py-4 text-sm text-ink-muted transition-colors hover:border-teal-400 hover:text-teal-700">
                  {uploading ? (
                    <><Loader2 size={16} className="animate-spin text-teal-600" /> Téléversement…</>
                  ) : tFile ? (
                    <span className="inline-flex items-center gap-2 font-semibold text-teal-700"><CheckCircle2 size={16} /> {tFile}</span>
                  ) : (
                    <><UploadCloud size={16} /> Cliquer pour téléverser (PDF, DOCX)</>
                  )}
                </button>
              </div>
            </div>
            <button onClick={saveTpl} className="btn-primary mt-6 w-full py-3"><Check size={16} /> {tplModal.id ? "Enregistrer" : "Ajouter le modèle"}</button>
          </div>
        </div>
      )}

      {/* DELETE CONFIRM */}
      {delId && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => setDelId(null)} />
          <div className="relative w-full max-w-sm rounded-3xl border border-ink/8 bg-white p-6 text-center shadow-float animate-scale-in">
            <span className="mx-auto grid h-14 w-14 place-items-center rounded-2xl bg-red-50 text-red-600"><Trash2 size={26} /></span>
            <h3 className="mt-4 font-display text-lg font-bold text-ink">Supprimer ce modèle ?</h3>
            <p className="mt-1 text-sm text-ink-muted">« {templates.find((t) => t.id === delId)?.nom} » sera retiré de la bibliothèque.</p>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setDelId(null)} className="flex-1 rounded-xl border border-ink/10 px-4 py-2.5 text-sm font-semibold">Annuler</button>
              <button onClick={() => { deleteTemplate(delId); setDelId(null); }} className="flex-1 rounded-xl bg-red-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-red-700">Supprimer</button>
            </div>
          </div>
        </div>
      )}

      {/* GENERATE MODAL */}
      {genOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center p-4">
          <div className="absolute inset-0 bg-ink/40 backdrop-blur-sm" onClick={() => gPhase !== "generating" && setGenOpen(false)} />
          <div className="relative w-full max-w-md rounded-3xl border border-ink/8 bg-white p-6 shadow-float animate-scale-in">
            {gPhase === "form" && (
              <>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-xl bg-teal-500/12 text-teal-600"><Wand2 size={18} /></span>
                    <h3 className="font-display text-lg font-bold text-ink">Générer un document</h3>
                  </div>
                  <button onClick={() => setGenOpen(false)} className="grid h-8 w-8 place-items-center rounded-lg hover:bg-ink/5"><X size={16} /></button>
                </div>
                <div className="mt-5 space-y-3">
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-ink-muted">Prospect / Client</span>
                    <select value={gProspect} onChange={(e) => setGProspect(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                      {prospects.map((p) => <option key={p.id} value={p.id}>{p.prenom} {p.nom} · {p.entreprise}</option>)}
                    </select>
                  </label>
                  <label className="block">
                    <span className="mb-1 block text-xs font-semibold text-ink-muted">Modèle</span>
                    <select value={gTpl} onChange={(e) => setGTpl(e.target.value)} className="w-full rounded-xl border border-ink/12 bg-cream px-3 py-2.5 text-sm focus:border-teal-500 focus:outline-none">
                      {templates.map((t) => <option key={t.id} value={t.id}>{t.nom} · {t.type}</option>)}
                    </select>
                  </label>
                </div>
                <button onClick={runGen} className="btn-primary mt-6 w-full py-3"><Wand2 size={16} /> Générer</button>
              </>
            )}

            {gPhase === "generating" && (
              <div className="py-2">
                <div className="flex flex-col items-center">
                  <span className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-50 text-teal-600"><Loader2 size={28} className="animate-spin" /></span>
                  <p className="mt-4 text-sm font-semibold text-ink">Génération en cours…</p>
                </div>
                <ul className="mt-5 space-y-2">
                  {steps.map((s, i) => (
                    <li key={i} className={`flex items-center gap-2.5 text-sm ${i <= gStep ? "opacity-100" : "opacity-30"}`}>
                      <span className={`grid h-5 w-5 place-items-center rounded-full ${i < gStep ? "bg-teal-500 text-white" : i === gStep ? "bg-teal-100 text-teal-600" : "bg-ink/8 text-ink/40"}`}>
                        {i < gStep ? <Check size={12} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                      </span>
                      <span className={i <= gStep ? "text-ink" : "text-ink/40"}>{s}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {gPhase === "done" && (
              <div className="flex flex-col items-center py-2 text-center animate-scale-in">
                <span className="grid h-16 w-16 place-items-center rounded-2xl bg-teal-500/15 text-teal-600"><Check size={30} /></span>
                <h4 className="mt-4 font-display text-lg font-bold text-ink">Document généré !</h4>
                <p className="mt-1 text-sm text-ink-muted">
                  <span className="font-semibold text-ink">{genTpl?.nom}</span> pour {genProspect?.entreprise} est prêt.
                </p>
                <div className="mt-5 flex w-full gap-2">
                  <button className="btn-primary flex-1 py-2.5"><Download size={15} /> Télécharger</button>
                  <button onClick={() => setGenOpen(false)} className="btn-ghost flex-1 py-2.5">Voir la liste</button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
