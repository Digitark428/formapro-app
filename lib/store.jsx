"use client";

import { createContext, useContext, useEffect, useState, useCallback } from "react";
import {
  SEED_PROSPECTS,
  SEED_DOCUMENTS,
  SEED_SIGNATURES,
  SEED_TEMPLATES,
} from "./mockData";
import { uid } from "./utils";

const StoreContext = createContext(null);

const LS_KEY = "formapro_demo_state_v1";
const AUTH_KEY = "formapro_demo_auth_v1";

function loadState() {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(LS_KEY);
    if (raw) return JSON.parse(raw);
  } catch (e) {
    /* ignore */
  }
  return null;
}

export function StoreProvider({ children }) {
  const [hydrated, setHydrated] = useState(false);
  const [prospects, setProspects] = useState(SEED_PROSPECTS);
  const [documents, setDocuments] = useState(SEED_DOCUMENTS);
  const [signatures, setSignatures] = useState(SEED_SIGNATURES);
  const [templates, setTemplates] = useState(SEED_TEMPLATES);
  const [authed, setAuthed] = useState(false);

  // Hydrate from localStorage on mount
  useEffect(() => {
    const saved = loadState();
    if (saved) {
      setProspects(saved.prospects || SEED_PROSPECTS);
      setDocuments(saved.documents || SEED_DOCUMENTS);
      setSignatures(saved.signatures || SEED_SIGNATURES);
      setTemplates(saved.templates || SEED_TEMPLATES);
    }
    try {
      setAuthed(window.localStorage.getItem(AUTH_KEY) === "1");
    } catch (e) {}
    setHydrated(true);
  }, []);

  // Persist on change
  useEffect(() => {
    if (!hydrated) return;
    try {
      window.localStorage.setItem(
        LS_KEY,
        JSON.stringify({ prospects, documents, signatures, templates })
      );
    } catch (e) {}
  }, [prospects, documents, signatures, templates, hydrated]);

  // ---- Auth ----
  const login = useCallback((email, password) => {
    const ok = email.trim().toLowerCase() === "demo@formapro.fr" && password === "demo";
    if (ok) {
      setAuthed(true);
      try {
        window.localStorage.setItem(AUTH_KEY, "1");
      } catch (e) {}
    }
    return ok;
  }, []);

  const logout = useCallback(() => {
    setAuthed(false);
    try {
      window.localStorage.removeItem(AUTH_KEY);
    } catch (e) {}
  }, []);

  // ---- Prospects ----
  const addProspect = useCallback((data) => {
    const now = new Date().toISOString();
    const prospect = {
      id: uid("p"),
      ...data,
      status: "nouveau",
      responsable: null,
      createdAt: now,
      lastActivity: now,
      notes: [],
      historique: [
        { id: uid("h"), date: now, type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
      ],
    };
    setProspects((prev) => [prospect, ...prev]);
    return prospect;
  }, []);

  const updateProspectStatus = useCallback((id, status, label) => {
    const now = new Date().toISOString();
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              status,
              lastActivity: now,
              historique: [
                ...p.historique,
                { id: uid("h"), date: now, type: "statut", texte: `Statut passé à « ${label} »` },
              ],
            }
          : p
      )
    );
  }, []);

  const addNote = useCallback((id, texte) => {
    const now = new Date().toISOString();
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              lastActivity: now,
              notes: [{ id: uid("n"), date: now, texte }, ...p.notes],
              historique: [
                ...p.historique,
                { id: uid("h"), date: now, type: "note", texte: "Note ajoutée" },
              ],
            }
          : p
      )
    );
  }, []);

  const logActivity = useCallback((id, type, texte) => {
    const now = new Date().toISOString();
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              lastActivity: now,
              historique: [...p.historique, { id: uid("h"), date: now, type, texte }],
            }
          : p
      )
    );
  }, []);

  const assignProspect = useCallback((id, responsable) => {
    const now = new Date().toISOString();
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              responsable,
              lastActivity: now,
              historique: [
                ...p.historique,
                { id: uid("h"), date: now, type: "assignation", texte: `Prospect assigné à ${responsable}` },
              ],
            }
          : p
      )
    );
  }, []);

  const logRelance = useCallback((id) => {
    const now = new Date().toISOString();
    setProspects((prev) =>
      prev.map((p) =>
        p.id === id
          ? {
              ...p,
              lastActivity: now,
              historique: [
                ...p.historique,
                {
                  id: uid("h"),
                  date: now,
                  type: "relance",
                  texte: `Relance effectuée${p.responsable ? ` par ${p.responsable}` : ""}`,
                },
              ],
            }
          : p
      )
    );
  }, []);

  const deleteProspect = useCallback((id) => {
    setProspects((prev) => prev.filter((p) => p.id !== id));
  }, []);

  // ---- Documents ----
  const addDocument = useCallback((doc) => {
    const d = { id: uid("d"), date: new Date().toISOString(), statut: "genere", ...doc };
    setDocuments((prev) => [d, ...prev]);
    return d;
  }, []);

  // ---- Modèles de documents (bibliothèque) ----
  const addTemplate = useCallback((tpl) => {
    const t = { id: uid("tpl"), ...tpl };
    setTemplates((prev) => [...prev, t]);
    return t;
  }, []);

  const updateTemplate = useCallback((id, patch) => {
    setTemplates((prev) => prev.map((t) => (t.id === id ? { ...t, ...patch } : t)));
  }, []);

  const deleteTemplate = useCallback((id) => {
    setTemplates((prev) => prev.filter((t) => t.id !== id));
  }, []);

  // ---- Signatures ----
  const addSignature = useCallback((sig) => {
    const s = { id: uid("s"), envoye: new Date().toISOString(), signe: null, statut: "envoye", ...sig };
    setSignatures((prev) => [s, ...prev]);
    return s;
  }, []);

  const markSigned = useCallback((id) => {
    setSignatures((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, statut: "signe", signe: new Date().toISOString() } : s
      )
    );
  }, []);

  const resetDemo = useCallback(() => {
    setProspects(SEED_PROSPECTS);
    setDocuments(SEED_DOCUMENTS);
    setSignatures(SEED_SIGNATURES);
    setTemplates(SEED_TEMPLATES);
  }, []);

  const value = {
    hydrated,
    prospects,
    documents,
    signatures,
    templates,
    authed,
    login,
    logout,
    addProspect,
    updateProspectStatus,
    assignProspect,
    addNote,
    logActivity,
    logRelance,
    deleteProspect,
    addDocument,
    addTemplate,
    updateTemplate,
    deleteTemplate,
    addSignature,
    markSigned,
    resetDemo,
  };

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>;
}

export function useStore() {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used within StoreProvider");
  return ctx;
}
