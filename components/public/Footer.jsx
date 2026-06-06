import Link from "next/link";
import Logo from "@/components/ui/Logo";

export default function Footer() {
  return (
    <footer className="relative overflow-hidden bg-ink text-cream">
      <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-teal-500/20 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-5 py-16">
        <div className="grid gap-10 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <Logo light />
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-cream/60">
              L'organisme de formation qui digitalise l'ensemble de votre parcours, du premier
              contact à l'archivage Qualiopi.
            </p>
          </div>
          <FooterCol
            title="Formations"
            items={["Management", "Bureautique", "Numérique", "Sécurité"]}
          />
          <FooterCol
            title="Organisme"
            items={["À propos", "Qualiopi", "Financement", "Nous contacter"]}
          />
          <FooterCol
            title="Plateforme"
            items={["Espace admin", "CRM", "Documents", "Signature"]}
          />
        </div>
        <div className="mt-12 flex flex-col items-start justify-between gap-4 border-t border-cream/10 pt-6 text-xs text-cream/50 md:flex-row md:items-center">
          <p>© {new Date().getFullYear()} FormaPro — Démonstration. Données fictives.</p>
          <p className="flex items-center gap-4">
            <span>Mentions légales</span>
            <span>Confidentialité</span>
            <span>CGV</span>
          </p>
        </div>
      </div>
    </footer>
  );
}

function FooterCol({ title, items }) {
  return (
    <div>
      <h4 className="text-sm font-semibold text-cream">{title}</h4>
      <ul className="mt-3 space-y-2 text-sm text-cream/55">
        {items.map((i) => (
          <li key={i} className="cursor-pointer transition-colors hover:text-teal-300">
            {i}
          </li>
        ))}
      </ul>
    </div>
  );
}
