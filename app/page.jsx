import Link from "next/link";
import {
  ArrowRight, ArrowUpRight, Star, BadgeCheck, Users, Laptop, LineChart,
  Clock, MapPin, Sparkles, CheckCircle2,
} from "lucide-react";
import Navbar from "@/components/public/Navbar";
import Footer from "@/components/public/Footer";
import { FORMATIONS, TEMOIGNAGES, AVANTAGES } from "@/lib/mockData";

const AVANTAGE_ICONS = { BadgeCheck, Users, Laptop, LineChart };

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 md:pt-40 md:pb-28">
        <div className="absolute inset-0 bg-dotgrid [mask-image:radial-gradient(ellipse_at_top,black,transparent_70%)]" />
        <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gradient-to-br from-teal-200/40 via-teal-100/20 to-transparent blur-3xl" />

        <div className="relative mx-auto max-w-6xl px-5">
          <div className="reveal mx-auto max-w-3xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-ink/10 bg-white/70 px-3.5 py-1.5 text-xs font-semibold text-ink/70 shadow-soft">
              <Sparkles size={13} className="text-teal-500" />
              Organisme certifié Qualiopi · Financement OPCO
            </span>

            <h1 className="mt-6 font-display text-4xl font-bold leading-[1.05] tracking-tight text-ink sm:text-5xl md:text-[4rem]">
              Formez vos équipes,
              <br />
              <span className="relative inline-block">
                <span className="relative z-10 text-teal-600">sans la paperasse.</span>
                <span className="absolute inset-x-0 bottom-1.5 z-0 h-3 -rotate-1 bg-teal-200/70" />
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-lg leading-relaxed text-ink-muted">
              FormaPro réunit catalogue de formations, CRM, génération de documents et signature
              électronique dans une seule plateforme pensée pour les organismes exigeants.
            </p>

            <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/contact" className="btn-primary px-6 py-3 text-base shadow-float">
                Demander un devis gratuit <ArrowRight size={16} />
              </Link>
              <Link href="#formations" className="btn-ghost px-6 py-3 text-base">
                Voir les formations
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-sm text-ink-muted">
              {["Réponse sous 24h", "Sans engagement", "Finançable OPCO"].map((t) => (
                <span key={t} className="inline-flex items-center gap-1.5">
                  <CheckCircle2 size={15} className="text-teal-500" /> {t}
                </span>
              ))}
            </div>
          </div>

          {/* Stats band */}
          <div className="reveal mx-auto mt-16 grid max-w-3xl grid-cols-2 gap-4 sm:grid-cols-4">
            {[
              ["+1 200", "stagiaires formés"],
              ["98%", "de satisfaction"],
              ["6", "domaines d'expertise"],
              ["24h", "délai de réponse"],
            ].map(([n, l]) => (
              <div key={l} className="card p-4 text-center">
                <div className="font-display text-2xl font-bold text-ink">{n}</div>
                <div className="mt-1 text-xs text-ink-muted">{l}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FORMATIONS */}
      <section id="formations" className="relative py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead
            eyebrow="Catalogue"
            title="Des formations qui transforment vos équipes"
            subtitle="Des parcours certifiants, animés par des praticiens, en présentiel ou à distance."
          />
          <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {FORMATIONS.map((f, i) => (
              <article
                key={f.id}
                className="group relative flex flex-col overflow-hidden rounded-2xl border border-ink/8 bg-white p-6 shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-card"
              >
                <div
                  className="absolute inset-x-0 top-0 h-1"
                  style={{ backgroundColor: f.couleur }}
                />
                <div className="flex items-center justify-between">
                  <span
                    className="chip"
                    style={{ backgroundColor: `${f.couleur}18`, color: f.couleur }}
                  >
                    {f.categorie}
                  </span>
                  {f.certifiante && (
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-teal-600">
                      <BadgeCheck size={14} /> Certifiante
                    </span>
                  )}
                </div>
                <h3 className="mt-4 font-display text-lg font-bold leading-snug text-ink">
                  {f.titre}
                </h3>
                <p className="mt-2 flex-1 text-sm leading-relaxed text-ink-muted">{f.resume}</p>
                <div className="mt-5 flex items-center gap-4 text-xs text-ink-muted">
                  <span className="inline-flex items-center gap-1.5">
                    <Clock size={13} /> {f.duree}
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <MapPin size={13} /> {f.modalite}
                  </span>
                </div>
                <div className="mt-5 flex items-center justify-between border-t border-ink/6 pt-4">
                  <span className="font-display text-xl font-bold text-ink">
                    {f.prix} <span className="text-xs font-medium text-ink-muted">/ pers.</span>
                  </span>
                  <Link
                    href="/contact"
                    className="inline-flex items-center gap-1 text-sm font-semibold text-teal-600 transition-transform group-hover:translate-x-0.5"
                  >
                    Détails <ArrowUpRight size={15} />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section id="avantages" className="relative py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="overflow-hidden rounded-3xl border border-ink/8 bg-ink text-cream">
            <div className="relative px-6 py-14 md:px-14">
              <div className="pointer-events-none absolute -left-10 top-0 h-64 w-64 rounded-full bg-teal-500/20 blur-3xl" />
              <div className="relative">
                <SectionHead
                  light
                  eyebrow="Pourquoi FormaPro"
                  title="Un partenaire de formation, pas un simple prestataire"
                  subtitle="Nous combinons pédagogie de terrain et plateforme digitale pour un suivi sans accroc."
                />
                <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                  {AVANTAGES.map((a) => {
                    const Icon = AVANTAGE_ICONS[a.icon];
                    return (
                      <div key={a.titre} className="rounded-2xl border border-cream/10 bg-cream/5 p-5">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-teal-500/15 text-teal-300">
                          <Icon size={20} />
                        </span>
                        <h3 className="mt-4 font-display text-base font-bold text-cream">
                          {a.titre}
                        </h3>
                        <p className="mt-2 text-sm leading-relaxed text-cream/55">{a.desc}</p>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* TEMOIGNAGES */}
      <section id="temoignages" className="relative py-20">
        <div className="mx-auto max-w-6xl px-5">
          <SectionHead
            eyebrow="Ils nous font confiance"
            title="Ce que disent nos clients"
            subtitle="Des entreprises de toutes tailles qui ont choisi de monter en compétences avec nous."
          />
          <div className="mt-12 grid gap-5 md:grid-cols-3">
            {TEMOIGNAGES.map((t) => (
              <figure key={t.id} className="card flex flex-col p-6">
                <div className="flex gap-0.5">
                  {Array.from({ length: t.note }).map((_, i) => (
                    <Star key={i} size={16} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <blockquote className="mt-4 flex-1 text-[0.95rem] leading-relaxed text-ink/80">
                  « {t.texte} »
                </blockquote>
                <figcaption className="mt-5 border-t border-ink/6 pt-4">
                  <div className="font-semibold text-ink">{t.nom}</div>
                  <div className="text-xs text-ink-muted">{t.role}</div>
                </figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20">
        <div className="mx-auto max-w-6xl px-5">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-teal-600 to-teal-800 px-6 py-16 text-center text-cream md:px-16">
            <div className="pointer-events-none absolute inset-0 bg-dotgrid opacity-[0.15]" />
            <div className="relative mx-auto max-w-2xl">
              <h2 className="font-display text-3xl font-bold leading-tight sm:text-4xl">
                Prêt à former vos équipes ?
              </h2>
              <p className="mx-auto mt-4 max-w-lg text-cream/75">
                Décrivez-nous votre besoin : nous revenons vers vous avec une proposition sur
                mesure sous 24 heures.
              </p>
              <Link
                href="/contact"
                className="mt-8 inline-flex items-center gap-2 rounded-full bg-cream px-7 py-3.5 text-base font-semibold text-ink transition-all hover:-translate-y-0.5 hover:bg-white"
              >
                Demander un devis gratuit <ArrowRight size={17} />
              </Link>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function SectionHead({ eyebrow, title, subtitle, light = false }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <span
        className={`text-xs font-semibold uppercase tracking-[0.18em] ${
          light ? "text-teal-300" : "text-teal-600"
        }`}
      >
        {eyebrow}
      </span>
      <h2
        className={`mt-3 font-display text-3xl font-bold leading-tight tracking-tight sm:text-4xl ${
          light ? "text-cream" : "text-ink"
        }`}
      >
        {title}
      </h2>
      {subtitle && (
        <p className={`mx-auto mt-3 max-w-xl ${light ? "text-cream/60" : "text-ink-muted"}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}
