'use client';

import React from 'react';

export default function ArtisanCraftingAnimation({ className = '' }: { className?: string }) {
  return (
    <div className={`relative w-full h-32 flex items-center justify-center overflow-hidden rounded-xl bg-gradient-to-b from-[#081a2e] via-[#0c243d] to-[#0a1e34] border border-sky-500/30 shadow-lg shadow-sky-950/40 group ${className}`}>
      
      {/* Dynamic Keyframes Animation Styles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes craftHand {
          0% {
            transform: rotate(0deg) translate(0, 0);
          }
          30% {
            transform: rotate(-7deg) translate(-2px, 1px);
          }
          60% {
            transform: rotate(5deg) translate(2px, -1px);
          }
          85% {
            transform: rotate(-4deg) translate(-1px, 2px);
          }
          100% {
            transform: rotate(0deg) translate(0, 0);
          }
        }

        @keyframes productPolish {
          0%, 100% {
            filter: drop-shadow(0 0 2px rgba(56, 189, 248, 0.4));
          }
          50% {
            filter: drop-shadow(0 0 8px rgba(245, 158, 11, 0.9));
          }
        }

        @keyframes sparkRise1 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          40% {
            opacity: 1;
            transform: translate(-6px, -12px) scale(1);
          }
          80% {
            opacity: 0.8;
            transform: translate(-10px, -22px) scale(0.8);
          }
          100% {
            opacity: 0;
            transform: translate(-14px, -30px) scale(0.2);
          }
        }

        @keyframes sparkRise2 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.3);
          }
          40% {
            opacity: 1;
            transform: translate(8px, -14px) scale(1.1);
          }
          80% {
            opacity: 0.8;
            transform: translate(14px, -24px) scale(0.7);
          }
          100% {
            opacity: 0;
            transform: translate(18px, -32px) scale(0.2);
          }
        }

        @keyframes sparkRise3 {
          0% {
            opacity: 0;
            transform: translate(0, 0) scale(0.2);
          }
          50% {
            opacity: 1;
            transform: translate(1px, -16px) scale(1);
          }
          100% {
            opacity: 0;
            transform: translate(2px, -28px) scale(0.1);
          }
        }

        @keyframes headNod {
          0%, 100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(1.5px) rotate(1deg);
          }
        }

        @keyframes gearRotate {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes lampFlicker {
          0%, 100% {
            opacity: 0.25;
          }
          50% {
            opacity: 0.4;
          }
        }

        .anim-hand {
          transform-origin: 108px 65px;
          animation: craftHand 1.6s ease-in-out infinite;
        }

        .anim-head {
          transform-origin: 120px 40px;
          animation: headNod 2.4s ease-in-out infinite;
        }

        .anim-product {
          animation: productPolish 2s ease-in-out infinite;
        }

        .anim-spark-1 {
          animation: sparkRise1 1.8s ease-out infinite;
        }

        .anim-spark-2 {
          animation: sparkRise2 2.2s ease-out 0.6s infinite;
        }

        .anim-spark-3 {
          animation: sparkRise3 1.5s ease-out 1.1s infinite;
        }

        .anim-gear {
          transform-origin: 180px 25px;
          animation: gearRotate 20s linear infinite;
        }

        .anim-lamp {
          animation: lampFlicker 3s ease-in-out infinite;
        }
      ` }} />

      {/* SVG Crafting Studio Scene */}
      <svg
        viewBox="0 0 220 120"
        className="w-full h-full select-none"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          {/* Spotlight Gradient from Lamp onto Workbench */}
          <linearGradient id="lampCone" x1="50" y1="10" x2="100" y2="90" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#38bdf8" stopOpacity="0" />
          </linearGradient>

          {/* Workbench metallic/wood gradient */}
          <linearGradient id="benchGrad" x1="20" y1="85" x2="200" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#1e3a5f" />
            <stop offset="50%" stopColor="#2a4d7a" />
            <stop offset="100%" stopColor="#162e4c" />
          </linearGradient>

          {/* Product ceramic / wood gradient */}
          <linearGradient id="productGrad" x1="85" y1="65" x2="105" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#fbbf24" />
            <stop offset="60%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#92400e" />
          </linearGradient>

          {/* Artisan clothes gradient */}
          <linearGradient id="clothGrad" x1="100" y1="45" x2="145" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#0284c7" />
            <stop offset="100%" stopColor="#0369a1" />
          </linearGradient>

          {/* Apron gradient */}
          <linearGradient id="apronGrad" x1="105" y1="55" x2="125" y2="85" gradientUnits="userSpaceOnUse">
            <stop offset="0%" stopColor="#d97706" />
            <stop offset="100%" stopColor="#78350f" />
          </linearGradient>
        </defs>

        {/* 1. Background Ambience: Subtle Gear on the wall */}
        <g className="anim-gear opacity-15">
          <circle cx="180" cy="25" r="14" stroke="#38bdf8" strokeWidth="2.5" strokeDasharray="4 2" />
          <circle cx="180" cy="25" r="6" fill="#1e3a5f" />
        </g>

        {/* 2. Hanging Workshop Lamp */}
        <line x1="60" y1="0" x2="60" y2="20" stroke="#64748b" strokeWidth="1.5" />
        <path d="M52 20 L68 20 L73 28 L47 28 Z" fill="#334155" stroke="#475569" strokeWidth="1" />
        <circle cx="60" cy="28" r="3" fill="#fbbf24" />

        {/* Light Cone beam */}
        <polygon points="60,28 15,95 130,95" fill="url(#lampCone)" className="anim-lamp" />

        {/* 3. Workbench / Crafting Table */}
        <rect x="25" y="85" width="165" height="7" rx="3" fill="url(#benchGrad)" stroke="#38bdf8" strokeWidth="0.7" strokeOpacity="0.4" />
        {/* Table legs */}
        <rect x="35" y="92" width="6" height="22" rx="1.5" fill="#152942" />
        <rect x="175" y="92" width="6" height="22" rx="1.5" fill="#152942" />

        {/* Small tools on the table */}
        <rect x="35" y="82" width="16" height="3" rx="1" fill="#64748b" />
        <rect x="42" y="78" width="2" height="4" rx="0.5" fill="#94a3b8" />
        <circle cx="160" cy="81" r="3.5" fill="#0284c7" opacity="0.7" />

        {/* 4. THE CRAFTED PRODUCT (Vase / Handicraft on Rotating Stand) */}
        {/* Turntable base */}
        <ellipse cx="90" cy="85" rx="15" ry="3" fill="#334155" stroke="#475569" strokeWidth="0.8" />
        
        {/* Crafted Pottery / Wood item */}
        <g className="anim-product">
          {/* Vase / Product silhouette */}
          <path
            d="M84 83 C82 77, 85 70, 87 66 C88 64, 92 64, 93 66 C95 70, 98 77, 96 83 Z"
            fill="url(#productGrad)"
            stroke="#fbbf24"
            strokeWidth="0.8"
          />
          {/* Top neck rim */}
          <ellipse cx="90" cy="65" rx="3" ry="1" fill="#fde68a" />
          {/* Product gloss line */}
          <path d="M87 69 Q86 76 88 81" stroke="#fef08a" strokeWidth="0.8" strokeLinecap="round" opacity="0.8" />
        </g>

        {/* 5. SPARKS / CREATIVE SHINE PARTICLES (Emitted from product) */}
        {/* Sparkle 1 */}
        <g className="anim-spark-1" style={{ transformOrigin: '90px 70px' }}>
          <path d="M90 70 L91.5 73 L94.5 74.5 L91.5 76 L90 79 L88.5 76 L85.5 74.5 L88.5 73 Z" fill="#fbbf24" />
        </g>
        {/* Sparkle 2 */}
        <g className="anim-spark-2" style={{ transformOrigin: '92px 66px' }}>
          <circle cx="92" cy="66" r="1.8" fill="#38bdf8" />
        </g>
        {/* Sparkle 3 */}
        <g className="anim-spark-3" style={{ transformOrigin: '88px 74px' }}>
          <path d="M88 74 L89 76 L91 77 L89 78 L88 80 L87 78 L85 77 L87 76 Z" fill="#fde68a" />
        </g>

        {/* 6. THE ARTISAN / MAKER */}
        {/* Stool / Seat */}
        <rect x="135" y="80" width="18" height="4" rx="2" fill="#1e293b" />
        <line x1="144" y1="84" x2="144" y2="108" stroke="#0f172a" strokeWidth="3" strokeLinecap="round" />

        {/* Artisan Legs */}
        <path d="M136 78 L126 95 L120 95" stroke="#1e3a5f" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />

        {/* Artisan Body & Apron */}
        <path
          d="M125 50 Q138 52 142 75 L125 78 Z"
          fill="url(#clothGrad)"
        />
        {/* Apron */}
        <path
          d="M118 56 Q130 57 132 76 L118 78 Z"
          fill="url(#apronGrad)"
        />
        {/* Apron strap */}
        <path d="M119 56 L124 50" stroke="#b45309" strokeWidth="1.5" strokeLinecap="round" />

        {/* Left Steady Arm (rest on desk holding product) */}
        <path
          d="M122 56 Q108 65 98 76"
          stroke="#0284c7"
          strokeWidth="4.5"
          strokeLinecap="round"
        />
        {/* Left Hand */}
        <circle cx="97" cy="77" r="2.8" fill="#fed7aa" />

        {/* Head & Face (Focused forward) */}
        <g className="anim-head">
          {/* Hair / Headwrap */}
          <circle cx="124" cy="38" r="7.5" fill="#1e293b" />
          {/* Face */}
          <circle cx="120" cy="39" r="6" fill="#fed7aa" />
          {/* Headband / Hair tuft */}
          <path d="M115 36 Q122 32 129 36" stroke="#0284c7" strokeWidth="2" strokeLinecap="round" />
          {/* Eye focused down */}
          <path d="M117 40 L119 41" stroke="#451a03" strokeWidth="1" strokeLinecap="round" />
          {/* Nose/mouth subtle */}
          <circle cx="116" cy="42" r="0.8" fill="#f97316" />
        </g>

        {/* Right Active Crafting Arm + Tool (Animated with Crafting Motion) */}
        <g className="anim-hand">
          {/* Upper arm */}
          <path
            d="M128 54 Q122 66 112 70"
            stroke="#0284c7"
            strokeWidth="4.5"
            strokeLinecap="round"
          />
          {/* Forearm & Hand */}
          <path
            d="M112 70 L98 73"
            stroke="#fed7aa"
            strokeWidth="3.2"
            strokeLinecap="round"
          />
          {/* Crafting Tool / Chisel / Stylus */}
          <line x1="102" y1="71" x2="92" y2="76" stroke="#e2e8f0" strokeWidth="1.6" strokeLinecap="round" />
          {/* Golden tool tip contacting product */}
          <circle cx="91.5" cy="76" r="1.2" fill="#fbbf24" />
        </g>

        {/* Floating Mini Badge on Top Right */}
        <g transform="translate(142, 6)">
          <rect width="66" height="15" rx="7.5" fill="#122d4a" stroke="#38bdf8" strokeWidth="0.8" strokeOpacity="0.5" />
          <circle cx="8" cy="7.5" r="2.5" fill="#10b981" />
          <text x="15" y="10.5" fill="#93c5fd" fontSize="6.5" fontWeight="bold" fontFamily="sans-serif">
            Produksi IKM
          </text>
        </g>
      </svg>

      {/* Subtle Glow Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#081a2e] via-transparent to-transparent pointer-events-none" />
      
      {/* Tiny Status Indicator Pill at the bottom */}
      <div className="absolute bottom-1.5 left-2 right-2 flex items-center justify-between px-2 text-[9px] text-sky-300/80 font-medium">
        <span className="flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
          <span>Pengrajin Aktif</span>
        </span>
        <span className="text-amber-300 font-bold font-mono">Sentra Sulut</span>
      </div>

    </div>
  );
}
