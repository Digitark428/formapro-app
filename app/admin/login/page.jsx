"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowRight, Lock, Mail, Eye, EyeOff, ShieldCheck, Sparkles } from "lucide-react";
import Logo from "@/components/ui/Logo";
import { useStore } from "@/lib/store";

export default function LoginPage() {
  const router = useRouter();
  const { login, authed, hydrated } = useStore();
  const [email, setEmail] = useState("demo@formapro.fr");
  const [password, setPassword] = useState("demo");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (hydrated && authed) router.replace("/admin/dashboard");
  }, [hydrated, authed, router]);

  const submit = (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    setTimeout(() => {
      if (login(email, password)) {
        router.push("/admin/dashboard");
      } else {
        setError("Identifiants incorrects. Utilisez les identifiants de démonstration.");
        setLoading(false);
      }
    }, 650);
  };

  return (
    <main className="grid min-h-screen lg:grid-cols-2">
      {/* Left — brand panel */}
      <div className="relative hidden overflow-hidden bg-ink p-12 text-cream lg:flex lg:flex-col lg:justify-between">
        <div className="absolute inset-0 bg-dotgrid opacity-[0.18]" />
        <div className="pointer-events-none absolute -right-24 top-1/3 h-96 w-96 rounded-full bg-teal-500/25 blur-3xl" />
        <Link href="/" className="relative"><Logo light /></Link>
        <div className="relative max-w-md">
          <span className="inline-flex items-center gap-2 rounded-full border border-cream/15 bg-cream/5 px-3 py-1 text-xs font-semibold text-teal-300">
            <Sparkles size={13} /> Espace administrateur
          </span>
          <h2 className="mt-6 font-display text-4xl font-bold leading-tight">
            Pilotez votre organisme de formation, de A à Z.
          </h2>
          <p className="mt-4 text-cream/60">
            CRM, relances automatiques, génération de documents, signature électronique et
            archivage Qualiopi — réunis dans un seul tableau de bord.
          </p>
          <div className="mt-10 grid grid-cols-3 gap-4 border-t border-cream/10 pt-6">
            {[["6", "modules"], ["100%", "responsive"], ["Qualiopi", "conforme"]].map(([n, l]) => (
              <div key={l}>
                <div className="font-display text-2xl font-bold">{n}</div>
                <div className="text-xs text-cream/50">{l}</div>
              </div>
            ))}
          </div>
        </div>
        <p className="relative text-xs text-cream/40">© {new Date().getFullYear()} FormaPro — Démonstration</p>
      </div>

      {/* Right — form */}
      <div className="relative flex items-center justify-center bg-cream p-6">
        <div className="absolute inset-0 bg-dotgrid opacity-40 lg:hidden" />
        <div className="relative w-full max-w-sm">
          <div className="lg:hidden"><Link href="/"><Logo /></Link></div>
          <h1 className="mt-8 font-display text-2xl font-bold text-ink lg:mt-0">Connexion</h1>
          <p className="mt-1 text-sm text-ink-muted">Accédez à votre tableau de bord FormaPro.</p>

          <div className="mt-5 flex items-start gap-2.5 rounded-xl border border-teal-200 bg-teal-50 p-3 text-sm">
            <ShieldCheck size={16} className="mt-0.5 shrink-0 text-teal-600" />
            <div className="text-teal-800">
              <span className="font-semibold">Démo</span> — identifiants pré-remplis :{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">demo@formapro.fr</code> /{" "}
              <code className="rounded bg-white px-1 py-0.5 text-xs">demo</code>
            </div>
          </div>

          <form onSubmit={submit} className="mt-6 space-y-4">
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Email</span>
              <span className="relative block">
                <Mail size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl border border-ink/12 bg-white py-2.5 pl-9 pr-3 text-sm text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
                />
              </span>
            </label>
            <label className="block">
              <span className="mb-1.5 block text-sm font-medium text-ink/80">Mot de passe</span>
              <span className="relative block">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-ink/35" />
                <input
                  type={show ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl border border-ink/12 bg-white py-2.5 pl-9 pr-10 text-sm text-ink focus:border-teal-500 focus:outline-none focus:ring-2 focus:ring-teal-500/15"
                />
                <button
                  type="button"
                  onClick={() => setShow((v) => !v)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-ink/40 hover:text-ink"
                >
                  {show ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </span>
            </label>

            {error && (
              <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</p>
            )}

            <button type="submit" disabled={loading} className="btn-primary w-full py-3 disabled:opacity-70">
              {loading ? "Connexion…" : <>Se connecter <ArrowRight size={16} /></>}
            </button>
          </form>

          <Link href="/" className="mt-6 block text-center text-sm text-ink-muted hover:text-ink">
            ← Retour au site
          </Link>
        </div>
      </div>
    </main>
  );
}
