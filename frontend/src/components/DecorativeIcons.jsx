export function IconEye({ className = "" }) {
  return (
    <svg viewBox="0 0 180 120" className={`hand-icon ${className}`} aria-hidden="true">
      <ellipse cx="90" cy="80" rx="42" ry="24" className="hand-icon__stroke" />
      <circle cx="90" cy="80" r="11" className="hand-icon__fill" />
      <line x1="70" y1="42" x2="66" y2="30" className="hand-icon__stroke" />
      <line x1="84" y1="36" x2="82" y2="24" className="hand-icon__stroke" />
      <line x1="100" y1="36" x2="102" y2="24" className="hand-icon__stroke" />
      <line x1="114" y1="42" x2="120" y2="32" className="hand-icon__stroke" />
    </svg>
  );
}

export function IconStar({ className = "" }) {
  return (
    <svg viewBox="0 0 120 120" className={`hand-icon ${className}`} aria-hidden="true">
      <path d="M60 10 68 45 94 20 76 52 112 48 78 62 108 82 72 70 78 108 60 75 42 108 48 70 12 82 42 62 8 48 44 52 26 20 52 45Z" className="hand-icon__fill" />
    </svg>
  );
}

export function IconArrow({ className = "" }) {
  return (
    <svg viewBox="0 0 130 150" className={`hand-icon ${className}`} aria-hidden="true">
      <path d="M35 18c52 9 67 42 47 91" className="hand-icon__stroke" />
      <path d="m58 91 23 22 27-18" className="hand-icon__stroke" />
    </svg>
  );
}
