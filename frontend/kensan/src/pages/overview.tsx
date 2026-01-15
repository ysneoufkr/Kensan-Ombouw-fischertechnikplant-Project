import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { usePlantData } from '../hooks/usePlantData';
import '../kensan.css';

// ==============================================================================
// 1. CONFIGURATIE & COORDINATEN
// ==============================================================================

// Het industriële kleurenpalet (Rood/Zwart)
const THEME = {
  bg: '#050505',       // Bijna zwart
  panel: '#0a0a0a',    // Iets lichter zwart voor panelen
  border: '#333',      // Donkergrijs voor randen
  accent: '#ff0000',   // Fel rood
  dimRed: 'rgba(255, 0, 0, 0.1)',
  text: '#e5e5e5',
  success: '#00ff00'   // Alleen voor "Online" status
};

// De exacte posities op het scherm voor de animatie
const COORDS = {
  magazijn: { x: 100, y: 400 },
  kraan_rust: { x: 400, y: 450 },
  oven_in: { x: 300, y: 200 },
  oven_uit: { x: 450, y: 200 },
  band_start: { x: 700, y: 200 },
  band_eind: { x: 700, y: 500 },
};

// De stappen van het proces (State Machine)
type ProcessStep = 
  | 'RUST' 
  | 'OPHALEN_MAGAZIJN' 
  | 'NAAR_OVEN' 
  | 'IN_OVEN' 
  | 'NAAR_BAND' 
  | 'OP_BAND' 
  | 'OPHALEN_BAND' 
  | 'TERUG_MAGAZIJN';

// ==============================================================================
// 2. VISUELE MACHINE COMPONENTEN (SVG)
// ==============================================================================

// 2.1 Het Magazijn (Raster structuur)
const MagazijnVisual = ({ isActive }: { isActive: boolean }) => (
  <g transform="translate(20, 300)">
    <rect x="0" y="0" width="160" height="200" fill="#111" stroke={isActive ? THEME.accent : "#333"} strokeWidth="2" />
    {/* Stelling vakken */}
    {[0, 40, 80, 120, 160].map(y => (
      <line key={y} x1="0" y1={y} x2="160" y2={y} stroke="#333" strokeWidth="1" />
    ))}
    {[0, 53, 106, 160].map(x => (
      <line key={x} x1={x} y1="0" x2={x} y2="200" stroke="#333" strokeWidth="1" />
    ))}
    <text x="80" y="-15" textAnchor="middle" fill={isActive ? THEME.accent : "#555"} fontSize="12" fontWeight="bold">MAGAZIJN</text>
    {isActive && <circle cx="150" cy="10" r="4" fill="red" className="animate-ping" />}
  </g>
);

// 2.2 De Oven (Hittekamer)
const OvenVisual = ({ isActive }: { isActive: boolean }) => (
  <g transform="translate(250, 100)">
    {/* Behuizing */}
    <rect x="0" y="0" width="200" height="120" fill="#111" stroke={isActive ? "orange" : "#333"} strokeWidth="3" rx="5" />
    {/* Het venster */}
    <rect x="50" y="30" width="100" height="60" fill={isActive ? "rgba(255, 69, 0, 0.3)" : "#000"} stroke="#333" />
    {/* Verwarmingselementen animatie */}
    {isActive && (
      <path d="M 60 60 Q 85 40 110 60 T 160 60" stroke="orange" strokeWidth="2" fill="none" className="animate-pulse" />
    )}
    <text x="100" y="-15" textAnchor="middle" fill={isActive ? "orange" : "#555"} fontSize="12" fontWeight="bold">OVEN</text>
  </g>
);

// 2.3 De Loopband (Transport)
const LoopbandVisual = ({ isActive }: { isActive: boolean }) => (
  <g transform="translate(650, 100)">
    {/* De band zelf */}
    <rect x="0" y="0" width="100" height="450" fill="#1a1a1a" stroke={isActive ? THEME.accent : "#333"} strokeWidth="2" />
    {/* Rollers */}
    {[50, 100, 150, 200, 250, 300, 350, 400].map(y => (
      <line key={y} x1="10" y1={y} x2="90" y2={y} stroke="#333" strokeWidth="2" />
    ))}
    {/* Richting pijlen animatie */}
    {isActive && (
      <g className="animate-bounce">
        <path d="M 50 20 L 40 10 H 60 Z" fill={THEME.accent} transform="rotate(180 50 20)" />
      </g>
    )}
    <text x="50" y="-15" textAnchor="middle" fill={isActive ? THEME.accent : "#555"} fontSize="12" fontWeight="bold">SORTEERLIJN</text>
  </g>
);

// 2.4 De Kraan (Centraal punt)
const KraanVisual = ({ rotatie, isActive }: { rotatie: number, isActive: boolean }) => (
  <g transform="translate(400, 450)">
    {/* Base */}
    <circle cx="0" cy="0" r="30" fill="#111" stroke="#333" strokeWidth="2" />
    {/* De draaiende arm */}
    <g transform={`rotate(${rotatie})`} style={{ transition: 'transform 1s ease-in-out' }}>
        {/* Arm structuur */}
        <rect x="-10" y="-180" width="20" height="180" fill="#222" stroke={isActive ? THEME.accent : "#444"} />
        {/* Contragewicht */}
        <rect x="-15" y="10" width="30" height="40" fill="#111" stroke="#333" />
        {/* Loopkat */}
        <rect x="-12" y="-160" width="24" height="30" fill={THEME.accent} />
    </g>
    <circle cx="0" cy="0" r="5" fill="red" />
  </g>
);

// ==============================================================================
// 3. HOOFDCOMPONENT
// ==============================================================================

export function Overview() {
  const { data, isOnline } = usePlantData();
  
  // State voor de simulatie cyclus
  const [step, setStep] = useState<ProcessStep>('RUST');
  const [productPos, setProductPos] = useState({ x: COORDS.magazijn.x, y: COORDS.magazijn.y, opacity: 1 });
  const [kraanRotatie, setKraanRotatie] = useState(0);
  const [logs, setLogs] = useState<string[]>([]);

  // Functie om logs toe te voegen
  const addLog = (msg: string) => {
    setLogs(prev => [`[${new Date().toLocaleTimeString()}] ${msg}`, ...prev].slice(0, 6));
  };

  // ============================================================================
  // DE PROCESS LOOP (De logica die de stappen volgt)
  // ============================================================================
  useEffect(() => {
    let timeout: NodeJS.Timeout;

    const runCycle = () => {
      switch (step) {
        case 'RUST':
          // Start de cyclus
          timeout = setTimeout(() => {
            addLog("Nieuwe order ontvangen. Start proces.");
            setStep('OPHALEN_MAGAZIJN');
          }, 2000);
          break;

        case 'OPHALEN_MAGAZIJN':
          // Kraan draait naar magazijn (-90 graden)
          setKraanRotatie(-90);
          timeout = setTimeout(() => {
            addLog("Kraan pakt product uit magazijn.");
            // Product springt naar kraan
            setProductPos({ ...COORDS.magazijn, opacity: 1 });
            setStep('NAAR_OVEN');
          }, 2000);
          break;

        case 'NAAR_OVEN':
          // Kraan draait naar oven (0 graden, boven)
          setProductPos({ ...COORDS.magazijn, opacity: 0 }); // Verberg even tijdens draaien (optioneel)
          setKraanRotatie(0);
          timeout = setTimeout(() => {
            addLog("Product geplaatst in oven.");
            setProductPos({ ...COORDS.oven_in, opacity: 1 });
            setStep('IN_OVEN');
          }, 2000);
          break;

        case 'IN_OVEN':
          // Wachten (bakken)
          timeout = setTimeout(() => {
            addLog("Oven proces voltooid (300°C).");
            setProductPos({ ...COORDS.oven_uit, opacity: 1 });
            setStep('NAAR_BAND');
          }, 3000);
          break;

        case 'NAAR_BAND':
          // Product schuift van oven naar band
          timeout = setTimeout(() => {
            addLog("Product verplaatst naar lopende band.");
            setProductPos({ ...COORDS.band_start, opacity: 1 });
            setStep('OP_BAND');
          }, 1500);
          break;

        case 'OP_BAND':
          // Product beweegt over de band (CSS transitie doet het werk)
          // We zetten hier de eindpositie, de transition time zorgt voor de beweging
          setProductPos({ ...COORDS.band_eind, opacity: 1 });
          timeout = setTimeout(() => {
            addLog("Product gearriveerd bij sorteer-einde.");
            setStep('OPHALEN_BAND');
          }, 3000); // Duurt even lang als de band loopt
          break;

        case 'OPHALEN_BAND':
          // Kraan draait naar band (90 graden)
          setKraanRotatie(90);
          timeout = setTimeout(() => {
            addLog("Kraan pakt gesorteerd product.");
            setStep('TERUG_MAGAZIJN');
          }, 2000);
          break;

        case 'TERUG_MAGAZIJN':
          // Kraan draait terug naar magazijn (-90 graden)
          setProductPos({ ...COORDS.band_eind, opacity: 0 }); // Opgetild
          setKraanRotatie(-90);
          timeout = setTimeout(() => {
            addLog("Product teruggeplaatst in opslag. Cyclus klaar.");
            setProductPos({ ...COORDS.magazijn, opacity: 1 });
            setStep('RUST');
          }, 2500);
          break;
      }
    };

    runCycle();
    return () => clearTimeout(timeout);
  }, [step]);

  // ============================================================================
  // RENDER
  // ============================================================================
  return (
    <div className="kensan-container" style={{ backgroundColor: THEME.bg, minHeight: '100vh', display: 'flex', width: '100%', fontFamily: 'monospace' }}>
      <Sidebar activeItem="overview" />

      <div className="kensan-main-content" style={{ flex: 1, display: 'flex', flexDirection: 'column', backgroundColor: THEME.bg }}>
        <Header buttonColor={isOnline ? "green" : "red"} />

        <main className="p-6 overflow-y-auto" style={{ backgroundColor: THEME.bg, color: THEME.text }}>
          
          {/* Top Bar */}
          <div className="flex justify-between items-center mb-8 border-b border-gray-800 pb-4">
            <div>
              <h1 className="text-3xl font-black text-red-600 tracking-tighter uppercase">FACTORY OVERVIEW</h1>
              <div className="flex items-center gap-2 mt-1">
                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></span>
                <span className="text-xs text-gray-500 uppercase">Live Simulation Sequence</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-white">{data?.warehouseStock || 0}</div>
              <div className="text-xs text-gray-500 uppercase">Totaal in Opslag</div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* LINKERKANT: De Grote Visualisatie */}
            <div className="lg:col-span-2 relative bg-[#0a0a0a] border border-[#333] rounded-xl h-[700px] shadow-2xl overflow-hidden">
              {/* SVG Canvas voor de machines */}
              <svg className="w-full h-full absolute top-0 left-0">
                <defs>
                  <pattern id="grid" width="50" height="50" patternUnits="userSpaceOnUse">
                    <path d="M 50 0 L 0 0 0 50" fill="none" stroke="#1a1a1a" strokeWidth="1" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid)" />

                {/* Verbindingslijnen (Pijlen) - Rood en subtiel */}
                <path d="M 180 400 Q 400 400 400 450" stroke="#222" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <path d="M 400 450 L 400 220" stroke="#222" strokeWidth="2" fill="none" strokeDasharray="5,5" />
                <path d="M 450 200 L 700 200" stroke="#222" strokeWidth="2" fill="none" strokeDasharray="5,5" />

                {/* De Machines */}
                <MagazijnVisual isActive={step === 'OPHALEN_MAGAZIJN' || step === 'TERUG_MAGAZIJN'} />
                <OvenVisual isActive={step === 'IN_OVEN'} />
                <LoopbandVisual isActive={step === 'OP_BAND'} />
                <KraanVisual rotatie={kraanRotatie} isActive={['OPHALEN_MAGAZIJN', 'NAAR_OVEN', 'OPHALEN_BAND', 'TERUG_MAGAZIJN'].includes(step)} />

              </svg>

              {/* HET PRODUCT (Blokje) - Dit is een HTML div die over de SVG zweeft voor soepele CSS transities */}
              <div 
                style={{
                  position: 'absolute',
                  left: productPos.x,
                  top: productPos.y,
                  opacity: productPos.opacity,
                  width: '40px',
                  height: '40px',
                  backgroundColor: '#000',
                  border: `2px solid ${THEME.accent}`,
                  boxShadow: `0 0 15px ${THEME.accent}`,
                  borderRadius: '4px',
                  transform: 'translate(-50%, -50%)',
                  transition: 'left 1.5s ease-in-out, top 1.5s ease-in-out, opacity 0.3s',
                  zIndex: 50,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <div className="w-2 h-2 bg-red-500 rounded-full animate-ping"></div>
              </div>

              {/* Status Overlay linksboven */}
              <div className="absolute top-4 left-4 bg-black/80 border border-red-900/30 p-3 rounded text-xs font-mono text-red-400">
                STATUS: {step.replace('_', ' ')}
              </div>
            </div>

            {/* RECHTERKANT: Logs & Info */}
            <div className="flex flex-col gap-6">
              
              {/* Event Log */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-6 h-[400px] flex flex-col">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest border-b border-gray-800 pb-2">Systeem Logs</h3>
                <div className="flex-1 overflow-hidden relative">
                  <div className="absolute inset-0 overflow-y-auto space-y-3 pr-2 custom-scrollbar">
                    {logs.map((log, i) => (
                      <div key={i} className="text-xs font-mono border-l-2 border-red-600 pl-3 py-1 text-gray-400 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="text-red-500 block text-[10px] mb-0.5 opacity-70">{log.split(']')[0]}]</span>
                        {log.split(']')[1]}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Machine Status Cards */}
              <div className="bg-[#0a0a0a] border border-[#333] rounded-xl p-6 flex-1">
                <h3 className="text-sm font-bold text-gray-400 uppercase mb-4 tracking-widest">Component Status</h3>
                <div className="space-y-4">
                  <StatusRow label="Magazijn" active={step.includes('MAGAZIJN')} />
                  <StatusRow label="Kraan" active={step.includes('OPHALEN') || step.includes('NAAR')} />
                  <StatusRow label="Oven" active={step === 'IN_OVEN'} />
                  <StatusRow label="Loopband" active={step === 'OP_BAND'} />
                </div>
              </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

// Klein hulpcomponentje voor de status lijst
const StatusRow = ({ label, active }: { label: string, active: boolean }) => (
  <div className="flex justify-between items-center p-3 bg-black/40 rounded border border-gray-900">
    <span className="text-xs font-bold text-gray-300 uppercase">{label}</span>
    <div className={`flex items-center gap-2 text-[10px] font-bold ${active ? 'text-red-500' : 'text-gray-700'}`}>
      {active ? 'ACTIEF' : 'STANDBY'}
      <div className={`w-2 h-2 rounded-full ${active ? 'bg-red-500 animate-pulse shadow-[0_0_8px_red]' : 'bg-gray-800'}`}></div>
    </div>
  </div>
);