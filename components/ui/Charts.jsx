"use client";

// Lightweight, dependency-free SVG charts tuned for the FormaPro palette.

export function BarChart({ data, height = 180, color = "#0FA980" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const barW = 100 / data.length;
  return (
    <svg viewBox={`0 0 100 ${height / 2}`} className="w-full" preserveAspectRatio="none" style={{ height }}>
      {data.map((d, i) => {
        const h = (d.value / max) * (height / 2 - 14);
        const x = i * barW + barW * 0.2;
        const w = barW * 0.6;
        const y = height / 2 - h - 8;
        return (
          <g key={i}>
            <rect x={x} y={y} width={w} height={h} rx="1.5" fill={color} opacity={0.18 + (i / data.length) * 0.82}>
              <animate attributeName="height" from="0" to={h} dur="0.7s" fill="freeze" />
              <animate attributeName="y" from={height / 2 - 8} to={y} dur="0.7s" fill="freeze" />
            </rect>
          </g>
        );
      })}
    </svg>
  );
}

export function AreaChart({ data, height = 200, color = "#0FA980" }) {
  const max = Math.max(...data.map((d) => d.value), 1);
  const min = Math.min(...data.map((d) => d.value), 0);
  const range = max - min || 1;
  const W = 300;
  const H = 120;
  const pad = 6;
  const pts = data.map((d, i) => {
    const x = pad + (i / (data.length - 1)) * (W - pad * 2);
    const y = H - pad - ((d.value - min) / range) * (H - pad * 2);
    return [x, y];
  });
  const line = pts.map((p, i) => `${i === 0 ? "M" : "L"}${p[0]},${p[1]}`).join(" ");
  const area = `${line} L${pts[pts.length - 1][0]},${H} L${pts[0][0]},${H} Z`;

  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="w-full" style={{ height }}>
      <defs>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.28" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#areaFill)" />
      <path
        d={line}
        fill="none"
        stroke={color}
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        style={{ strokeDasharray: 1000, strokeDashoffset: 1000, animation: "dash 1.4s ease forwards" }}
      />
      {pts.map((p, i) => (
        <circle key={i} cx={p[0]} cy={p[1]} r="3" fill="#fff" stroke={color} strokeWidth="2" />
      ))}
      <style>{`@keyframes dash{to{stroke-dashoffset:0}}`}</style>
    </svg>
  );
}

export function Donut({ segments, size = 160, thickness = 22 }) {
  const total = segments.reduce((s, x) => s + x.value, 0) || 1;
  const r = (size - thickness) / 2;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
        {segments.map((seg, i) => {
          const frac = seg.value / total;
          const dash = frac * c;
          const el = (
            <circle
              key={i}
              cx={size / 2}
              cy={size / 2}
              r={r}
              fill="none"
              stroke={seg.color}
              strokeWidth={thickness}
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              strokeLinecap="butt"
            />
          );
          offset += dash;
          return el;
        })}
      </g>
    </svg>
  );
}
