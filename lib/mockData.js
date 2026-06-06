// Données fictives réalistes pour la démonstration FormaPro.
// Tout est en mémoire / localStorage : aucun backend requis.

export const STATUSES = [
  { id: "nouveau", label: "Nouveau Prospect", color: "#5A636E", bg: "#EEEFF1" },
  { id: "a_contacter", label: "À contacter", color: "#B45309", bg: "#FEF3C7" },
  { id: "rdv", label: "RDV prévu", color: "#1D4ED8", bg: "#DBEAFE" },
  { id: "proposition", label: "Proposition envoyée", color: "#7C3AED", bg: "#EDE9FE" },
  { id: "attente", label: "En attente", color: "#0E7490", bg: "#CFFAFE" },
  { id: "gagne", label: "Gagné", color: "#0A8568", bg: "#CFF6E8" },
  { id: "perdu", label: "Perdu", color: "#B91C1C", bg: "#FEE2E2" },
];

export const statusById = (id) => STATUSES.find((s) => s.id === id) || STATUSES[0];

export const SECTEURS = [
  "BTP & Construction",
  "Industrie",
  "Santé & Médico-social",
  "Commerce & Distribution",
  "Transport & Logistique",
  "Services informatiques",
  "Hôtellerie & Restauration",
  "Banque & Assurance",
  "Collectivité publique",
  "Conseil & Audit",
];

export const FORMATIONS = [
  {
    id: "f1",
    titre: "Management & Leadership d'équipe",
    categorie: "Management",
    duree: "3 jours · 21h",
    modalite: "Présentiel / Distanciel",
    prix: "1 850 €",
    certifiante: true,
    couleur: "#0FA980",
    resume:
      "Développez une posture de leader, animez vos réunions et gérez les situations difficiles.",
  },
  {
    id: "f2",
    titre: "Bureautique avancée — Excel expert",
    categorie: "Bureautique",
    duree: "2 jours · 14h",
    modalite: "Présentiel",
    prix: "990 €",
    certifiante: true,
    couleur: "#1D4ED8",
    resume:
      "TCD, Power Query, macros et tableaux de bord automatisés pour gagner en productivité.",
  },
  {
    id: "f3",
    titre: "Cybersécurité pour les TPE/PME",
    categorie: "Numérique",
    duree: "2 jours · 14h",
    modalite: "Distanciel",
    prix: "1 290 €",
    certifiante: false,
    couleur: "#7C3AED",
    resume:
      "Sécurisez vos données, vos accès et sensibilisez vos collaborateurs aux cybermenaces.",
  },
  {
    id: "f4",
    titre: "Marketing digital & réseaux sociaux",
    categorie: "Marketing",
    duree: "3 jours · 21h",
    modalite: "Présentiel / Distanciel",
    prix: "1 590 €",
    certifiante: true,
    couleur: "#E89B1E",
    resume:
      "Stratégie de contenu, publicité ciblée et analyse de performance sur tous les canaux.",
  },
  {
    id: "f5",
    titre: "Gestion de projet — Méthodes Agiles",
    categorie: "Projet",
    duree: "3 jours · 21h",
    modalite: "Présentiel",
    prix: "1 750 €",
    certifiante: true,
    couleur: "#0E7490",
    resume:
      "Scrum, Kanban et outils collaboratifs pour piloter vos projets avec agilité.",
  },
  {
    id: "f6",
    titre: "Sauveteur Secouriste du Travail (SST)",
    categorie: "Sécurité",
    duree: "2 jours · 14h",
    modalite: "Présentiel",
    prix: "320 €",
    certifiante: true,
    couleur: "#B91C1C",
    resume:
      "Formation obligatoire pour intervenir efficacement en cas d'accident sur le lieu de travail.",
  },
];

export const MODELES_DOCUMENTS = [
  { id: "m1", nom: "Programme de formation", icon: "FileText", desc: "Objectifs, contenu, prérequis et modalités d'évaluation.", duree: "~3s" },
  { id: "m2", nom: "Convention de formation", icon: "FileSignature", desc: "Contrat entre l'organisme et l'entreprise cliente.", duree: "~4s" },
  { id: "m3", nom: "Convocation stagiaire", icon: "CalendarCheck", desc: "Dates, lieu, horaires et consignes envoyés aux participants.", duree: "~2s" },
  { id: "m4", nom: "Questionnaire de positionnement", icon: "ListChecks", desc: "Évaluation du niveau initial avant l'entrée en formation.", duree: "~2s" },
  { id: "m5", nom: "Règlement intérieur", icon: "ScrollText", desc: "Règles de fonctionnement et d'hygiène de l'organisme.", duree: "~2s" },
  { id: "m6", nom: "Livret d'accueil", icon: "BookOpen", desc: "Présentation, accessibilité et informations pratiques.", duree: "~3s" },
];

// Chargés d'affaires (commerciaux)
export const RESPONSABLES = ["Sophie Fournier", "Thomas Martin", "Julie Robert"];

// Types de documents gérés dans la bibliothèque de modèles
export const DOC_TYPES = ["Convention", "Programme", "Convocation", "Questionnaire", "Attestation", "Facture"];

// Icônes lucide associées à chaque type de document
export const DOC_TYPE_ICON = {
  Convention: "FileSignature",
  Programme: "BookOpen",
  Convocation: "CalendarCheck",
  Questionnaire: "ListChecks",
  Attestation: "Award",
  Facture: "Receipt",
};

// Bibliothèque de modèles de documents (CRUD côté admin)
export const SEED_TEMPLATES = [
  { id: "tpl1", nom: "Convention de formation", type: "Convention", format: "DOCX", fichier: "convention_formation.docx" },
  { id: "tpl2", nom: "Programme pédagogique", type: "Programme", format: "PDF", fichier: "programme_pedagogique.pdf" },
  { id: "tpl3", nom: "Convocation stagiaire", type: "Convocation", format: "PDF", fichier: "convocation_stagiaire.pdf" },
  { id: "tpl4", nom: "Questionnaire de positionnement", type: "Questionnaire", format: "DOCX", fichier: "questionnaire_positionnement.docx" },
  { id: "tpl5", nom: "Attestation de fin de formation", type: "Attestation", format: "PDF", fichier: "attestation_fin.pdf" },
  { id: "tpl6", nom: "Facture", type: "Facture", format: "PDF", fichier: "facture.pdf" },
];

const daysAgo = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return d.toISOString();
};

export const SEED_PROSPECTS = [
  {
    id: "p1", prenom: "Camille", nom: "Lefèvre", entreprise: "Atlas Logistique",
    telephone: "06 12 44 88 21", email: "c.lefevre@atlas-log.fr",
    adresse: "14 rue des Docks, 76600 Le Havre", siret: "812 456 789 00021",
    salaries: "120", secteur: "Transport & Logistique", status: "gagne",
    createdAt: daysAgo(2), lastActivity: daysAgo(1), formation: "f5",
    notes: [
      { id: "n1", date: daysAgo(2), texte: "Demande via formulaire site. Besoin formation Agile pour 8 chefs de projet." },
      { id: "n2", date: daysAgo(1), texte: "Convention signée. Démarrage prévu le mois prochain." },
    ],
    historique: [
      { id: "h1", date: daysAgo(2), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
      { id: "h2", date: daysAgo(2), type: "appel", texte: "Premier appel — qualification du besoin" },
      { id: "h3", date: daysAgo(1), type: "statut", texte: "Statut passé à « Gagné »" },
    ],
  },
  {
    id: "p2", prenom: "Yanis", nom: "Moreau", entreprise: "Nexa Industries",
    telephone: "07 88 21 09 55", email: "y.moreau@nexa-ind.com",
    adresse: "3 av. de l'Industrie, 69007 Lyon", siret: "509 887 221 00013",
    salaries: "340", secteur: "Industrie", status: "proposition",
    createdAt: daysAgo(5), lastActivity: daysAgo(3), formation: "f1",
    notes: [
      { id: "n1", date: daysAgo(4), texte: "Intéressé par un parcours management sur mesure." },
    ],
    historique: [
      { id: "h1", date: daysAgo(5), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
      { id: "h2", date: daysAgo(4), type: "email", texte: "Envoi du programme détaillé" },
      { id: "h3", date: daysAgo(3), type: "statut", texte: "Proposition commerciale envoyée" },
    ],
  },
  {
    id: "p3", prenom: "Sophie", nom: "Nguyen", entreprise: "Clinique du Parc",
    telephone: "06 45 12 78 03", email: "s.nguyen@clinique-parc.fr",
    adresse: "27 bd Pasteur, 31000 Toulouse", siret: "421 008 776 00045",
    salaries: "210", secteur: "Santé & Médico-social", status: "rdv",
    createdAt: daysAgo(4), lastActivity: daysAgo(2), formation: "f6",
    notes: [
      { id: "n1", date: daysAgo(3), texte: "Recyclage SST pour 15 personnes. RDV planifié." },
    ],
    historique: [
      { id: "h1", date: daysAgo(4), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
      { id: "h2", date: daysAgo(2), type: "rdv", texte: "RDV de cadrage fixé" },
    ],
  },
  {
    id: "p4", prenom: "Thomas", nom: "Garnier", entreprise: "BatiSud SARL",
    telephone: "06 77 90 14 62", email: "t.garnier@batisud.fr",
    adresse: "9 chemin des Carrières, 13010 Marseille", siret: "778 220 113 00019",
    salaries: "45", secteur: "BTP & Construction", status: "a_contacter",
    createdAt: daysAgo(9), lastActivity: daysAgo(9), formation: "f6",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(9), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
    ],
  },
  {
    id: "p5", prenom: "Inès", nom: "Bernard", entreprise: "Horizon Conseil",
    telephone: "07 12 56 89 47", email: "i.bernard@horizon-conseil.fr",
    adresse: "120 rue La Fayette, 75010 Paris", siret: "904 556 332 00027",
    salaries: "18", secteur: "Conseil & Audit", status: "nouveau",
    createdAt: daysAgo(0), lastActivity: daysAgo(0), formation: "f4",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(0), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
    ],
  },
  {
    id: "p6", prenom: "Karim", nom: "Benali", entreprise: "DataForge",
    telephone: "06 33 21 78 90", email: "k.benali@dataforge.io",
    adresse: "5 rue du Numérique, 33000 Bordeaux", siret: "843 991 002 00011",
    salaries: "62", secteur: "Services informatiques", status: "attente",
    createdAt: daysAgo(11), lastActivity: daysAgo(8), formation: "f3",
    notes: [
      { id: "n1", date: daysAgo(8), texte: "Attente validation budget par la direction." },
    ],
    historique: [
      { id: "h1", date: daysAgo(11), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(8), type: "email", texte: "Relance — devis cybersécurité" },
    ],
  },
  {
    id: "p7", prenom: "Laura", nom: "Petit", entreprise: "Saveurs & Co",
    telephone: "07 45 67 12 33", email: "l.petit@saveurs-co.fr",
    adresse: "44 quai des Chartrons, 33300 Bordeaux", siret: "611 220 887 00033",
    salaries: "28", secteur: "Hôtellerie & Restauration", status: "gagne",
    createdAt: daysAgo(15), lastActivity: daysAgo(6), formation: "f2",
    notes: [
      { id: "n1", date: daysAgo(6), texte: "Client fidèle — 2e commande de l'année." },
    ],
    historique: [
      { id: "h1", date: daysAgo(15), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(6), type: "statut", texte: "Statut passé à « Gagné »" },
    ],
  },
  {
    id: "p8", prenom: "Hugo", nom: "Rousseau", entreprise: "Crédit Régional",
    telephone: "06 09 88 77 21", email: "h.rousseau@credit-regional.fr",
    adresse: "1 place de la Bourse, 44000 Nantes", siret: "552 100 998 00056",
    salaries: "890", secteur: "Banque & Assurance", status: "rdv",
    createdAt: daysAgo(3), lastActivity: daysAgo(1), formation: "f1",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(3), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
      { id: "h2", date: daysAgo(1), type: "rdv", texte: "Visio de présentation planifiée" },
    ],
  },
  {
    id: "p9", prenom: "Émilie", nom: "Faure", entreprise: "Mairie de Valombre",
    telephone: "07 21 45 09 88", email: "e.faure@valombre.fr",
    adresse: "Hôtel de Ville, 38000 Grenoble", siret: "213 800 451 00018",
    salaries: "150", secteur: "Collectivité publique", status: "proposition",
    createdAt: daysAgo(7), lastActivity: daysAgo(4), formation: "f2",
    notes: [
      { id: "n1", date: daysAgo(4), texte: "Marché public — réponse à l'appel d'offres en cours." },
    ],
    historique: [
      { id: "h1", date: daysAgo(7), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(4), type: "email", texte: "Dépôt de la proposition" },
    ],
  },
  {
    id: "p10", prenom: "Nicolas", nom: "Dubois", entreprise: "TechWave",
    telephone: "06 55 44 33 22", email: "n.dubois@techwave.fr",
    adresse: "88 rue de la Tech, 59000 Lille", siret: "799 552 110 00024",
    salaries: "75", secteur: "Services informatiques", status: "perdu",
    createdAt: daysAgo(22), lastActivity: daysAgo(14), formation: "f3",
    notes: [
      { id: "n1", date: daysAgo(14), texte: "A choisi un concurrent. À recontacter dans 6 mois." },
    ],
    historique: [
      { id: "h1", date: daysAgo(22), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(14), type: "statut", texte: "Statut passé à « Perdu »" },
    ],
  },
  {
    id: "p11", prenom: "Marine", nom: "Lambert", entreprise: "GreenField Agro",
    telephone: "07 33 21 09 77", email: "m.lambert@greenfield.fr",
    adresse: "Route de la Plaine, 49000 Angers", siret: "660 442 991 00040",
    salaries: "55", secteur: "Industrie", status: "a_contacter",
    createdAt: daysAgo(1), lastActivity: daysAgo(1), formation: "f5",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(1), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
    ],
  },
  {
    id: "p12", prenom: "Antoine", nom: "Girard", entreprise: "Optima Retail",
    telephone: "06 78 90 12 34", email: "a.girard@optima-retail.fr",
    adresse: "60 av. du Commerce, 67000 Strasbourg", siret: "733 880 221 00029",
    salaries: "430", secteur: "Commerce & Distribution", status: "nouveau",
    createdAt: daysAgo(0), lastActivity: daysAgo(0), formation: "f4",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(0), type: "creation", texte: "Fiche créée depuis le formulaire de contact" },
    ],
  },
  {
    id: "p13", prenom: "Sarah", nom: "Klein", entreprise: "MediCare Plus",
    telephone: "07 09 88 21 45", email: "s.klein@medicare-plus.fr",
    adresse: "12 rue de la Santé, 75013 Paris", siret: "488 221 009 00037",
    salaries: "260", secteur: "Santé & Médico-social", status: "attente",
    createdAt: daysAgo(13), lastActivity: daysAgo(10), formation: "f6",
    notes: [
      { id: "n1", date: daysAgo(10), texte: "Devis envoyé, en attente de retour." },
    ],
    historique: [
      { id: "h1", date: daysAgo(13), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(10), type: "email", texte: "Envoi du devis SST" },
    ],
  },
  {
    id: "p14", prenom: "Julien", nom: "Mercier", entreprise: "BuildR",
    telephone: "06 12 78 45 90", email: "j.mercier@buildr.fr",
    adresse: "200 rue du Bâtiment, 35000 Rennes", siret: "920 113 552 00015",
    salaries: "90", secteur: "BTP & Construction", status: "gagne",
    createdAt: daysAgo(18), lastActivity: daysAgo(5), formation: "f1",
    notes: [],
    historique: [
      { id: "h1", date: daysAgo(18), type: "creation", texte: "Fiche créée" },
      { id: "h2", date: daysAgo(5), type: "statut", texte: "Statut passé à « Gagné »" },
    ],
  },
];

// Attribution des chargés d'affaires aux prospects de démonstration
const RESP_MAP = { p1: 0, p2: 1, p3: 2, p4: 0, p6: 2, p7: 1, p8: 0, p9: 1, p10: 2, p11: 0, p13: 2, p14: 1 };
SEED_PROSPECTS.forEach((p) => {
  p.responsable = RESP_MAP[p.id] != null ? RESPONSABLES[RESP_MAP[p.id]] : null;
  if (p.responsable) {
    const created = p.historique[0] || {};
    p.historique.splice(1, 0, {
      id: `${p.id}-asg`,
      date: created.date || p.createdAt,
      type: "assignation",
      texte: `Prospect assigné à ${p.responsable}`,
    });
  }
});

// Documents générés (module Documents + base archivage)
export const SEED_DOCUMENTS = [
  { id: "d1", modele: "Convention de formation", type: "Convention", client: "Atlas Logistique", formation: "Gestion de projet — Méthodes Agiles", date: daysAgo(1), statut: "genere" },
  { id: "d2", modele: "Programme pédagogique", type: "Programme", client: "Atlas Logistique", formation: "Gestion de projet — Méthodes Agiles", date: daysAgo(1), statut: "genere" },
  { id: "d3", modele: "Convocation stagiaire", type: "Convocation", client: "Saveurs & Co", formation: "Bureautique avancée — Excel expert", date: daysAgo(6), statut: "genere" },
  { id: "d4", modele: "Attestation de fin de formation", type: "Attestation", client: "BuildR", formation: "Management & Leadership d'équipe", date: daysAgo(5), statut: "genere" },
  { id: "d5", modele: "Facture", type: "Facture", client: "BuildR", formation: "Management & Leadership d'équipe", date: daysAgo(5), statut: "genere" },
];

// Signatures électroniques (simulé — futur Yousign)
export const SEED_SIGNATURES = [
  { id: "s1", document: "Convention — Atlas Logistique", signataire: "Camille Lefèvre", email: "c.lefevre@atlas-log.fr", statut: "signe", envoye: daysAgo(2), signe: daysAgo(1) },
  { id: "s2", document: "Convention — BuildR", signataire: "Julien Mercier", email: "j.mercier@buildr.fr", statut: "signe", envoye: daysAgo(6), signe: daysAgo(5) },
  { id: "s3", document: "Convention — Nexa Industries", signataire: "Yanis Moreau", email: "y.moreau@nexa-ind.com", statut: "attente", envoye: daysAgo(3), signe: null },
  { id: "s4", document: "Convention — Mairie de Valombre", signataire: "Émilie Faure", email: "e.faure@valombre.fr", statut: "attente", envoye: daysAgo(4), signe: null },
  { id: "s5", document: "Convocation — Clinique du Parc", signataire: "Sophie Nguyen", email: "s.nguyen@clinique-parc.fr", statut: "envoye", envoye: daysAgo(1), signe: null },
];

// Témoignages site vitrine
export const TEMOIGNAGES = [
  { id: "t1", nom: "Camille Lefèvre", role: "DRH · Atlas Logistique", note: 5, texte: "Un accompagnement irréprochable du devis à la signature. La plateforme nous a fait gagner un temps précieux sur l'administratif Qualiopi." },
  { id: "t2", nom: "Hugo Rousseau", role: "Resp. Formation · Crédit Régional", note: 5, texte: "Des formateurs experts et des supports d'une grande qualité. Nos équipes sont montées en compétences très rapidement." },
  { id: "t3", nom: "Laura Petit", role: "Gérante · Saveurs & Co", note: 5, texte: "Réactivité exemplaire et formations parfaitement adaptées à notre secteur. Nous reviendrons sans hésiter." },
];

export const AVANTAGES = [
  { icon: "BadgeCheck", titre: "Certifié Qualiopi", desc: "Formations finançables par votre OPCO et conformes aux exigences qualité." },
  { icon: "Users", titre: "Formateurs experts", desc: "Des intervenants praticiens avec une expérience terrain reconnue." },
  { icon: "Laptop", titre: "100% flexible", desc: "Présentiel, distanciel ou hybride, selon vos contraintes d'organisation." },
  { icon: "LineChart", titre: "Résultats mesurables", desc: "Évaluations avant/après et suivi de la montée en compétences." },
];

// KPIs & séries pour le dashboard
export const KPI_SERIES = {
  prospectsParMois: [
    { mois: "Jan", value: 18 }, { mois: "Fév", value: 24 }, { mois: "Mar", value: 31 },
    { mois: "Avr", value: 27 }, { mois: "Mai", value: 38 }, { mois: "Juin", value: 44 },
  ],
  caParMois: [
    { mois: "Jan", value: 22 }, { mois: "Fév", value: 28 }, { mois: "Mar", value: 35 },
    { mois: "Avr", value: 31 }, { mois: "Mai", value: 42 }, { mois: "Juin", value: 51 },
  ],
};
