export function Logo({ className = "w-10 h-10" }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#06b6d4" />
          <stop offset="50%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#06b6d4" />
        </linearGradient>
        <linearGradient id="hookGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ef4444" />
          <stop offset="100%" stopColor="#f97316" />
        </linearGradient>
      </defs>

      {/* Shield Background */}
      <path
        d="M50 10 L80 25 L80 45 C80 65 70 80 50 90 C30 80 20 65 20 45 L20 25 Z"
        fill="url(#logoGradient)"
        opacity="0.9"
      />

      {/* Shield Border */}
      <path
        d="M50 10 L80 25 L80 45 C80 65 70 80 50 90 C30 80 20 65 20 45 L20 25 Z"
        stroke="#06b6d4"
        strokeWidth="2"
        fill="none"
        opacity="0.5"
      />

      {/* Eye/Scan Circle */}
      <circle cx="50" cy="45" r="15" fill="#0a0a0a" opacity="0.7" />
      <circle cx="50" cy="45" r="12" fill="#06b6d4" opacity="0.3" />
      <circle cx="50" cy="45" r="8" fill="#06b6d4" opacity="0.6" />
      <circle cx="50" cy="45" r="4" fill="#fff" />

      {/* Hook Line */}
      <path
        d="M50 60 L50 70"
        stroke="url(#hookGradient)"
        strokeWidth="3"
        strokeLinecap="round"
      />

      {/* Fishing Hook */}
      <path
        d="M50 70 C50 75 55 78 58 75 C61 72 60 68 57 68 C54 68 50 70 50 73"
        stroke="url(#hookGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* Scan Lines */}
      <line x1="35" y1="35" x2="45" y2="40" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="35" y1="45" x2="45" y2="45" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="35" y1="55" x2="45" y2="50" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />

      <line x1="65" y1="35" x2="55" y2="40" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="65" y1="45" x2="55" y2="45" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
      <line x1="65" y1="55" x2="55" y2="50" stroke="#06b6d4" strokeWidth="1.5" opacity="0.6" strokeLinecap="round" />
    </svg>
  );
}
