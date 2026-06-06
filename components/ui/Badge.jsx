import { statusById } from "@/lib/mockData";
import { avatarColor, initials } from "@/lib/utils";

export function StatusBadge({ statusId }) {
  const s = statusById(statusId);
  return (
    <span
      className="chip"
      style={{ backgroundColor: s.bg, color: s.color }}
    >
      <span
        className="h-1.5 w-1.5 rounded-full"
        style={{ backgroundColor: s.color }}
      />
      {s.label}
    </span>
  );
}

export function Avatar({ prenom, nom, size = 36 }) {
  const bg = avatarColor((prenom || "") + (nom || ""));
  return (
    <span
      className="grid shrink-0 place-items-center rounded-full font-semibold text-white"
      style={{
        width: size,
        height: size,
        backgroundColor: bg,
        fontSize: size * 0.38,
      }}
    >
      {initials(prenom, nom)}
    </span>
  );
}
