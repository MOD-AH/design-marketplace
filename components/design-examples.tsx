import Link from "next/link"
import { ShoppingBag, ArrowUpRight } from "lucide-react"

// ── SVG Design Previews ───────────────────────────────────────────────────────

function LogoKitSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#111018" />
      <rect width="480" height="360" fill="url(#lgGrad)" />
      <defs>
        <radialGradient id="lgGrad" cx="50%" cy="40%" r="60%">
          <stop offset="0%" stopColor="#2A1F0F" />
          <stop offset="100%" stopColor="#0D0B0E" />
        </radialGradient>
      </defs>
      {/* Outer ring */}
      <circle cx="240" cy="155" r="72" fill="none" stroke="#C8873A" strokeWidth="1" />
      <circle cx="240" cy="155" r="60" fill="none" stroke="#C8873A" strokeWidth="0.4" opacity="0.5" />
      {/* Inner diamond */}
      <polygon points="240,100 280,155 240,210 200,155" fill="none" stroke="#C8873A" strokeWidth="1.2" />
      <polygon points="240,118 262,155 240,192 218,155" fill="#C8873A" fillOpacity="0.12" />
      {/* Center mark */}
      <circle cx="240" cy="155" r="8" fill="#C8873A" />
      {/* Brand name */}
      <text x="240" y="250" textAnchor="middle" fill="white" fontSize="22" fontFamily="Georgia, serif" letterSpacing="14" fontWeight="400">AURUM</text>
      <text x="240" y="270" textAnchor="middle" fill="#C8873A" fontSize="8" fontFamily="Arial, sans-serif" letterSpacing="8" opacity="0.7">CREATIVE STUDIO</text>
      {/* Divider */}
      <line x1="160" y1="240" x2="320" y2="240" stroke="#C8873A" strokeWidth="0.5" opacity="0.3" />
      {/* Swatches */}
      <rect x="170" y="300" width="26" height="26" rx="6" fill="#111018" />
      <rect x="202" y="300" width="26" height="26" rx="6" fill="#C8873A" />
      <rect x="234" y="300" width="26" height="26" rx="6" fill="#E8C89A" />
      <rect x="266" y="300" width="26" height="26" rx="6" fill="#F5EDD8" />
      <rect x="298" y="300" width="26" height="26" rx="6" fill="#6E5E4A" />
    </svg>
  )
}

function UIKitSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#F8F5EF" />
      {/* Header */}
      <text x="32" y="42" fill="#1A1614" fontSize="13" fontFamily="Arial" fontWeight="700" letterSpacing="2">UI COMPONENT KIT</text>
      <line x1="32" y1="52" x2="448" y2="52" stroke="#E8E2D9" strokeWidth="1" />
      {/* Primary button */}
      <rect x="32" y="72" width="140" height="40" rx="20" fill="#1A1614" />
      <text x="102" y="97" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial" fontWeight="700" letterSpacing="1">EXPLORE NOW</text>
      {/* Outline button */}
      <rect x="186" y="72" width="120" height="40" rx="20" fill="none" stroke="#1A1614" strokeWidth="1.5" />
      <text x="246" y="97" textAnchor="middle" fill="#1A1614" fontSize="12" fontFamily="Arial" letterSpacing="1">Learn More</text>
      {/* Ghost button */}
      <rect x="320" y="72" width="128" height="40" rx="20" fill="#FEF3E8" />
      <text x="384" y="97" textAnchor="middle" fill="#C8873A" fontSize="12" fontFamily="Arial" fontWeight="600">Get Started →</text>
      {/* Input field */}
      <rect x="32" y="132" width="280" height="44" rx="12" fill="white" stroke="#E8E2D9" strokeWidth="1.5" />
      <text x="52" y="159" fill="#B5A99A" fontSize="12" fontFamily="Arial">Search premium assets...</text>
      <circle cx="288" cy="154" r="12" fill="#1A1614" />
      <text x="288" y="159" textAnchor="middle" fill="white" fontSize="12" fontFamily="Arial">→</text>
      {/* Toggle */}
      <rect x="328" y="138" width="56" height="28" rx="14" fill="#1A1614" />
      <circle cx="368" cy="152" r="11" fill="white" />
      <rect x="400" y="138" width="56" height="28" rx="14" fill="#E8E2D9" />
      <circle cx="412" cy="152" r="11" fill="white" />
      {/* Color palette */}
      <text x="32" y="202" fill="#9A8F88" fontSize="10" fontFamily="Arial" letterSpacing="2">COLOUR SYSTEM</text>
      {[
        ["#1A1614", "Ink"],
        ["#C8873A", "Amber"],
        ["#E8D5B0", "Sand"],
        ["#EEE8F8", "Lavender"],
        ["#E8F4EE", "Sage"],
        ["#F8EEE8", "Peach"],
      ].map(([color, label], i) => (
        <g key={color} transform={`translate(${32 + i * 74}, 214)`}>
          <rect width="60" height="60" rx="10" fill={color} />
          <text x="30" y="82" textAnchor="middle" fill="#9A8F88" fontSize="9" fontFamily="Arial">{label}</text>
        </g>
      ))}
      {/* Card component */}
      <rect x="32" y="292" width="200" height="54" rx="12" fill="white" stroke="#E8E2D9" strokeWidth="1" />
      <rect x="44" y="306" width="36" height="36" rx="8" fill="#FEF3E8" />
      <circle cx="62" cy="324" r="10" fill="#C8873A" fillOpacity="0.3" />
      <circle cx="62" cy="324" r="5" fill="#C8873A" />
      <text x="92" y="320" fill="#1A1614" fontSize="11" fontFamily="Arial" fontWeight="600">Dashboard</text>
      <text x="92" y="336" fill="#9A8F88" fontSize="9" fontFamily="Arial">12 components</text>
      {/* Badge components */}
      <rect x="248" y="292" width="56" height="22" rx="11" fill="#E8F4EE" />
      <text x="276" y="308" textAnchor="middle" fill="#2D7A4F" fontSize="10" fontFamily="Arial" fontWeight="600">Active</text>
      <rect x="312" y="292" width="56" height="22" rx="11" fill="#FEF3E8" />
      <text x="340" y="308" textAnchor="middle" fill="#C8873A" fontSize="10" fontFamily="Arial" fontWeight="600">New</text>
      <rect x="376" y="292" width="72" height="22" rx="11" fill="#EEE8F8" />
      <text x="412" y="308" textAnchor="middle" fill="#7C6BC9" fontSize="10" fontFamily="Arial" fontWeight="600">Premium</text>
      {/* Progress bar */}
      <rect x="248" y="326" width="200" height="8" rx="4" fill="#E8E2D9" />
      <rect x="248" y="326" width="130" height="8" rx="4" fill="#C8873A" />
      <text x="248" y="348" fill="#9A8F88" fontSize="9" fontFamily="Arial">65% complete</text>
    </svg>
  )
}

function PosterSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="grain" x="0" y="0" width="4" height="4" patternUnits="userSpaceOnUse">
          <circle cx="1" cy="1" r="0.5" fill="rgba(255,255,255,0.05)" />
        </pattern>
      </defs>
      {/* Left panel */}
      <rect width="240" height="360" fill="#1A1614" />
      <rect width="240" height="360" fill="url(#grain)" />
      {/* Right panel */}
      <rect x="240" width="240" height="360" fill="#F8F3EC" />
      {/* Big F on left */}
      <text x="32" y="240" fill="#C8873A" fontSize="220" fontFamily="Georgia, serif" fontWeight="900" opacity="0.9">F</text>
      {/* Subtitle left */}
      <text x="32" y="280" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Arial" letterSpacing="6">EDITORIAL</text>
      <text x="32" y="295" fill="rgba(255,255,255,0.4)" fontSize="9" fontFamily="Arial" letterSpacing="6">DESIGN</text>
      {/* Right panel content */}
      <text x="258" y="80" fill="#1A1614" fontSize="9" fontFamily="Arial" letterSpacing="6">FORM</text>
      <line x1="258" y1="90" x2="460" y2="90" stroke="#1A1614" strokeWidth="0.5" />
      <text x="258" y="110" fill="#9A8F88" fontSize="9" fontFamily="Arial" letterSpacing="1">ISSUE 03 / 2026</text>
      {/* Headline right */}
      <text x="258" y="158" fill="#1A1614" fontSize="36" fontFamily="Georgia, serif" fontWeight="700">The Art</text>
      <text x="258" y="198" fill="#1A1614" fontSize="36" fontFamily="Georgia, serif" fontWeight="700">of Visual</text>
      <text x="258" y="238" fill="#C8873A" fontSize="36" fontFamily="Georgia, serif" fontStyle="italic">Thinking.</text>
      {/* Body copy */}
      <text x="258" y="268" fill="#7A6F68" fontSize="9" fontFamily="Arial">A curated collection of editorial</text>
      <text x="258" y="282" fill="#7A6F68" fontSize="9" fontFamily="Arial">poster templates for modern</text>
      <text x="258" y="296" fill="#7A6F68" fontSize="9" fontFamily="Arial">designers and art directors.</text>
      {/* Divider */}
      <line x1="258" y1="314" x2="460" y2="314" stroke="#E8E2D9" strokeWidth="0.5" />
      <text x="258" y="332" fill="#9A8F88" fontSize="8" fontFamily="Arial" letterSpacing="2">8 TEMPLATES INCLUDED</text>
      {/* CTA */}
      <rect x="352" y="320" width="96" height="28" rx="14" fill="#1A1614" />
      <text x="400" y="339" textAnchor="middle" fill="white" fontSize="9" fontFamily="Arial" fontWeight="700" letterSpacing="1">GET NOW →</text>
    </svg>
  )
}

function IconSetSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#FAFAF7" />
      {/* Header */}
      <text x="240" y="36" textAnchor="middle" fill="#1A1614" fontSize="15" fontFamily="Arial" fontWeight="800" letterSpacing="4">STROKE ICONS</text>
      <text x="240" y="54" textAnchor="middle" fill="#B5A99A" fontSize="9" fontFamily="Arial" letterSpacing="3">180 ICONS · 3 WEIGHTS · SVG & FIGMA</text>
      <line x1="60" y1="66" x2="420" y2="66" stroke="#E8E2D9" strokeWidth="0.8" />

      {/* Icon grid - 6 columns x 3 rows */}
      {/* Row 1 */}
      {/* Home */}
      <g transform="translate(80,95)">
        <polygon points="32,10 56,28 56,58 8,58 8,28" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
        <rect x="22" y="38" width="20" height="20" fill="none" stroke="#1A1614" strokeWidth="2" />
        <line x1="32" y1="10" x2="32" y2="2" stroke="#1A1614" strokeWidth="2" />
      </g>
      {/* Search */}
      <g transform="translate(160,95)">
        <circle cx="28" cy="28" r="16" fill="none" stroke="#1A1614" strokeWidth="2" />
        <line x1="40" y1="40" x2="54" y2="54" stroke="#1A1614" strokeWidth="2.5" strokeLinecap="round" />
      </g>
      {/* Heart */}
      <g transform="translate(240,95)">
        <path d="M32,48 C32,48 10,36 10,22 C10,14 17,8 25,10 C28,11 31,14 32,16 C33,14 36,11 39,10 C47,8 54,14 54,22 C54,36 32,48 32,48Z" fill="none" stroke="#C8873A" strokeWidth="2" />
      </g>
      {/* Star */}
      <g transform="translate(320,95)">
        <polygon points="32,6 38,24 57,24 43,35 48,54 32,43 16,54 21,35 7,24 26,24" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Bell */}
      <g transform="translate(400,95)">
        <path d="M32,6 C22,6 14,14 14,24 L14,42 L8,48 L56,48 L50,42 L50,24 C50,14 42,6 32,6Z" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
        <path d="M24,48 C24,52 27,56 32,56 C37,56 40,52 40,48" fill="none" stroke="#1A1614" strokeWidth="2" />
      </g>

      {/* Row 2 */}
      {/* Camera */}
      <g transform="translate(80,190)">
        <rect x="6" y="20" width="52" height="38" rx="5" fill="none" stroke="#1A1614" strokeWidth="2" />
        <circle cx="32" cy="38" r="10" fill="none" stroke="#1A1614" strokeWidth="2" />
        <path d="M20,20 L24,12 L40,12 L44,20" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
        <circle cx="48" cy="28" r="3" fill="#1A1614" />
      </g>
      {/* Folder */}
      <g transform="translate(160,190)">
        <path d="M6,24 L6,52 L58,52 L58,24 L6,24Z" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
        <path d="M6,24 L6,16 L24,16 L28,24" fill="none" stroke="#1A1614" strokeWidth="2" strokeLinejoin="round" />
      </g>
      {/* Settings */}
      <g transform="translate(240,190)">
        <circle cx="32" cy="32" r="10" fill="none" stroke="#C8873A" strokeWidth="2" />
        <path d="M32,8 L32,14 M32,50 L32,56 M8,32 L14,32 M50,32 L56,32 M14,14 L19,19 M45,45 L50,50 M50,14 L45,19 M19,45 L14,50" stroke="#1A1614" strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* Chart */}
      <g transform="translate(320,190)">
        <rect x="8" y="8" width="48" height="48" rx="4" fill="none" stroke="#1A1614" strokeWidth="2" />
        <line x1="8" y1="40" x2="56" y2="40" stroke="#E8E2D9" strokeWidth="1" />
        <polyline points="14,44 22,28 30,34 40,20 50,26" fill="none" stroke="#C8873A" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
      </g>
      {/* Globe */}
      <g transform="translate(400,190)">
        <circle cx="32" cy="32" r="24" fill="none" stroke="#1A1614" strokeWidth="2" />
        <ellipse cx="32" cy="32" rx="10" ry="24" fill="none" stroke="#1A1614" strokeWidth="1.5" />
        <line x1="8" y1="32" x2="56" y2="32" stroke="#1A1614" strokeWidth="1.5" />
        <line x1="10" y1="20" x2="54" y2="20" stroke="#1A1614" strokeWidth="1" />
        <line x1="10" y1="44" x2="54" y2="44" stroke="#1A1614" strokeWidth="1" />
      </g>

      {/* Row 3 - accent colored */}
      {[
        { x: 80, d: "M32,8 L32,52 M10,30 L54,30 M14,14 L50,50 M50,14 L14,50", label: "Plus" },
        { x: 160, d: "", label: "Mail" },
        { x: 240, d: "", label: "Lock" },
        { x: 320, d: "", label: "User" },
        { x: 400, d: "", label: "Link" },
      ].map(({ x, label }) => (
        <g key={label} transform={`translate(${x},282)`}>
          <rect x="6" y="0" width="52" height="52" rx="12" fill="#F0EBE4" />
          <text x="32" y="32" textAnchor="middle" fill="#C8873A" fontSize="20" fontFamily="Arial" fontWeight="700">{label[0]}</text>
        </g>
      ))}

      {/* Footer */}
      <line x1="60" y1="346" x2="420" y2="346" stroke="#E8E2D9" strokeWidth="0.8" />
      <text x="240" y="358" textAnchor="middle" fill="#B5A99A" fontSize="8" fontFamily="Arial" letterSpacing="3">MIT LICENSE · FIGMA READY</text>
    </svg>
  )
}

function BrandKitSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#1C1714" />
      {/* Left column */}
      <rect width="200" height="360" fill="#141110" />
      {/* Logo mark in left */}
      <g transform="translate(100,100)">
        {/* Geometric mark */}
        <polygon points="0,-50 43,25 -43,25" fill="none" stroke="#C8873A" strokeWidth="1.5" />
        <polygon points="0,-35 30,17 -30,17" fill="#C8873A" fillOpacity="0.2" />
        <circle cx="0" cy="0" r="12" fill="#C8873A" />
        <circle cx="0" cy="0" r="6" fill="#141110" />
      </g>
      <text x="100" y="172" textAnchor="middle" fill="white" fontSize="16" fontFamily="Georgia, serif" letterSpacing="8" fontWeight="400">APEX</text>
      <text x="100" y="190" textAnchor="middle" fill="#C8873A" fontSize="7" fontFamily="Arial" letterSpacing="5" opacity="0.7">COLLECTIVE</text>
      {/* Divider */}
      <line x1="30" y1="210" x2="170" y2="210" stroke="#C8873A" strokeWidth="0.5" opacity="0.3" />
      {/* Color chips in left */}
      <text x="30" y="238" fill="#6E5E4A" fontSize="8" fontFamily="Arial" letterSpacing="3">PALETTE</text>
      {[["#1C1714","Ink"],["#C8873A","Amber"],["#E8C89A","Sand"],["#6E5E4A","Warm"],["#F5EDD8","Cream"]].map(([c, l], i) => (
        <g key={c} transform={`translate(${30 + i * 30}, 248)`}>
          <rect width="24" height="24" rx="5" fill={c} />
          <text x="12" y="38" textAnchor="middle" fill="#6E5E4A" fontSize="6" fontFamily="Arial">{l}</text>
        </g>
      ))}
      {/* Right column */}
      {/* Typography section */}
      <text x="220" y="44" fill="#9A8F88" fontSize="8" fontFamily="Arial" letterSpacing="4">TYPOGRAPHY</text>
      <text x="220" y="90" fill="white" fontSize="46" fontFamily="Georgia, serif" fontWeight="700" opacity="0.95">Aa</text>
      <text x="220" y="110" fill="white" fontSize="13" fontFamily="Georgia, serif" letterSpacing="2">Playfair Display</text>
      <text x="220" y="128" fill="#6E5E4A" fontSize="9" fontFamily="Arial" letterSpacing="1">Heading · H1 — H4</text>
      <text x="220" y="154" fill="#9A8F88" fontSize="8" fontFamily="Arial" letterSpacing="4">SECONDARY</text>
      <text x="220" y="175" fill="rgba(255,255,255,0.7)" fontSize="13" fontFamily="Arial" fontWeight="300" letterSpacing="3">Inter Light</text>
      <text x="220" y="193" fill="#6E5E4A" fontSize="9" fontFamily="Arial">Body copy · Captions · UI</text>
      {/* Grid pattern decoration */}
      <line x1="220" y1="210" x2="465" y2="210" stroke="#2A2420" strokeWidth="1" />
      <text x="220" y="230" fill="#9A8F88" fontSize="8" fontFamily="Arial" letterSpacing="4">LOGO VARIATIONS</text>
      {/* Logo variants */}
      <rect x="220" y="240" width="70" height="70" rx="8" fill="#0D0B0E" />
      <text x="255" y="282" textAnchor="middle" fill="#C8873A" fontSize="28" fontFamily="Georgia, serif" fontWeight="700">A</text>
      <rect x="300" y="240" width="70" height="70" rx="8" fill="#C8873A" />
      <text x="335" y="282" textAnchor="middle" fill="white" fontSize="28" fontFamily="Georgia, serif" fontWeight="700">A</text>
      <rect x="380" y="240" width="70" height="70" rx="8" fill="#F5EDD8" />
      <text x="415" y="282" textAnchor="middle" fill="#1C1714" fontSize="28" fontFamily="Georgia, serif" fontWeight="700">A</text>
      {/* Files included */}
      <text x="220" y="335" fill="#6E5E4A" fontSize="8" fontFamily="Arial" letterSpacing="2">INCLUDES: AI · EPS · SVG · PNG · PDF</text>
    </svg>
  )
}

function TypefaceSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill="#FAF7F2" />
      {/* Large specimen character */}
      <text x="-20" y="290" fill="#1A1614" fontSize="320" fontFamily="Georgia, serif" fontWeight="900" opacity="0.07">G</text>
      {/* Overlay content */}
      <text x="32" y="54" fill="#1A1614" fontSize="10" fontFamily="Arial" letterSpacing="6" fontWeight="700">PLANAR TYPEFACE</text>
      <line x1="32" y1="64" x2="448" y2="64" stroke="#E8E2D9" strokeWidth="1" />
      {/* Alphabet */}
      <text x="32" y="110" fill="#1A1614" fontSize="28" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="4">ABCDEFG</text>
      <text x="32" y="148" fill="#1A1614" fontSize="28" fontFamily="Georgia, serif" fontWeight="400" letterSpacing="4">HIJKLMN</text>
      <text x="32" y="186" fill="#1A1614" fontSize="28" fontFamily="Georgia, serif" fontStyle="italic" letterSpacing="4">OPQRSTU</text>
      <text x="32" y="224" fill="#C8873A" fontSize="28" fontFamily="Georgia, serif" fontWeight="700" letterSpacing="4">VWXYZ</text>
      {/* Numbers */}
      <line x1="32" y1="238" x2="448" y2="238" stroke="#E8E2D9" strokeWidth="0.5" />
      <text x="32" y="270" fill="#9A8F88" fontSize="22" fontFamily="Georgia, serif" letterSpacing="6">0123456789</text>
      {/* Weights */}
      <line x1="32" y1="286" x2="448" y2="286" stroke="#E8E2D9" strokeWidth="0.5" />
      {[
        ["Thin 100", "100"],
        ["Light 300", "300"],
        ["Regular 400", "400"],
        ["Bold 700", "700"],
        ["Black 900", "900"],
      ].map(([label, weight], i) => (
        <text key={label} x={32 + i * 90} y="318" fill="#1A1614" fontSize="11" fontFamily="Georgia, serif" fontWeight={weight}>{label.split(" ")[0]}</text>
      ))}
      <text x="32" y="346" fill="#B5A99A" fontSize="8" fontFamily="Arial" letterSpacing="3">5 WEIGHTS · OPENTYPE · WOFF2 · VARIABLE</text>
    </svg>
  )
}

function MockupSVG() {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="deskGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#E8DDD0" />
          <stop offset="100%" stopColor="#D4C8B8" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="12" floodColor="rgba(26,22,20,0.25)" />
        </filter>
      </defs>
      {/* Desk background */}
      <rect width="480" height="360" fill="url(#deskGrad)" />
      {/* Subtle grid */}
      <line x1="0" y1="180" x2="480" y2="180" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
      <line x1="240" y1="0" x2="240" y2="360" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
      {/* MacBook mockup */}
      <g filter="url(#shadow)" transform="translate(60,30)">
        <rect x="0" y="0" width="300" height="190" rx="8" fill="#2A2520" />
        <rect x="6" y="6" width="288" height="178" rx="4" fill="#FAF7F2" />
        {/* Screen content */}
        <rect x="6" y="6" width="288" height="26" fill="#1A1614" />
        <circle cx="20" cy="19" r="4" fill="#FF5F57" />
        <circle cx="32" cy="19" r="4" fill="#FFBD2E" />
        <circle cx="44" cy="19" r="4" fill="#28CA41" />
        <text x="150" y="23" textAnchor="middle" fill="rgba(255,255,255,0.4)" fontSize="8" fontFamily="Arial">designr.marketplace</text>
        {/* Website preview on screen */}
        <rect x="6" y="32" width="288" height="6" fill="#1A1614" />
        <text x="150" y="58" textAnchor="middle" fill="#1A1614" fontSize="18" fontFamily="Georgia, serif" fontWeight="800">Design</text>
        <text x="150" y="78" textAnchor="middle" fill="#C8873A" fontSize="18" fontFamily="Georgia, serif" fontStyle="italic">assets.</text>
        <rect x="90" y="92" width="120" height="20" rx="10" fill="#1A1614" />
        <text x="150" y="106" textAnchor="middle" fill="white" fontSize="8" fontFamily="Arial" fontWeight="700" letterSpacing="2">EXPLORE →</text>
        {/* Mini cards */}
        <rect x="16" y="126" width="82" height="52" rx="6" fill="white" />
        <rect x="16" y="126" width="82" height="28" rx="6" fill="#E8F4EE" />
        <text x="57" y="170" textAnchor="middle" fill="#9A8F88" fontSize="7" fontFamily="Arial">₹1,999</text>
        <rect x="106" y="126" width="82" height="52" rx="6" fill="white" />
        <rect x="106" y="126" width="82" height="28" rx="6" fill="#EEE8F8" />
        <text x="147" y="170" textAnchor="middle" fill="#9A8F88" fontSize="7" fontFamily="Arial">₹2,499</text>
        <rect x="196" y="126" width="82" height="52" rx="6" fill="white" />
        <rect x="196" y="126" width="82" height="28" rx="6" fill="#FEF3E8" />
        <text x="237" y="170" textAnchor="middle" fill="#9A8F88" fontSize="7" fontFamily="Arial">₹3,299</text>
      </g>
      {/* Laptop base */}
      <rect x="40" y="218" width="340" height="10" rx="5" fill="#2A2520" />
      <rect x="100" y="226" width="220" height="5" rx="2" fill="#1A1614" />
      {/* Phone mockup beside */}
      <g filter="url(#shadow)" transform="translate(360,80)">
        <rect x="0" y="0" width="72" height="128" rx="10" fill="#2A2520" />
        <rect x="4" y="10" width="64" height="108" rx="6" fill="#FAF7F2" />
        <circle cx="36" cy="6" r="3" fill="#3A3530" />
        <rect x="4" y="10" width="64" height="20" fill="#1A1614" rx="1" />
        <rect x="8" y="38" width="56" height="36" rx="4" fill="#FEF3E8" />
        <text x="36" y="62" textAnchor="middle" fill="#C8873A" fontSize="12" fontFamily="Arial" fontWeight="800">₹</text>
        <rect x="8" y="82" width="56" height="8" rx="4" fill="#E8E2D9" />
        <rect x="8" y="96" width="36" height="8" rx="4" fill="#E8E2D9" />
        <rect x="8" y="110" width="56" height="16" rx="8" fill="#1A1614" />
        <text x="36" y="122" textAnchor="middle" fill="white" fontSize="7" fontFamily="Arial" fontWeight="700">BUY NOW</text>
      </g>
      {/* Label */}
      <text x="240" y="316" textAnchor="middle" fill="#9A8F88" fontSize="9" fontFamily="Arial" letterSpacing="4">10 DEVICE MOCKUPS · PSD + FIGMA</text>
      <text x="240" y="336" textAnchor="middle" fill="#C8873A" fontSize="11" fontFamily="Georgia, serif" fontWeight="700">Premium Responsive Mockup Kit</text>
    </svg>
  )
}

// ── Mock Products ─────────────────────────────────────────────────────────────

const MOCK_DESIGNS = [
  {
    id: "demo-1",
    title: "Aurum Logo Identity Kit",
    designer: "Arjun Mehta",
    category: "Logo Design",
    price: "2,499",
    tag: "Bestseller",
    tagColor: "bg-[#FEF3E8] text-[#C8873A]",
    Preview: LogoKitSVG,
  },
  {
    id: "demo-2",
    title: "Minimal UI Component Kit",
    designer: "Priya Sharma",
    category: "UI Kits",
    price: "3,999",
    tag: "New",
    tagColor: "bg-[#E8F4EE] text-[#2D7A4F]",
    Preview: UIKitSVG,
  },
  {
    id: "demo-3",
    title: "Form Editorial Poster Set",
    designer: "Rohan Verma",
    category: "Posters",
    price: "1,799",
    tag: "Popular",
    tagColor: "bg-[#EEE8F8] text-[#7C6BC9]",
    Preview: PosterSVG,
  },
  {
    id: "demo-4",
    title: "Stroke Icon Pack (180 Icons)",
    designer: "Studio Noor",
    category: "Icon Sets",
    price: "2,199",
    tag: "Top Rated",
    tagColor: "bg-[#FEF3E8] text-[#C8873A]",
    Preview: IconSetSVG,
  },
  {
    id: "demo-5",
    title: "Apex Brand Identity System",
    designer: "Kavya Nair",
    category: "Brand Identity",
    price: "5,999",
    tag: "Premium",
    tagColor: "bg-[#1A1614] text-white",
    Preview: BrandKitSVG,
  },
  {
    id: "demo-6",
    title: "Planar Variable Typeface",
    designer: "Fonts by Rao",
    category: "Fonts",
    price: "1,499",
    tag: "New",
    tagColor: "bg-[#E8F4EE] text-[#2D7A4F]",
    Preview: TypefaceSVG,
  },
]

export function DesignExamples() {
  return (
    <section className="bg-white px-6 py-24">
      <div className="mx-auto max-w-7xl">
        {/* Section header */}
        <div className="mb-12 flex items-end justify-between">
          <div>
            <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-[#C8873A]">
              — Featured this week
            </p>
            <h2 className="text-4xl font-black tracking-tight text-[#1A1614] md:text-5xl">
              Top picks for
              <br />
              <span className="italic text-[#C8A882]">creative pros.</span>
            </h2>
          </div>
          <Link
            href="/products"
            className="group hidden items-center gap-2 rounded-full border border-[#E8E2D9] bg-[#FAF7F2] px-5 py-2.5 text-sm font-semibold text-[#7A6F68] transition-all hover:border-[#D4C9BE] hover:text-[#1A1614] md:flex"
          >
            View all
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {MOCK_DESIGNS.map((item) => (
            <Link key={item.id} href="/products" className="group block">
              <article>
                {/* Preview */}
                <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-[#F0EBE4]">
                  <item.Preview />

                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#1A1614]/75 via-[#1A1614]/20 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                  {/* Hover buy bar */}
                  <div className="absolute bottom-4 left-4 right-4 translate-y-3 opacity-0 transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100">
                    <div className="flex items-center justify-between rounded-xl border border-white/20 bg-white/95 px-4 py-3 shadow-xl backdrop-blur-md">
                      <span className="text-base font-black text-[#1A1614]">₹{item.price}</span>
                      <span className="flex items-center gap-1.5 rounded-full bg-[#1A1614] px-3 py-1.5 text-xs font-black text-white">
                        <ShoppingBag size={11} />
                        Buy
                      </span>
                    </div>
                  </div>

                  {/* Category pill */}
                  <div className="absolute left-3 top-3">
                    <span className="rounded-full border border-white/30 bg-white/80 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-[#5C5248] backdrop-blur-sm">
                      {item.category}
                    </span>
                  </div>

                  {/* Tag badge */}
                  <div className="absolute right-3 top-3">
                    <span className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider ${item.tagColor}`}>
                      {item.tag}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="mt-4 px-1">
                  <h3 className="line-clamp-1 font-semibold text-[#1A1614] transition-colors group-hover:text-[#C8873A]">
                    {item.title}
                  </h3>
                  <div className="mt-1.5 flex items-center justify-between">
                    <span className="text-sm text-[#9A8F88]">by {item.designer}</span>
                    <span className="text-sm font-bold text-[#5C5248]">₹{item.price}</span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link
            href="/products"
            className="group inline-flex items-center gap-2 rounded-full border border-[#E8E2D9] bg-[#FAF7F2] px-8 py-3.5 text-sm font-semibold text-[#7A6F68] transition-all hover:border-[#D4C9BE] hover:text-[#1A1614]"
          >
            Browse all products
            <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export { MockupSVG }
