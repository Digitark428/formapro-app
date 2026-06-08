export function cn(...classes) {
  return classes.filter(Boolean).join(" ");
}

export function formatDate(iso, opts = {}) {
  if (!iso) return "—";
  const { year, ...rest } = opts;
  const d = new Date(iso);
  return d.toLocaleDateString("fr-FR", {
    day: "2-digit",
    month: "short",
    ...(year ? { year: "numeric" } : {}),
    ...rest,
  });
}

export function formatDateTime(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleString("fr-FR", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

export function daysSince(iso) {
  if (!iso) return Infinity;
  const diff = Date.now() - new Date(iso).getTime();
  return Math.floor(diff / (1000 * 60 * 60 * 24));
}

export function relativeTime(iso) {
  const d = daysSince(iso);
  if (d <= 0) return "Aujourd'hui";
  if (d === 1) return "Hier";
  if (d < 7) return `Il y a ${d} jours`;
  if (d < 14) return "Il y a 1 semaine";
  if (d < 31) return `Il y a ${Math.floor(d / 7)} semaines`;
  return `Il y a ${Math.floor(d / 30)} mois`;
}

export function uid(prefix = "id") {
  return `${prefix}_${Math.random().toString(36).slice(2, 9)}`;
}

export function initials(prenom = "", nom = "") {
  return `${(prenom[0] || "").toUpperCase()}${(nom[0] || "").toUpperCase()}`;
}

// Avatar color derived deterministically from a string
const AVATAR_COLORS = [
  "#0FA980", "#1D4ED8", "#7C3AED", "#E89B1E", "#0E7490", "#B91C1C", "#0A8568",
];
export function avatarColor(seed = "") {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return AVATAR_COLORS[h % AVATAR_COLORS.length];
}
