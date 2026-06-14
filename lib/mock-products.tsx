import React from "react"
import type { Product } from "@/components/products/ProductCard"

// ── 9 colour themes ───────────────────────────────────────────────────────────

const THEMES = [
  { bg:"#0E1520", fg:"#FFFFFF", accent:"#C8A84A", mid:"#1E2840", muted:"#8896B0" }, // navy/gold
  { bg:"#FAF7F2", fg:"#1A1614", accent:"#C8873A", mid:"#F0EBE4", muted:"#9A8F88" }, // cream/amber
  { bg:"#0D1E16", fg:"#FFFFFF", accent:"#4CAF82", mid:"#1A3028", muted:"#7AB090" }, // forest/mint
  { bg:"#F0EDF8", fg:"#2D1A44", accent:"#8B5CF6", mid:"#E4DEF0", muted:"#8878A0" }, // lavender
  { bg:"#1A0E20", fg:"#FFFFFF", accent:"#C078E8", mid:"#2E1A40", muted:"#9878B8" }, // deep purple
  { bg:"#FEF3E8", fg:"#1A1614", accent:"#D97706", mid:"#FBE8CC", muted:"#A87840" }, // peach
  { bg:"#0E1E24", fg:"#FFFFFF", accent:"#22D3EE", mid:"#1A3040", muted:"#60A8C0" }, // teal/cyan
  { bg:"#F0F8F0", fg:"#1A2814", accent:"#22C55E", mid:"#D8EED8", muted:"#58A870" }, // mint/green
  { bg:"#1E1214", fg:"#FFFFFF", accent:"#F87171", mid:"#301A1C", muted:"#C07070" }, // rose
]

// ── SVG Templates ─────────────────────────────────────────────────────────────

function LogoCircleSVG({ t }: { t: typeof THEMES[0] }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.bg}/>
      <circle cx="240" cy="150" r="80" fill="none" stroke={t.accent} strokeWidth="1.5"/>
      <circle cx="240" cy="150" r="62" fill="none" stroke={t.accent} strokeWidth="0.5" opacity="0.4"/>
      <polygon points="240,95 275,150 240,205 205,150" fill="none" stroke={t.accent} strokeWidth="1.2"/>
      <polygon points="240,112 258,150 240,188 222,150" fill={t.accent} fillOpacity="0.15"/>
      <circle cx="240" cy="150" r="10" fill={t.accent}/>
      <circle cx="240" cy="150" r="5" fill={t.bg}/>
      <text x="240" y="262" textAnchor="middle" fill={t.fg} fontSize="20" fontFamily="Georgia,serif" letterSpacing="14" fontWeight="400">AURUM</text>
      <text x="240" y="282" textAnchor="middle" fill={t.accent} fontSize="8" fontFamily="Arial" letterSpacing="7" opacity="0.7">CREATIVE STUDIO</text>
      <line x1="148" y1="244" x2="332" y2="244" stroke={t.accent} strokeWidth="0.5" opacity="0.3"/>
      {[t.bg, t.accent, t.mid, t.fg, t.muted].map((c, i) => (
        <rect key={i} x={160+i*34} y="300" width="24" height="24" rx="6" fill={c} stroke={t.accent} strokeWidth="0.3" strokeOpacity="0.3"/>
      ))}
    </svg>
  )
}

function LogoWordmarkSVG({ t, letter, name }: { t: typeof THEMES[0]; letter: string; name: string }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.bg}/>
      <text x="60" y="240" fill={t.accent} fontSize="210" fontFamily="Georgia,serif" fontWeight="900" opacity="0.12">{letter}</text>
      <rect x="60" y="100" width="70" height="70" rx="14" fill={t.accent}/>
      <text x="95" y="149" textAnchor="middle" fill={t.bg} fontSize="36" fontFamily="Georgia,serif" fontWeight="900">{letter}</text>
      <text x="148" y="136" fill={t.fg} fontSize="32" fontFamily="Georgia,serif" fontWeight="700">{name}</text>
      <text x="148" y="162" fill={t.muted} fontSize="12" fontFamily="Arial" letterSpacing="6" fontWeight="300">DESIGN STUDIO</text>
      <line x1="60" y1="185" x2="420" y2="185" stroke={t.accent} strokeWidth="0.8" opacity="0.3"/>
      <text x="60" y="220" fill={t.muted} fontSize="11" fontFamily="Arial" letterSpacing="2">Brand · Identity · Strategy</text>
      <text x="60" y="260" fill={t.muted} fontSize="11" fontFamily="Arial" letterSpacing="2">Logo · Marks · Type</text>
      <rect x="60" y="290" width="100" height="36" rx="18" fill={t.accent}/>
      <text x="110" y="313" textAnchor="middle" fill={t.bg} fontSize="11" fontFamily="Arial" fontWeight="700" letterSpacing="2">GET FILES →</text>
    </svg>
  )
}

function PosterEditorialSVG({ t, word, sub }: { t: typeof THEMES[0]; word: string; sub: string }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="240" height="360" fill={t.bg}/>
      <rect x="240" width="240" height="360" fill={t.mid}/>
      <text x="20" y="280" fill={t.accent} fontSize="260" fontFamily="Georgia,serif" fontWeight="900" opacity="0.15">{word[0]}</text>
      <text x="20" y="64" fill={t.fg} fontSize="10" fontFamily="Arial" letterSpacing="6" opacity="0.5">EDITORIAL</text>
      <text x="20" y="84" fill={t.fg} fontSize="10" fontFamily="Arial" letterSpacing="6" opacity="0.5">COLLECTION</text>
      <text x="20" y="155" fill={t.fg} fontSize="52" fontFamily="Georgia,serif" fontWeight="900">{word}</text>
      <line x1="20" y1="168" x2="220" y2="168" stroke={t.accent} strokeWidth="1.5"/>
      <text x="20" y="194" fill={t.muted} fontSize="10" fontFamily="Arial">Premium poster template</text>
      <text x="20" y="212" fill={t.muted} fontSize="10" fontFamily="Arial">for modern design studios.</text>
      <text x="260" y="50" fill={t.muted} fontSize="9" fontFamily="Arial" letterSpacing="4">{sub}</text>
      <text x="260" y="120" fill={t.fg} fontSize="38" fontFamily="Georgia,serif" fontWeight="300" fontStyle="italic">The Art of</text>
      <text x="260" y="168" fill={t.accent} fontSize="44" fontFamily="Georgia,serif" fontWeight="900">Visual.</text>
      <text x="260" y="220" fill={t.muted} fontSize="9" fontFamily="Arial">Hand-crafted layout with</text>
      <text x="260" y="236" fill={t.muted} fontSize="9" fontFamily="Arial">full editorial styling.</text>
      <rect x="260" y="290" width="140" height="34" rx="17" fill={t.accent}/>
      <text x="330" y="312" textAnchor="middle" fill={t.bg} fontSize="10" fontFamily="Arial" fontWeight="700" letterSpacing="2">DOWNLOAD →</text>
    </svg>
  )
}

function UIDashboardSVG({ t }: { t: typeof THEMES[0] }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.mid}/>
      {/* Sidebar */}
      <rect x="12" y="12" width="80" height="336" rx="10" fill={t.bg}/>
      <circle cx="52" cy="44" r="16" fill={t.accent} fillOpacity="0.2"/>
      <circle cx="52" cy="44" r="8" fill={t.accent}/>
      {[72,96,120,144,168].map((y, i) => (
        <g key={y}>
          <rect x="24" y={y} width="32" height="14" rx="7" fill={i===0?t.accent:t.muted} fillOpacity={i===0?0.2:0.1}/>
          <rect x="64" y={y+2} width="20" height="10" rx="5" fill={t.fg} fillOpacity="0.1"/>
        </g>
      ))}
      {/* Main area */}
      <rect x="104" y="12" width="364" height="60" rx="10" fill={t.bg}/>
      <text x="120" y="36" fill={t.fg} fontSize="13" fontFamily="Arial" fontWeight="700" opacity="0.9">Analytics Dashboard</text>
      <text x="120" y="54" fill={t.muted} fontSize="9" fontFamily="Arial">Welcome back! Here's what's happening.</text>
      <rect x="420" y="24" width="32" height="32" rx="8" fill={t.accent}/>
      {/* Stat cards */}
      {[[104,"Revenue","₹2.4M","+12%"],[222,"Orders","1,248","+8%"],[340,"Users","48K","+24%"]].map(([x, label, val, pct]) => (
        <g key={String(x)}>
          <rect x={Number(x)} y="84" width="110" height="72" rx="10" fill={t.bg}/>
          <text x={Number(x)+16} y="106" fill={t.muted} fontSize="9" fontFamily="Arial">{String(label)}</text>
          <text x={Number(x)+16} y="132" fill={t.fg} fontSize="20" fontFamily="Arial" fontWeight="800">{String(val)}</text>
          <rect x={Number(x)+16} y="142" width="36" height="7" rx="3.5" fill={t.accent} fillOpacity="0.3"/>
          <text x={Number(x)+60} y="150" fill={t.accent} fontSize="9" fontFamily="Arial" fontWeight="700">{String(pct)}</text>
        </g>
      ))}
      {/* Chart */}
      <rect x="104" y="168" width="232" height="120" rx="10" fill={t.bg}/>
      <text x="120" y="188" fill={t.fg} fontSize="10" fontFamily="Arial" fontWeight="700" opacity="0.8">Revenue Trend</text>
      {[0,1,2,3,4,5,6].map(i => {
        const heights = [40,65,45,80,55,90,70]
        const h = heights[i]
        return <rect key={i} x={126+i*28} y={268-h} width="16" height={h} rx="4" fill={t.accent} fillOpacity={0.3+i*0.1}/>
      })}
      <polyline points="134,248 162,222 190,242 218,205 246,230 274,195 302,215" fill="none" stroke={t.accent} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round"/>
      {/* Table */}
      <rect x="344" y="168" width="124" height="120" rx="10" fill={t.bg}/>
      <text x="360" y="188" fill={t.fg} fontSize="10" fontFamily="Arial" fontWeight="700" opacity="0.8">Top Items</text>
      {["Logo Kit","UI Pack","Poster Set"].map((item, i) => (
        <g key={item}>
          <rect x="360" y={200+i*26} width="80" height="14" rx="4" fill={t.muted} fillOpacity="0.1"/>
          <text x="368" y={211+i*26} fill={t.fg} fontSize="8" fontFamily="Arial" opacity="0.8">{item}</text>
          <rect x="444" y={200+i*26} width="16" height="14" rx="4" fill={t.accent} fillOpacity="0.2"/>
        </g>
      ))}
      {/* Bottom row */}
      <rect x="104" y="300" width="364" height="48" rx="10" fill={t.bg}/>
      {["Design","Typography","Brand","Motion"].map((label, i) => (
        <g key={label}>
          <rect x={116+i*88} y="312" width="60" height="8" rx="4" fill={i===0?t.accent:t.muted} fillOpacity={i===0?0.6:0.15}/>
          <text x={146+i*88} y="336" textAnchor="middle" fill={t.muted} fontSize="8" fontFamily="Arial">{label}</text>
        </g>
      ))}
    </svg>
  )
}

function UIMobileSVG({ t }: { t: typeof THEMES[0] }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.mid}/>
      {/* Phone 1 */}
      <rect x="40" y="20" width="150" height="320" rx="24" fill={t.bg} stroke={t.accent} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="50" y="36" width="130" height="288" rx="16" fill={t.mid}/>
      <rect x="62" y="52" width="40" height="6" rx="3" fill={t.accent} fillOpacity="0.6"/>
      <rect x="62" y="66" width="106" height="6" rx="3" fill={t.fg} fillOpacity="0.1"/>
      <rect x="62" y="82" width="106" height="80" rx="10" fill={t.accent} fillOpacity="0.15"/>
      <text x="115" y="130" textAnchor="middle" fill={t.accent} fontSize="28" fontFamily="Georgia,serif" fontWeight="900">₹</text>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x="62" y={174+i*38} width="106" height="28" rx="8" fill={t.fg} fillOpacity="0.06"/>
          <rect x="70" y={180+i*38} width="14" height="14" rx="4" fill={t.accent} fillOpacity="0.4"/>
          <rect x="92" y={182+i*38} width="50" height="5" rx="2.5" fill={t.fg} fillOpacity="0.2"/>
          <rect x="92" y={191+i*38} width="30" height="4" rx="2" fill={t.muted} fillOpacity="0.3"/>
        </g>
      ))}
      <rect x="70" y="296" width="90" height="22" rx="11" fill={t.accent}/>
      <text x="115" y="312" textAnchor="middle" fill={t.bg} fontSize="9" fontFamily="Arial" fontWeight="700">BUY NOW</text>
      {/* Phone 2 */}
      <rect x="210" y="40" width="130" height="280" rx="20" fill={t.bg} stroke={t.accent} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="218" y="56" width="114" height="248" rx="12" fill={t.mid}/>
      <rect x="228" y="68" width="94" height="50" rx="8" fill={t.accent} fillOpacity="0.12"/>
      <text x="275" y="100" textAnchor="middle" fill={t.fg} fontSize="18" fontFamily="Georgia,serif" fontWeight="800">Explore</text>
      {[0,1,2,3].map(i=>(
        <rect key={i} x={228+(i%2)*50} y={126+Math.floor(i/2)*54} width="44" height="44" rx="10" fill={t.fg} fillOpacity="0.07"/>
      ))}
      <rect x="228" y="244" width="94" height="16" rx="8" fill={t.accent} fillOpacity="0.2"/>
      <rect x="228" y="268" width="60" height="12" rx="6" fill={t.muted} fillOpacity="0.2"/>
      {/* Phone 3 partial */}
      <rect x="360" y="60" width="110" height="240" rx="18" fill={t.bg} stroke={t.accent} strokeWidth="0.5" strokeOpacity="0.3"/>
      <rect x="368" y="74" width="94" height="210" rx="10" fill={t.mid}/>
      <rect x="376" y="86" width="78" height="56" rx="8" fill={t.accent} fillOpacity="0.1"/>
      <circle cx="415" cy="114" r="18" fill={t.accent} fillOpacity="0.25"/>
      <circle cx="415" cy="114" r="8" fill={t.accent}/>
      {[0,1,2].map(i=>(
        <rect key={i} x="376" y={152+i*24} width={[78,52,64][i]} height="8" rx="4" fill={t.fg} fillOpacity={[0.15,0.1,0.08][i]}/>
      ))}
      <rect x="376" y="252" width="78" height="20" rx="10" fill={t.accent}/>
    </svg>
  )
}

function IconGridSVG({ t }: { t: typeof THEMES[0] }) {
  const icons: [number, number, string][] = [
    [0,0,"H"],[1,0,"S"],[2,0,"♡"],[3,0,"★"],
    [0,1,"⊙"],[1,1,"◷"],[2,1,"▲"],[3,1,"⬡"],
    [0,2,"↗"],[1,2,"⊕"],[2,2,"◈"],[3,2,"⌂"],
  ]
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.bg}/>
      <text x="240" y="32" textAnchor="middle" fill={t.fg} fontSize="11" fontFamily="Arial" letterSpacing="6" fontWeight="700" opacity="0.8">ICON SET — 180 ICONS</text>
      <line x1="40" y1="44" x2="440" y2="44" stroke={t.accent} strokeWidth="0.5" opacity="0.4"/>
      {icons.map(([col, row, chr]) => {
        const x = 70 + col * 100
        const y = 68 + row * 88
        const highlight = col === 2 && row === 0
        return (
          <g key={`${col}-${row}`}>
            <rect x={x-28} y={y-28} width="56" height="56" rx="14"
              fill={highlight ? t.accent : t.mid}
              stroke={highlight ? t.accent : t.accent}
              strokeOpacity={highlight ? 0.8 : 0.15}
              strokeWidth="1"
            />
            <text x={x} y={y+8} textAnchor="middle" fill={highlight ? t.bg : t.fg} fontSize="22" fontFamily="Arial" opacity={highlight ? 1 : 0.7}>{chr}</text>
          </g>
        )
      })}
      <line x1="40" y1="340" x2="440" y2="340" stroke={t.accent} strokeWidth="0.5" opacity="0.3"/>
      <text x="40" y="354" fill={t.muted} fontSize="9" fontFamily="Arial" letterSpacing="2">SVG · FIGMA · AI · REACT · FLUTTER</text>
    </svg>
  )
}

function TypefaceSVG({ t, name }: { t: typeof THEMES[0]; name: string }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.bg}/>
      <text x="-30" y="310" fill={t.fg} fontSize="320" fontFamily="Georgia,serif" fontWeight="900" opacity="0.06">G</text>
      <text x="36" y="42" fill={t.fg} fontSize="11" fontFamily="Arial" letterSpacing="5" fontWeight="700" opacity="0.8">{name.toUpperCase()}</text>
      <line x1="36" y1="52" x2="444" y2="52" stroke={t.accent} strokeWidth="0.8"/>
      <text x="36" y="98" fill={t.fg} fontSize="30" fontFamily="Georgia,serif" fontWeight="700" letterSpacing="3" opacity="0.9">ABCDEFG</text>
      <text x="36" y="138" fill={t.fg} fontSize="30" fontFamily="Georgia,serif" fontWeight="400" letterSpacing="3" opacity="0.8">HIJKLMN</text>
      <text x="36" y="178" fill={t.accent} fontSize="30" fontFamily="Georgia,serif" fontStyle="italic" letterSpacing="3">OPQRSTU</text>
      <text x="36" y="218" fill={t.muted} fontSize="30" fontFamily="Georgia,serif" fontWeight="300" letterSpacing="3" opacity="0.7">VWXYZ</text>
      <line x1="36" y1="232" x2="444" y2="232" stroke={t.mid} strokeWidth="0.5" opacity="0.6"/>
      <text x="36" y="264" fill={t.muted} fontSize="22" fontFamily="Georgia,serif" letterSpacing="4" opacity="0.8">0123456789</text>
      <line x1="36" y1="278" x2="444" y2="278" stroke={t.mid} strokeWidth="0.5" opacity="0.4"/>
      {["Thin","Light","Regular","Bold","Black"].map((w,i)=>(
        <text key={w} x={36+i*82} y="310" fill={t.fg} fontSize="11" fontFamily="Georgia,serif" fontWeight={[100,300,400,700,900][i]} opacity="0.8">{w}</text>
      ))}
      <text x="36" y="344" fill={t.muted} fontSize="8" fontFamily="Arial" letterSpacing="3">5 WEIGHTS · OTF · WOFF2 · VARIABLE</text>
    </svg>
  )
}

function IllustrationSVG({ t, idx }: { t: typeof THEMES[0]; idx: number }) {
  const shapes = [
    // 0: Concentric circles
    <g key="0">
      {[100,80,60,40,20].map((r,i)=><circle key={r} cx="240" cy="160" r={r} fill="none" stroke={i%2===0?t.accent:t.fg} strokeWidth={i===0?1.5:0.8} opacity={1-i*0.15}/>)}
      <circle cx="240" cy="160" r="8" fill={t.accent}/>
      <line x1="40" y1="160" x2="440" y2="160" stroke={t.muted} strokeWidth="0.5" opacity="0.3"/>
      <line x1="240" y1="30" x2="240" y2="290" stroke={t.muted} strokeWidth="0.5" opacity="0.3"/>
    </g>,
    // 1: Grid of dots
    <g key="1">
      {Array.from({length:8},(_, col)=>Array.from({length:6},(_,row)=>{
        const size = (col+row)%3===0?6:(col+row)%3===1?4:2
        const color = col===3&&row===2?t.accent:col===4&&row===3?t.accent:t.fg
        return <circle key={`${col}-${row}`} cx={100+col*40} cy={80+row*40} r={size} fill={color} fillOpacity={color===t.accent?0.9:0.2}/>
      })).flat()}
    </g>,
    // 2: Overlapping geometric shapes
    <g key="2">
      <circle cx="200" cy="160" r="90" fill="none" stroke={t.accent} strokeWidth="1.5" opacity="0.7"/>
      <rect x="200" y="80" width="140" height="140" rx="12" fill="none" stroke={t.fg} strokeWidth="1.5" opacity="0.5"/>
      <polygon points="240,60 340,220 140,220" fill="none" stroke={t.muted} strokeWidth="1" opacity="0.6"/>
      <circle cx="270" cy="155" r="12" fill={t.accent} opacity="0.9"/>
    </g>,
    // 3: Abstract waves
    <g key="3">
      {[0,1,2,3,4].map(i=>(
        <path key={i} d={`M 40 ${120+i*24} Q 140 ${96+i*24} 240 ${120+i*24} Q 340 ${144+i*24} 440 ${120+i*24}`}
          fill="none" stroke={i===2?t.accent:t.fg} strokeWidth={i===2?2:0.8} opacity={1-Math.abs(i-2)*0.2}/>
      ))}
      <circle cx="240" cy="168" r="10" fill={t.accent}/>
    </g>,
    // 4: Hexagon grid
    <g key="4">
      {[[240,120],[200,155],[280,155],[160,190],[240,190],[320,190],[200,225],[280,225],[240,260]].map(([cx,cy],i)=>(
        <polygon key={i} points={`${cx},${cy-28} ${cx+24},${cy-14} ${cx+24},${cy+14} ${cx},${cy+28} ${cx-24},${cy+14} ${cx-24},${cy-14}`}
          fill={i===0||i===4?t.accent:t.mid} stroke={t.accent} strokeWidth="0.8"
          fillOpacity={i===0||i===4?0.3:0.5} opacity="0.85"/>
      ))}
    </g>,
    // 5: Diamond spiral
    <g key="5">
      {[80,60,40,24,12].map((s,i)=>(
        <rect key={s} x={240-s} y={160-s} width={s*2} height={s*2} rx="4"
          transform={`rotate(${i*15} 240 160)`}
          fill="none" stroke={i===0?t.accent:t.fg} strokeWidth={i===0?1.5:0.7} opacity={1-i*0.15}/>
      ))}
      <circle cx="240" cy="160" r="8" fill={t.accent}/>
    </g>,
    // 6: Triangular grid
    <g key="6">
      {[[120,200],[200,60],[280,200],[360,200],[240,340]].map(([x,y],i)=>(
        <polygon key={i} points={`${x},${y-50} ${x+43},${y+25} ${x-43},${y+25}`}
          fill={i===0?t.accent:t.mid} stroke={t.accent} strokeWidth="0.8"
          fillOpacity={i===0?0.5:0.2} opacity="0.9"/>
      ))}
    </g>,
    // 7: Circle arrangement
    <g key="7">
      {[0,1,2,3,4,5].map(i=>{
        const angle = (i/6)*Math.PI*2
        const r=90
        return <circle key={i} cx={240+r*Math.cos(angle)} cy={160+r*Math.sin(angle)} r={i===0?22:14}
          fill={i===0?t.accent:t.mid} stroke={t.accent} strokeWidth="0.8" fillOpacity={i===0?0.8:0.4}/>
      })}
      <circle cx="240" cy="160" r="24" fill={t.accent} fillOpacity="0.9"/>
    </g>,
    // 8: Diagonal lines art
    <g key="8">
      {Array.from({length:20},(_,i)=>(
        <line key={i} x1={40+i*22} y1="40" x2={40} y2={40+i*22}
          stroke={i%4===0?t.accent:t.fg} strokeWidth={i%4===0?1.5:0.5}
          opacity={0.3+i*0.03}/>
      ))}
      <circle cx="240" cy="200" r="60" fill={t.mid} fillOpacity="0.8" stroke={t.accent} strokeWidth="1.5"/>
      <text x="240" y="210" textAnchor="middle" fill={t.accent} fontSize="32" fontFamily="Georgia,serif" fontWeight="900">ART</text>
    </g>,
  ]
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <rect width="480" height="360" fill={t.bg}/>
      {shapes[idx % shapes.length]}
      <line x1="40" y1="316" x2="440" y2="316" stroke={t.accent} strokeWidth="0.5" opacity="0.3"/>
      <text x="240" y="348" textAnchor="middle" fill={t.muted} fontSize="8" fontFamily="Arial" letterSpacing="4">SVG ILLUSTRATION · EDITABLE · FIGMA READY</text>
    </svg>
  )
}

function MockupDeviceSVG({ t }: { t: typeof THEMES[0] }) {
  return (
    <svg viewBox="0 0 480 360" className="h-full w-full" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id={`dg-${t.bg.replace('#','')}`} x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor={t.mid}/>
          <stop offset="100%" stopColor={t.bg}/>
        </linearGradient>
      </defs>
      <rect width="480" height="360" fill={`url(#dg-${t.bg.replace('#','')})`}/>
      {/* Laptop */}
      <rect x="60" y="28" width="280" height="178" rx="8" fill={t.bg === "#FAF7F2" ? "#2A2520" : t.mid} stroke={t.accent} strokeWidth="0.5" strokeOpacity="0.4"/>
      <rect x="68" y="36" width="264" height="162" rx="4" fill={t.bg}/>
      {/* Screen content */}
      <rect x="68" y="36" width="264" height="24" fill={t.accent} fillOpacity="0.9"/>
      <circle cx="80" cy="48" r="4" fill={t.bg} fillOpacity="0.5"/>
      <circle cx="92" cy="48" r="4" fill={t.bg} fillOpacity="0.5"/>
      <circle cx="104" cy="48" r="4" fill={t.bg} fillOpacity="0.5"/>
      <text x="200" y="52" textAnchor="middle" fill={t.bg} fontSize="8" fontFamily="Arial" opacity="0.7">designr.marketplace</text>
      <rect x="76" y="70" width="248" height="36" rx="6" fill={t.mid} fillOpacity="0.6"/>
      <text x="200" y="94" textAnchor="middle" fill={t.fg} fontSize="14" fontFamily="Georgia,serif" fontWeight="800" opacity="0.9">Premium Design Assets</text>
      {[0,1,2].map(i=>(
        <g key={i}>
          <rect x={76+i*82} y="116" width="76" height="54" rx="8" fill={t.mid} fillOpacity="0.5"/>
          <rect x={76+i*82} y="116" width="76" height="28" rx="8" fill={t.accent} fillOpacity="0.12"/>
          <rect x={84+i*82} y="152" width="40" height="6" rx="3" fill={t.fg} fillOpacity="0.2"/>
          <rect x={84+i*82} y="162" width="28" height="4" rx="2" fill={t.muted} fillOpacity="0.3"/>
        </g>
      ))}
      <rect x="76" y="180" width="124" height="14" rx="7" fill={t.accent} fillOpacity="0.7"/>
      <rect x="210" y="180" width="60" height="14" rx="7" fill={t.mid} fillOpacity="0.5"/>
      {/* Base */}
      <rect x="34" y="204" width="332" height="10" rx="5" fill={t.bg === "#FAF7F2" ? "#2A2520" : t.mid}/>
      <rect x="134" y="212" width="132" height="6" rx="3" fill={t.accent} fillOpacity="0.4"/>
      {/* Phone */}
      <rect x="356" y="70" width="90" height="164" rx="14" fill={t.bg === "#FAF7F2" ? "#2A2520" : t.mid} stroke={t.accent} strokeWidth="0.4" strokeOpacity="0.4"/>
      <rect x="362" y="84" width="78" height="136" rx="8" fill={t.bg}/>
      <circle cx="401" cy="77" r="3" fill={t.accent} fillOpacity="0.5"/>
      <rect x="368" y="96" width="66" height="32" rx="6" fill={t.accent} fillOpacity="0.1"/>
      <text x="401" y="118" textAnchor="middle" fill={t.accent} fontSize="16" fontFamily="Georgia,serif" fontWeight="900">D</text>
      {[0,1,2].map(i=><rect key={i} x="368" y={136+i*22} width={[66,44,56][i]} height="8" rx="4" fill={t.fg} fillOpacity={[0.15,0.1,0.07][i]}/>)}
      <rect x="368" y="198" width="66" height="18" rx="9" fill={t.accent}/>
      <text x="401" y="211" textAnchor="middle" fill={t.bg} fontSize="8" fontFamily="Arial" fontWeight="700">BUY NOW</text>
      <text x="240" y="310" textAnchor="middle" fill={t.muted} fontSize="9" fontFamily="Arial" letterSpacing="3">10 DEVICE MOCKUPS · PSD + FIGMA</text>
    </svg>
  )
}

// ── Build mock product from params ────────────────────────────────────────────

type MockEntry = {
  type: "logo-circle"|"logo-wordmark"|"poster"|"ui-dash"|"ui-mobile"|"icons"|"typeface"|"illustration"|"mockup"
  title: string
  designer: string
  category: string  // slug
  price: number
  license: "personal"|"commercial"|"extended"
  formats: string[]
  sales: number
  rating: number
  reviews: number
  seed: number
  themeIdx: number
  letter?: string
  name?: string
  word?: string
  sub?: string
}

function makeSVG(e: MockEntry): React.ReactNode {
  const t = THEMES[e.themeIdx % THEMES.length]
  switch (e.type) {
    case "logo-circle":    return <LogoCircleSVG t={t}/>
    case "logo-wordmark":  return <LogoWordmarkSVG t={t} letter={e.letter ?? "A"} name={e.name ?? "Brand"}/>
    case "poster":         return <PosterEditorialSVG t={t} word={e.word ?? "FORM"} sub={e.sub ?? "ISSUE 01"}/>
    case "ui-dash":        return <UIDashboardSVG t={t}/>
    case "ui-mobile":      return <UIMobileSVG t={t}/>
    case "icons":          return <IconGridSVG t={t}/>
    case "typeface":       return <TypefaceSVG t={t} name={e.name ?? "Typeface"}/>
    case "illustration":   return <IllustrationSVG t={t} idx={e.seed}/>
    case "mockup":         return <MockupDeviceSVG t={t}/>
  }
}

const ENTRIES: MockEntry[] = [
  // ── LOGOS (18) ────────────────────────────────────────
  { type:"logo-circle", title:"Aurum Circle Logomark", designer:"Arjun Mehta", category:"logos", price:2499, license:"commercial", formats:["SVG","AI","EPS","PNG"], sales:124, rating:4.9, reviews:38, seed:0, themeIdx:0 },
  { type:"logo-circle", title:"Verdant Identity Mark", designer:"Studio Noor", category:"logos", price:1999, license:"commercial", formats:["SVG","AI","PDF"], sales:87, rating:4.7, reviews:22, seed:1, themeIdx:2 },
  { type:"logo-circle", title:"Bloom Circle Crest", designer:"Priya Sharma", category:"logos", price:2999, license:"extended", formats:["SVG","AI","EPS","PNG","PDF"], sales:56, rating:4.8, reviews:18, seed:2, themeIdx:4 },
  { type:"logo-circle", title:"Lumina Geometric Badge", designer:"Kavya Nair", category:"logos", price:1799, license:"personal", formats:["SVG","PNG"], sales:203, rating:4.6, reviews:41, seed:3, themeIdx:6 },
  { type:"logo-circle", title:"Solstice Brand Crest", designer:"Ravi Kumar", category:"logos", price:3499, license:"extended", formats:["SVG","AI","EPS"], sales:34, rating:5.0, reviews:12, seed:4, themeIdx:8 },
  { type:"logo-circle", title:"Apex Circle System", designer:"Studio Blaze", category:"logos", price:2199, license:"commercial", formats:["SVG","AI","PDF"], sales:91, rating:4.7, reviews:29, seed:5, themeIdx:3 },
  { type:"logo-wordmark", title:"Serif Brand Wordmark A", designer:"Fonts by Rao", category:"logos", price:1499, license:"commercial", formats:["SVG","AI","EPS"], sales:178, rating:4.5, reviews:52, seed:6, themeIdx:1, letter:"A", name:"Arkon" },
  { type:"logo-wordmark", title:"Minimal Wordmark Kit B", designer:"Mehta Type Co", category:"logos", price:1299, license:"personal", formats:["SVG","PDF"], sales:145, rating:4.4, reviews:44, seed:7, themeIdx:5, letter:"B", name:"Blaze" },
  { type:"logo-wordmark", title:"Editorial Wordmark C", designer:"Priya Sharma", category:"logos", price:2299, license:"commercial", formats:["SVG","AI","PNG"], sales:67, rating:4.8, reviews:21, seed:8, themeIdx:7, letter:"C", name:"Craft" },
  { type:"logo-wordmark", title:"Bold Wordmark D", designer:"Studio Noor", category:"logos", price:1799, license:"commercial", formats:["SVG","AI","EPS"], sales:112, rating:4.6, reviews:33, seed:9, themeIdx:0, letter:"D", name:"Dusk" },
  { type:"logo-wordmark", title:"Elegant Mark E", designer:"Kavya Nair", category:"logos", price:2699, license:"extended", formats:["SVG","AI","EPS","PDF"], sales:45, rating:4.9, reviews:16, seed:10, themeIdx:2, letter:"E", name:"Echo" },
  { type:"logo-wordmark", title:"Modern Wordmark F", designer:"Rohan Verma", category:"logos", price:1599, license:"personal", formats:["SVG","PNG"], sales:189, rating:4.3, reviews:58, seed:11, themeIdx:4, letter:"F", name:"Forte" },

  // ── POSTERS (10) ──────────────────────────────────────
  { type:"poster", title:"Form Editorial Poster Set", designer:"Rohan Verma", category:"posters", price:1799, license:"commercial", formats:["AI","EPS","PDF","PNG"], sales:234, rating:4.8, reviews:67, seed:12, themeIdx:0, word:"FORM", sub:"ISSUE 01 / 2026" },
  { type:"poster", title:"BOLD Typography Poster", designer:"Studio Blaze", category:"posters", price:1299, license:"personal", formats:["AI","PDF","PNG"], sales:312, rating:4.6, reviews:89, seed:13, themeIdx:2, word:"BOLD", sub:"LIMITED EDITION" },
  { type:"poster", title:"FLUX Motion Poster Kit", designer:"Arjun Mehta", category:"posters", price:2199, license:"commercial", formats:["AI","EPS","PNG"], sales:98, rating:4.7, reviews:31, seed:14, themeIdx:4, word:"FLUX", sub:"SERIES 02" },
  { type:"poster", title:"GRACE Minimal Poster", designer:"Priya Sharma", category:"posters", price:999, license:"personal", formats:["PDF","PNG"], sales:445, rating:4.4, reviews:112, seed:15, themeIdx:6, word:"GRACE", sub:"VOL. III" },
  { type:"poster", title:"VOID Abstract Poster", designer:"Kavya Nair", category:"posters", price:2499, license:"commercial", formats:["AI","EPS","PDF"], sales:77, rating:4.9, reviews:24, seed:16, themeIdx:8, word:"VOID", sub:"DARK SERIES" },
  { type:"poster", title:"ECHO Wave Poster Set", designer:"Studio Noor", category:"posters", price:1599, license:"commercial", formats:["AI","PDF","PNG"], sales:156, rating:4.5, reviews:45, seed:17, themeIdx:1, word:"ECHO", sub:"ISSUE 04" },
  { type:"poster", title:"RISE Motivational Kit", designer:"Ravi Kumar", category:"posters", price:1099, license:"personal", formats:["PDF","PNG"], sales:387, rating:4.3, reviews:98, seed:18, themeIdx:3, word:"RISE", sub:"COLLECTION" },
  { type:"poster", title:"NEON Vivid Poster Pack", designer:"Fonts by Rao", category:"posters", price:1899, license:"commercial", formats:["AI","EPS","PNG"], sales:134, rating:4.7, reviews:39, seed:19, themeIdx:5, word:"NEON", sub:"VIVID SERIES" },
  { type:"poster", title:"APEX Corporate Poster", designer:"Rohan Verma", category:"posters", price:2799, license:"extended", formats:["AI","EPS","PDF","PNG"], sales:45, rating:5.0, reviews:14, seed:20, themeIdx:7, word:"APEX", sub:"PREMIUM TIER" },
  { type:"poster", title:"DUSK Twilight Poster", designer:"Studio Blaze", category:"posters", price:1399, license:"personal", formats:["PDF","PNG"], sales:267, rating:4.5, reviews:72, seed:21, themeIdx:0, word:"DUSK", sub:"TWILIGHT VOL" },

  // ── UI KITS (10) ──────────────────────────────────────
  { type:"ui-dash", title:"Nexus Dashboard UI Kit", designer:"Priya Sharma", category:"ui-kits", price:3999, license:"commercial", formats:["SVG","AI","FIGMA"], sales:89, rating:4.9, reviews:34, seed:22, themeIdx:0 },
  { type:"ui-dash", title:"Clarity Admin Dashboard", designer:"Arjun Mehta", category:"ui-kits", price:4499, license:"extended", formats:["FIGMA","SVG","AI"], sales:56, rating:5.0, reviews:22, seed:23, themeIdx:2 },
  { type:"ui-dash", title:"Forest Analytics UI", designer:"Kavya Nair", category:"ui-kits", price:2999, license:"commercial", formats:["FIGMA","SVG"], sales:112, rating:4.7, reviews:41, seed:24, themeIdx:6 },
  { type:"ui-dash", title:"Lavender SaaS Kit", designer:"Studio Noor", category:"ui-kits", price:3499, license:"commercial", formats:["FIGMA","SVG","AI"], sales:78, rating:4.8, reviews:28, seed:25, themeIdx:3 },
  { type:"ui-dash", title:"Sunset Admin UI", designer:"Ravi Kumar", category:"ui-kits", price:2499, license:"personal", formats:["FIGMA","PNG"], sales:198, rating:4.5, reviews:63, seed:26, themeIdx:5 },
  { type:"ui-mobile", title:"Pulse Mobile App UI", designer:"Studio Blaze", category:"ui-kits", price:3299, license:"commercial", formats:["FIGMA","SVG","AI"], sales:134, rating:4.8, reviews:47, seed:27, themeIdx:1 },
  { type:"ui-mobile", title:"Swift iOS App Kit", designer:"Priya Sharma", category:"ui-kits", price:2999, license:"commercial", formats:["FIGMA","SVG"], sales:167, rating:4.6, reviews:53, seed:28, themeIdx:4 },
  { type:"ui-mobile", title:"Aurora Mobile UI", designer:"Rohan Verma", category:"ui-kits", price:3799, license:"extended", formats:["FIGMA","SVG","AI","PNG"], sales:43, rating:4.9, reviews:18, seed:29, themeIdx:7 },
  { type:"ui-mobile", title:"Minimal App Screens", designer:"Kavya Nair", category:"ui-kits", price:1999, license:"personal", formats:["FIGMA","PNG"], sales:245, rating:4.4, reviews:77, seed:30, themeIdx:8 },
  { type:"ui-mobile", title:"Dark Mode App Kit", designer:"Arjun Mehta", category:"ui-kits", price:2799, license:"commercial", formats:["FIGMA","SVG","AI"], sales:198, rating:4.7, reviews:62, seed:31, themeIdx:0 },

  // ── ICON SETS (6) ─────────────────────────────────────
  { type:"icons", title:"Stroke Icon Pack — 180 Icons", designer:"Studio Noor", category:"icons", price:2199, license:"commercial", formats:["SVG","AI","PNG","REACT"], sales:389, rating:4.8, reviews:104, seed:32, themeIdx:1 },
  { type:"icons", title:"Minimal Line Icons 240", designer:"Priya Sharma", category:"icons", price:1799, license:"commercial", formats:["SVG","AI","PNG"], sales:456, rating:4.7, reviews:134, seed:33, themeIdx:2 },
  { type:"icons", title:"Bold Solid Icon Set", designer:"Rohan Verma", category:"icons", price:1499, license:"personal", formats:["SVG","PNG"], sales:523, rating:4.5, reviews:158, seed:34, themeIdx:3 },
  { type:"icons", title:"Duotone Icon Library", designer:"Studio Blaze", category:"icons", price:2999, license:"extended", formats:["SVG","AI","FIGMA"], sales:178, rating:4.9, reviews:56, seed:35, themeIdx:6 },
  { type:"icons", title:"Rounded Icon Kit 200+", designer:"Kavya Nair", category:"icons", price:1999, license:"commercial", formats:["SVG","AI","PNG"], sales:312, rating:4.6, reviews:89, seed:36, themeIdx:4 },
  { type:"icons", title:"Neon Glow Icon Pack", designer:"Arjun Mehta", category:"icons", price:2499, license:"commercial", formats:["SVG","PNG","AI"], sales:234, rating:4.8, reviews:71, seed:37, themeIdx:8 },

  // ── FONTS (6) ─────────────────────────────────────────
  { type:"typeface", title:"Planar Variable Typeface", designer:"Fonts by Rao", category:"fonts", price:1499, license:"commercial", formats:["OTF","WOFF2","TTF"], sales:567, rating:4.8, reviews:167, seed:38, themeIdx:1, name:"Planar" },
  { type:"typeface", title:"Meridian Serif Family", designer:"Mehta Type Co", category:"fonts", price:2199, license:"commercial", formats:["OTF","WOFF2"], sales:312, rating:4.7, reviews:89, seed:39, themeIdx:0, name:"Meridian" },
  { type:"typeface", title:"Soleil Sans Typeface", designer:"Fonts by Rao", category:"fonts", price:1799, license:"commercial", formats:["OTF","WOFF2","TTF"], sales:445, rating:4.6, reviews:124, seed:40, themeIdx:3, name:"Soleil" },
  { type:"typeface", title:"Nova Display Font", designer:"Studio Noor", category:"fonts", price:2499, license:"extended", formats:["OTF","WOFF2","WOFF"], sales:178, rating:4.9, reviews:52, seed:41, themeIdx:5, name:"Nova" },
  { type:"typeface", title:"Forest Mono Typeface", designer:"Kavya Nair", category:"fonts", price:1299, license:"personal", formats:["OTF","TTF"], sales:623, rating:4.4, reviews:189, seed:42, themeIdx:2, name:"Forest" },
  { type:"typeface", title:"Dusk Condensed Font", designer:"Rohan Verma", category:"fonts", price:1999, license:"commercial", formats:["OTF","WOFF2","TTF"], sales:234, rating:4.7, reviews:67, seed:43, themeIdx:7, name:"Dusk" },

  // ── ILLUSTRATIONS (6) ─────────────────────────────────
  { type:"illustration", title:"Geometric Abstract Vol.1", designer:"Kavya Nair", category:"illustrations", price:2499, license:"commercial", formats:["SVG","AI","EPS","PNG"], sales:189, rating:4.8, reviews:56, seed:0, themeIdx:0 },
  { type:"illustration", title:"Dot Art Collection", designer:"Studio Blaze", category:"illustrations", price:1999, license:"commercial", formats:["SVG","AI","PNG"], sales:234, rating:4.6, reviews:71, seed:1, themeIdx:3 },
  { type:"illustration", title:"Overlapping Shapes Set", designer:"Priya Sharma", category:"illustrations", price:2999, license:"extended", formats:["SVG","AI","EPS"], sales:98, rating:4.9, reviews:31, seed:2, themeIdx:2 },
  { type:"illustration", title:"Wave Forms Abstract Pack", designer:"Rohan Verma", category:"illustrations", price:1799, license:"commercial", formats:["SVG","AI","PNG"], sales:312, rating:4.5, reviews:89, seed:3, themeIdx:5 },
  { type:"illustration", title:"Hex Grid Pattern Set", designer:"Arjun Mehta", category:"illustrations", price:2199, license:"commercial", formats:["SVG","AI","EPS"], sales:156, rating:4.7, reviews:45, seed:4, themeIdx:7 },
  { type:"illustration", title:"Diamond Spiral Art", designer:"Studio Noor", category:"illustrations", price:3499, license:"extended", formats:["SVG","AI","EPS","PNG"], sales:67, rating:5.0, reviews:22, seed:5, themeIdx:8 },

  // ── MOCKUPS (6) ───────────────────────────────────────
  { type:"mockup", title:"Device Mockup Bundle", designer:"Ravi Kumar", category:"mockups", price:2999, license:"commercial", formats:["PSD","FIGMA","PNG"], sales:445, rating:4.8, reviews:134, seed:50, themeIdx:1 },
  { type:"mockup", title:"MacBook Pro Mockup Kit", designer:"Priya Sharma", category:"mockups", price:2499, license:"commercial", formats:["PSD","FIGMA"], sales:389, rating:4.7, reviews:112, seed:51, themeIdx:0 },
  { type:"mockup", title:"iPhone 16 Screen Mockups", designer:"Studio Blaze", category:"mockups", price:1999, license:"commercial", formats:["PSD","PNG","FIGMA"], sales:512, rating:4.6, reviews:156, seed:52, themeIdx:2 },
  { type:"mockup", title:"Responsive Web Mockup Set", designer:"Arjun Mehta", category:"mockups", price:3499, license:"extended", formats:["PSD","FIGMA","PNG"], sales:178, rating:4.9, reviews:54, seed:53, themeIdx:5 },
  { type:"mockup", title:"Dark Theme Device Bundle", designer:"Kavya Nair", category:"mockups", price:2799, license:"commercial", formats:["PSD","FIGMA"], sales:234, rating:4.8, reviews:71, seed:54, themeIdx:8 },
  { type:"mockup", title:"Branding Mockup Toolkit", designer:"Rohan Verma", category:"mockups", price:3999, license:"extended", formats:["PSD","FIGMA","AI","PNG"], sales:134, rating:4.9, reviews:42, seed:55, themeIdx:4 },
]

// ── Export ────────────────────────────────────────────────────────────────────

export type MockProduct = Product & {
  categorySlug: string
  svgNode: React.ReactNode
}

export const MOCK_PRODUCTS: MockProduct[] = ENTRIES.map((e, i) => ({
  id: `mock-${i}`,
  title: e.title,
  price: e.price,
  preview_urls: [],
  license_type: e.license,
  product_type: "digital",
  file_formats: e.formats,
  total_sales: e.sales,
  seller: { username: e.designer, avatar_url: null },
  avg_rating: e.rating,
  review_count: e.reviews,
  categorySlug: e.category,
  svgNode: makeSVG(e),
}))

export const MOCK_CATEGORIES = [
  { id: "mock-cat-1", name: "Logo Design",     slug: "logos"         },
  { id: "mock-cat-2", name: "Posters",          slug: "posters"       },
  { id: "mock-cat-3", name: "UI Kits",          slug: "ui-kits"       },
  { id: "mock-cat-4", name: "Icon Sets",        slug: "icons"         },
  { id: "mock-cat-5", name: "Fonts",            slug: "fonts"         },
  { id: "mock-cat-6", name: "Illustrations",    slug: "illustrations" },
  { id: "mock-cat-7", name: "Mockups",          slug: "mockups"       },
]
