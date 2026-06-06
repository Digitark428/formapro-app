export default function Logo({ className = "", mark = false, light = false }) {
  return (
    <span className={`inline-flex items-center gap-2.5 ${className}`}>
      <span
        className="relative grid h-8 w-8 place-items-center rounded-xl bg-ink text-cream"
        aria-hidden
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 6.5C4 5.67 4.67 5 5.5 5H18.5C19.33 5 20 5.67 20 6.5C20 7.33 19.33 8 18.5 8H5.5C4.67 8 4 7.33 4 6.5Z"
            fill="#22C49A"
          />
          <path
            d="M4 12C4 11.17 4.67 10.5 5.5 10.5H14.5C15.33 10.5 16 11.17 16 12C16 12.83 15.33 13.5 14.5 13.5H5.5C4.67 13.5 4 12.83 4 12Z"
            fill="currentColor"
          />
          <path
            d="M4 17.5C4 16.67 4.67 16 5.5 16H11.5C12.33 16 13 16.67 13 17.5C13 18.33 12.33 19 11.5 19H5.5C4.67 19 4 18.33 4 17.5Z"
            fill="currentColor"
            opacity="0.55"
          />
        </svg>
      </span>
      {!mark && (
        <span
          className={`font-display text-[1.15rem] font-bold tracking-tight ${
            light ? "text-cream" : "text-ink"
          }`}
        >
          Forma<span className="text-teal-500">Pro</span>
        </span>
      )}
    </span>
  );
}
