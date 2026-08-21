/** Abstract study-atmosphere graphic for the hero. */
export function HeroArt() {
  return (
    <div className="hero-visual" aria-hidden>
      <svg viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="ring" x1="0" y1="0" x2="1" y2="1">
            <stop stopColor="#5EE4A8" stopOpacity="0.9" />
            <stop offset="1" stopColor="#F2C14E" stopOpacity="0.55" />
          </linearGradient>
          <radialGradient id="orb" cx="50%" cy="45%" r="50%">
            <stop stopColor="#5EE4A8" stopOpacity="0.35" />
            <stop offset="1" stopColor="#0C2F2A" stopOpacity="0" />
          </radialGradient>
        </defs>
        <circle cx="200" cy="200" r="150" fill="url(#orb)" />
        <circle cx="200" cy="200" r="118" stroke="url(#ring)" strokeWidth="2" strokeDasharray="6 10" />
        <circle cx="200" cy="200" r="78" stroke="#E8DCC8" strokeOpacity="0.25" strokeWidth="1.5" />
        <path
          d="M128 220 L168 160 L208 210 L248 130 L288 190"
          stroke="#5EE4A8"
          strokeWidth="3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <circle cx="168" cy="160" r="5" fill="#F2C14E" />
        <circle cx="248" cy="130" r="5" fill="#5EE4A8" />
        <rect x="150" y="250" width="100" height="14" rx="4" fill="#E8DCC8" fillOpacity="0.15" />
        <rect x="170" y="274" width="60" height="10" rx="3" fill="#5EE4A8" fillOpacity="0.35" />
      </svg>
    </div>
  )
}
