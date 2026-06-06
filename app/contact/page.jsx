"use client";

import Link from "next/link";
import { useState } from "react";
import {
  ArrowRight, CheckCircle2, ShieldCheck, Clock, Phone, Mail, MapPin,
  Building2, Users, Hash, Briefcase, PartyPopper,
} from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { useStore } from "@/lib/store";
import { SECTEURS, FORMATIONS } from "@/lib/mockData";

const EMPTY = {
  prenom: "", nom: "", entreprise: "", telephone: "", email: "",
  adresse: "", siret: "", salaries: "", secteur: "", formation: "",
};

export default function ContactPage() {
  const { addProspect } = useStore();
  const [form, setForm] = useState(EMPTY);
  const [done, setDone] = useState(false);
  const [errors, setErrors] = useState({});

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const err = {};
    ["prenom", "nom", "entreprise", "email"].forEach((k) => {
      if (!form[k].trim()) err[k] = "Requis";
    });
    if (form.email && !/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(form.email))
      err.email = "Email invalide";
    setErrors(err);
    return Object.keys(err).length === 0;
  };

  const submit = (e) => {
    e.preventDefault();
    if (!validate()) return;
    addProspect(form);
    setDone(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <main className="overflow-x-hidden">
      <Navbar />

      <section className="relative pt-32 pb-24">
        <div className="absolute inset-0 bg-dotgrid [mask-image:radial-gradient(ellipse_at_top,black,transparent_65%)]" />
        <div className="relative mx-auto max-w-6xl px-5">
          <div className="grid gap-12 lg:grid-cols-[1fr_1.25fr]">
            {/* Left column */}
            <div className="reveal">
              <span className="text-xs font-semibold uppercase tracking-[0.18em] text-teal-600">
                Contact
              </span>
              <h1 className="mt-3 font-display text-4xl font-bold leading-[1.1] tracking-tight text-ink sm:text-5xl">
                Parlons de votre projet de formation
              </h1>
              <p className="mt-4 max-w-md text-lg text-ink-muted">
                Remplissez ce formulaire : votre demande crée instantanément une fiche dans notre
                CRM et un conseiller vous recontacte sous 24h.
              </p>

              <ul className="mt-8 space-y-4">
                {[
                  [ShieldCheck, "Vos données restent confidentielles", "Aucun engagement, aucune carte requise."],
                  [Clock, "Réponse en moins de 24 heures", "Du lundi au vendredi, par un conseiller dédié."],
                  [CheckCircle2, "Une proposition sur mesure", "Adaptée à votre secteur et à vos effectifs."],
                ].map(([Icon, t, d]) => (
                  <li key={t} className="flex gap-3">
                    <span className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-teal-500/12 text-teal-600">
                      <Icon size={17} />
                    </span>
                    <div>
                      <div className="font-semibold text-ink">{t}</div>
                      <div className="text-sm text-ink-muted">{d}</div>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="mt-8 flex flex-wrap gap-4 text-sm text-ink-muted">
                <span className="inline-flex items-center gap-1.5"><Phone size={14} /> 01 84 80 00 00</span>
                <span className="inline-flex items-center gap-1.5"><Mail size={14} /> contact@formapro.fr</span>
              </div>
            </div>

            {/* Right column — form / success */}
            <div className="reveal">
              {done ? (
                <SuccessCard form={form} onReset={() => { setForm(EMPTY); setDone(false); }} />
              ) : (
                <form
                  onSubmit={submit}
                  className="rounded-3xl border border-ink/8 bg-white p-6 shadow-card sm:p-8"
                >
                  <h2 className="font-display text-xl font-bold text-ink">Demande de devis</h2>
                  <p className="mt-1 text-sm text-ink-muted">
                    Les champs marqués d'un <span className="text-teal-600">*</span> sont obligatoires.
                  </p>

                  <div className="mt-6 grid gap-4 sm:grid-cols-2">
                    <Field label="Prénom" req error={errors.prenom}>
                      <input className="inp" value={form.prenom} onChange={set("prenom")} placeholder="Camille" />
                    </Field>
                    <Field label="Nom" req error={errors.nom}>
                      <input className="inp" value={form.nom} onChange={set("nom")} placeholder="Lefèvre" />
                    </Field>
                    <Field label="Entreprise" req error={errors.entreprise} icon={Building2}>
                      <input className="inp pl-9" value={form.entreprise} onChange={set("entreprise")} placeholder="Atlas Logistique" />
                    </Field>
                    <Field label="Téléphone" icon={Phone}>
                      <input className="inp pl-9" value={form.telephone} onChange={set("telephone")} placeholder="06 12 34 56 78" />
                    </Field>
                    <Field label="Email" req error={errors.email} icon={Mail} full>
                      <input className="inp pl-9" value={form.email} onChange={set("email")} placeholder="contact@entreprise.fr" />
                    </Field>
                    <Field label="Adresse" icon={MapPin} full>
                      <input className="inp pl-9" value={form.adresse} onChange={set("adresse")} placeholder="14 rue des Docks, 76600 Le Havre" />
                    </Field>
                    <Field label="SIRET" icon={Hash}>
                      <input className="inp pl-9" value={form.siret} onChange={set("siret")} placeholder="812 456 789 00021" />
                    </Field>
                    <Field label="Nombre de salariés" icon={Users}>
                      <input className="inp pl-9" value={form.salaries} onChange={set("salaries")} placeholder="120" />
                    </Field>
                    <Field label="Secteur d'activité" icon={Briefcase} full>
                      <select className="inp pl-9 appearance-none" value={form.secteur} onChange={set("secteur")}>
                        <option value="">Sélectionnez un secteur…</option>
                        {SECTEURS.map((s) => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </Field>
                    <Field label="Formation souhaitée" full>
                      <select className="inp appearance-none" value={form.formation} onChange={set("formation")}>
                        <option value="">Aucune préférence / à définir</option>
                        {FORMATIONS.map((f) => <option key={f.id} value={f.id}>{f.titre}</option>)}
                      </select>
                    </Field>
                  </div>

                  <button type="submit" className="btn-primary mt-6 w-full py-3 text-base">
                    Envoyer ma demande <ArrowRight size={16} />
                  </button>
                  <p className="mt-3 text-center text-xs text-ink-muted">
                    En envoyant, vous acceptez d'être recontacté par FormaPro.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>
      </section>

      <Footer />

      <style jsx global>{`
        .inp {
          width: 100%;
          border-radius: 0.75rem;
          border: 1px solid rgba(14, 17, 22, 0.12);
          background: #fff;
          padding: 0.65rem 0.85rem;
          font-size: 0.9rem;
          color: #0e1116;
          transition: all 0.15s;
        }
        .inp::placeholder { color: rgba(14, 17, 22, 0.35); }
        .inp:focus {
          outline: none;
          border-color: #0fa980;
          box-shadow: 0 0 0 3px rgba(15, 169, 128, 0.15);
        }
      `}</style>
    </main>
  );
}

function Field({ label, children, req, error, icon: Icon, full }) {
  return (
    <label className={`block ${full ? "sm:col-span-2" : ""}`}>
      <span className="mb-1.5 block text-sm font-medium text-ink/80">
        {label} {req && <span className="text-teal-600">*</span>}
      </span>
      <span className="relative block">
        {Icon && (
          <Icon size={15} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
        )}
        {children}
      </span>
      {error && <span className="mt-1 block text-xs font-medium text-red-600">{error}</span>}
    </label>
  );
}

function SuccessCard({ form, onReset }) {
  return (
    <div className="rounded-3xl border border-teal-200 bg-white p-8 shadow-card animate-scale-in">
      <div className="grid h-14 w-14 place-items-center rounded-2xl bg-teal-500/15 text-teal-600">
        <PartyPopper size={26} />
      </div>
      <h2 className="mt-5 font-display text-2xl font-bold text-ink">Demande envoyée !</h2>
      <p className="mt-2 text-ink-muted">
        Merci {form.prenom}. Votre fiche prospect a été créée dans notre CRM avec le statut{" "}
        <span className="font-semibold text-ink">« Nouveau Prospect »</span>. Un conseiller vous
        recontacte sous 24h.
      </p>

      <div className="mt-6 rounded-2xl border border-ink/8 bg-cream p-4 text-sm">
        <div className="font-semibold text-ink">Récapitulatif</div>
        <dl className="mt-2 space-y-1 text-ink-muted">
          <Row k="Contact" v={`${form.prenom} ${form.nom}`} />
          <Row k="Entreprise" v={form.entreprise} />
          <Row k="Email" v={form.email} />
          {form.secteur && <Row k="Secteur" v={form.secteur} />}
        </dl>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:flex-row">
        <Link href="/admin/login" className="btn-primary flex-1 py-2.5">
          Voir dans l'espace admin <ArrowRight size={15} />
        </Link>
        <button onClick={onReset} className="btn-ghost flex-1 py-2.5">
          Nouvelle demande
        </button>
      </div>
    </div>
  );
}

function Row({ k, v }) {
  return (
    <div className="flex justify-between gap-4">
      <dt>{k}</dt>
      <dd className="font-medium text-ink">{v || "—"}</dd>
    </div>
  );
}
