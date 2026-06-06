# FormaPro — Démo SaaS pour organisme de formation

Démo web **fonctionnelle et réaliste** d'une plateforme SaaS de gestion pour organisme de formation : site vitrine public + espace administrateur complet (CRM, relances, génération de documents, signature électronique, archivage).

> Projet de démonstration. La logique métier est simulée (données fictives, persistance locale). Conçu pour présenter le concept à un client.

---

## Stack technique

- **Next.js 14** (App Router)
- **React 18**
- **Tailwind CSS 3**
- **lucide-react** (icônes)
- Graphiques **SVG faits main** (aucune dépendance lourde)
- Persistance via **localStorage** (côté navigateur)

Design premium inspiré de Stripe / Notion / HubSpot — responsive mobile & desktop.

---

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrez **http://localhost:3000**

### Identifiants de la démo

| Champ        | Valeur              |
| ------------ | ------------------- |
| **Email**    | `demo@formapro.fr`  |
| **Mot de passe** | `demo`          |

Les champs sont déjà pré-remplis sur la page de connexion.

---

## Parcours conseillé

1. **Accueil** (`/`) — hero, formations, avantages, témoignages, CTA.
2. **Contact** (`/contact`) — remplissez le formulaire prospect : une fiche est **créée automatiquement** dans le CRM avec le statut *Nouveau Prospect*.
3. **Espace admin** (`/admin/login`) — connectez-vous avec les identifiants ci-dessus.
   - **Dashboard** — KPIs, graphiques (acquisition, CA), pipeline, activité récente, alertes.
   - **CRM** — vue **Kanban** (glisser-déposer pour changer le statut) ou liste. Chaque prospect peut être **pris en charge** par un chargé d'affaires (Sophie Fournier, Thomas Martin, Julie Robert) ; le responsable s'affiche sur la carte et dans la fiche. La fiche propose des **actions commerciales** (Appel, Email, Rendez-vous) qui alimentent automatiquement un **historique des interactions** visuel. Le changement de statut reste manuel.
   - **Relances** — tableau priorisé : Prospect, Responsable, Dernier contact, Prochaine relance (J+7), Niveau d'urgence (Faible / Moyenne / Élevée). Le bouton « Relancer » enregistre la relance et l'ajoute à l'historique du prospect.
   - **Documents** — bibliothèque de **modèles** (ajout / modification / suppression, upload simulé PDF/DOCX, types Convention, Programme, Convocation, Questionnaire, Attestation, Facture) et **génération** d'un document à partir d'un prospect + un modèle.
   - **Signature** — suivi des documents envoyés / en attente / signés, envoi pour signature, note d'intégration **Yousign** à venir.
   - **Archivage** — gestion documentaire arborescente **Client → Formation → Documents**.

---

## Données & réinitialisation

- Toutes les données (prospects, documents, signatures) sont **persistées dans le localStorage** du navigateur.
- Le bouton **« Réinitialiser la démo »** (barre supérieure de l'admin) restaure les données fictives d'origine.
- Les modifications restent locales à votre navigateur — rien n'est envoyé à un serveur.

---

## Structure du projet

```
app/
  page.jsx                  # Accueil (site vitrine)
  contact/page.jsx          # Formulaire prospect
  admin/
    layout.jsx              # Garde d'authentification + shell admin
    login/page.jsx          # Connexion
    dashboard/page.jsx      # Tableau de bord
    crm/page.jsx            # CRM Kanban / liste
    relances/page.jsx       # Relances & notifications
    documents/page.jsx      # Génération de documents
    signature/page.jsx      # Signature électronique
    archivage/page.jsx      # Archivage documentaire
components/
  public/                   # Navbar, Footer
  admin/                    # Sidebar, Topbar, StatCard, ProspectDrawer
  ui/                       # Logo, Badge, Charts
lib/
  mockData.js               # Données fictives (prospects, formations, docs…)
  store.jsx                 # State global (Context) + persistance localStorage
  utils.js                  # Helpers (dates, initiales, couleurs…)
```

---

## Pistes d'évolution (production)

- Authentification réelle (NextAuth / Auth.js) + base de données (PostgreSQL, Prisma).
- API back-end pour le CRM et la génération de PDF réels.
- Intégration **Yousign** pour la signature électronique qualifiée (eIDAS).
- Multi-tenant, gestion des rôles, conformité **Qualiopi**.
