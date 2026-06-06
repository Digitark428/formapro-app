"use client";

import { useMemo, useState } from "react";
import {
  Folder, FolderOpen, FileText, ChevronRight, Search, Download,
  Archive, Building2, GraduationCap, FileSignature, HardDriveDownload, Eye,
} from "lucide-react";
import { useStore } from "@/lib/store";
import { formatDate } from "@/lib/utils";

// Pick an icon depending on the document type label
function docIcon(modele = "") {
  const m = modele.toLowerCase();
  if (m.includes("convention") || m.includes("devis")) return FileSignature;
  return FileText;
}

export default function ArchivagePage() {
  const { documents, signatures, prospects } = useStore();
  const [query, setQuery] = useState("");
  const [openClients, setOpenClients] = useState({});
  const [openFormations, setOpenFormations] = useState({});

  // Build a unified flat list of archived items from documents + signed signatures
  const items = useMemo(() => {
    const fromDocs = documents.map((d) => ({
      id: d.id,
      client: d.client,
      formation: d.formation || "Documents généraux",
      nom: d.modele,
      date: d.date,
      type: "document",
    }));

    const fromSigs = signatures
      .filter((s) => s.statut === "signe")
      .map((s) => {
        // "Convention — Atlas Logistique" -> client = "Atlas Logistique"
        const parts = s.document.split("—");
        const client = (parts[1] || "").trim() || s.signataire;
        const nom = `${(parts[0] || "Document").trim()} (signée)`;
        return {
          id: s.id,
          client,
          formation: "Documents signés",
          nom,
          date: s.signe || s.envoye,
          type: "signature",
        };
      });

    return [...fromDocs, ...fromSigs];
  }, [documents, signatures]);

  // Group: client -> formation -> [items]
  const tree = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = q
      ? items.filter(
          (it) =>
            it.client.toLowerCase().includes(q) ||
            it.formation.toLowerCase().includes(q) ||
            it.nom.toLowerCase().includes(q)
        )
      : items;

    const byClient = {};
    for (const it of filtered) {
      byClient[it.client] = byClient[it.client] || {};
      byClient[it.client][it.formation] = byClient[it.client][it.formation] || [];
      byClient[it.client][it.formation].push(it);
    }
    return byClient;
  }, [items, query]);

  const clientNames = Object.keys(tree).sort((a, b) => a.localeCompare(b, "fr"));
  const totalDocs = items.length;
  const totalClients = new Set(items.map((i) => i.client)).size;
  const totalFormations = new Set(items.map((i) => `${i.client}::${i.formation}`)).size;

  // When searching, auto-expand everything for visibility
  const searching = query.trim().length > 0;

  const toggleClient = (c) => setOpenClients((s) => ({ ...s, [c]: !s[c] }));
  const toggleFormation = (key) => setOpenFormations((s) => ({ ...s, [key]: !s[key] }));

  const isClientOpen = (c) => searching || openClients[c];
  const isFormationOpen = (key) => searching || openFormations[key];

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      {/* Intro */}
      <div className="relative overflow-hidden rounded-2xl border border-ink/8 bg-gradient-to-br from-ink to-ink-soft p-6 text-cream">
        <div className="pointer-events-none absolute -right-12 -top-12 h-44 w-44 rounded-full bg-teal-500/25 blur-3xl" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/20 text-teal-300">
            <Archive size={22} />
          </span>
          <div>
            <h2 className="font-display text-xl font-bold">Archivage documentaire</h2>
            <p className="text-sm text-cream/60">
              Classement automatique de tous les documents : Client → Formation → Documents.
            </p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <ArchStat icon={Building2} label="Clients archivés" value={totalClients} />
        <ArchStat icon={GraduationCap} label="Dossiers formation" value={totalFormations} />
        <ArchStat icon={FileText} label="Documents classés" value={totalDocs} />
      </div>

      {/* File manager */}
      <div className="card overflow-hidden">
        {/* Toolbar */}
        <div className="flex flex-col gap-3 border-b border-ink/8 px-5 py-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <HardDriveDownload size={16} className="text-teal-600" />
            <h3 className="font-display text-sm font-bold text-ink">Arborescence des dossiers</h3>
          </div>
          <div className="relative w-full sm:w-72">
            <Search size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/40" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un client, une formation, un document…"
              className="w-full rounded-xl border border-ink/12 bg-cream py-2 pl-9 pr-3 text-sm text-ink outline-none transition-colors placeholder:text-ink/35 focus:border-teal-400 focus:bg-white"
            />
          </div>
        </div>

        {/* Tree */}
        {clientNames.length === 0 ? (
          <div className="grid place-items-center px-6 py-16 text-center">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-ink/5 text-ink/40">
              <Folder size={22} />
            </span>
            <p className="mt-3 text-sm font-medium text-ink-muted">Aucun document ne correspond à votre recherche.</p>
          </div>
        ) : (
          <div className="divide-y divide-ink/6">
            {clientNames.map((client) => {
              const formations = tree[client];
              const formationNames = Object.keys(formations).sort((a, b) => a.localeCompare(b, "fr"));
              const docCount = formationNames.reduce((acc, f) => acc + formations[f].length, 0);
              const open = isClientOpen(client);
              return (
                <div key={client}>
                  {/* Client row */}
                  <button
                    onClick={() => toggleClient(client)}
                    className="flex w-full items-center gap-2.5 px-4 py-3 text-left transition-colors hover:bg-cream"
                  >
                    <ChevronRight
                      size={16}
                      className={`shrink-0 text-ink/40 transition-transform ${open ? "rotate-90" : ""}`}
                    />
                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-teal-500/12 text-teal-600">
                      {open ? <FolderOpen size={18} /> : <Folder size={18} />}
                    </span>
                    <span className="flex-1 font-display text-sm font-bold text-ink">{client}</span>
                    <span className="rounded-full bg-ink/5 px-2 py-0.5 text-[11px] font-bold text-ink/55">
                      {docCount} doc{docCount > 1 ? "s" : ""}
                    </span>
                  </button>

                  {/* Formations */}
                  {open && (
                    <div className="bg-cream/40">
                      {formationNames.map((formation) => {
                        const docs = formations[formation];
                        const fKey = `${client}::${formation}`;
                        const fOpen = isFormationOpen(fKey);
                        return (
                          <div key={fKey}>
                            <button
                              onClick={() => toggleFormation(fKey)}
                              className="flex w-full items-center gap-2.5 py-2.5 pl-11 pr-4 text-left transition-colors hover:bg-cream"
                            >
                              <ChevronRight
                                size={14}
                                className={`shrink-0 text-ink/35 transition-transform ${fOpen ? "rotate-90" : ""}`}
                              />
                              <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-amber-50 text-amber-600">
                                {fOpen ? <FolderOpen size={15} /> : <Folder size={15} />}
                              </span>
                              <span className="flex-1 text-sm font-semibold text-ink/80">{formation}</span>
                              <span className="text-[11px] font-bold text-ink/40">{docs.length}</span>
                            </button>

                            {/* Documents */}
                            {fOpen && (
                              <ul>
                                {docs
                                  .slice()
                                  .sort((a, b) => new Date(b.date) - new Date(a.date))
                                  .map((d) => {
                                    const Icon = docIcon(d.nom);
                                    return (
                                      <li
                                        key={d.id}
                                        className="group flex items-center gap-2.5 py-2 pl-[68px] pr-4 transition-colors hover:bg-white"
                                      >
                                        <span className="grid h-7 w-7 shrink-0 place-items-center rounded-md bg-white text-ink/55 shadow-soft">
                                          <Icon size={14} />
                                        </span>
                                        <span className="flex-1 truncate text-sm text-ink/80">{d.nom}</span>
                                        <span className="hidden text-xs text-ink/40 sm:block">{formatDate(d.date)}</span>
                                        <div className="flex items-center gap-1 opacity-0 transition-opacity group-hover:opacity-100">
                                          <button className="grid h-7 w-7 place-items-center rounded-md text-ink/50 hover:bg-ink/5 hover:text-ink" title="Aperçu">
                                            <Eye size={14} />
                                          </button>
                                          <button className="grid h-7 w-7 place-items-center rounded-md text-teal-600 hover:bg-teal-50" title="Télécharger">
                                            <Download size={14} />
                                          </button>
                                        </div>
                                      </li>
                                    );
                                  })}
                              </ul>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>

      <p className="px-1 text-xs text-ink-muted">
        Chaque document généré ou signé est automatiquement rangé dans le dossier du client correspondant,
        puis dans le sous-dossier de la formation concernée — sans aucune action manuelle.
      </p>
    </div>
  );
}

function ArchStat({ icon: Icon, label, value }) {
  return (
    <div className="rounded-2xl border border-ink/8 bg-white p-5 shadow-soft">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-ink-muted">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-teal-50 text-teal-600">
          <Icon size={16} />
        </span>
      </div>
      <p className="mt-2 font-display text-3xl font-extrabold text-ink">{value}</p>
    </div>
  );
}
