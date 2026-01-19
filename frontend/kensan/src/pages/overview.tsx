import React, { useState, useEffect, useRef } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { usePlantData } from '../hooks/usePlantData';
import '../kensan.css';

// ==============================================================================
// 0. CONFIGURATIE & STYLING
// ==============================================================================

const THEME = {
  bg: '#121212',
  alu: '#525252',
  ft_red: '#dc2626',
  ft_black: '#171717',
  conveyor: '#262626',
  active: '#22c55e',
  heating: '#ef4444', 
  sensor: '#eab308',
  pneumatic: '#3b82f6',
  accent_orange: '#f97316'
};

const Beam = ({ x, y, w, h, vertical = false }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect width={w} height={h} fill={THEME.alu} stroke="#000" strokeWidth="0.5" />
    <line x1={vertical?w/2:0} y1={vertical?0:h/2} x2={vertical?w/2:w} y2={vertical?h:h/2} stroke="#333" strokeWidth="1" />
  </g>
);

const Canopy = ({ x, y, width }) => (
    <g transform={`translate(${x}, ${y})`}>
        <path d={`M 0 15 L 5 0 L ${width-5} 0 L ${width} 15`} fill="#333" stroke="#555" opacity="0.9" />
        <rect x="5" y="15" width={width-10} height="2" fill="#facc15" /> 
    </g>
);

// ==============================================================================
// 1. MAGAZIJN (LINKS)
// ==============================================================================
const Warehouse = ({ x, y, craneY, armX, hasBlock }) => (
  <g transform={`translate(${x}, ${y})`}>
    <g>
      <rect x="-5" y="0" width="30" height="280" fill="#111" stroke="#333" />
      <Beam x={0} y={0} w={4} h={280} vertical />
      <Beam x={20} y={0} w={4} h={280} vertical />
    </g>
    <g transform="translate(40, 0)">
      <Beam x={0} y={0} w={4} h={230} vertical />
      <Beam x={30} y={0} w={4} h={230} vertical />
      {[0, 1, 2].map((i) => (
         <g key={i} transform={`translate(6, ${i * 50 + 30})`}>
             <rect width="22" height="18" rx="1" fill="#1a1a1a" stroke="#444" />
             <text x="11" y="12" fontSize="6" fill="#555" textAnchor="middle">{3-i}</text>
         </g>
      ))}
      {[0, 1, 2].map(i => <Beam key={i} x={4} y={i * 50 + 48} w={26} h={3} />)}
    </g>
    <g transform="translate(20, 240)">
        <Canopy x="-10" y="-18" width="50" />
        <rect width="50" height="10" fill={THEME.conveyor} />
    </g>
    
    {/* KRAAN */}
    <g transform={`translate(0, ${craneY})`}> 
      {/* Arm (Achter de body) */}
      <g transform={`translate(${armX}, 8)`}>
        <rect x="0" y="2" width="40" height="5" fill="#ccc" stroke="#666" />
        <rect x="35" y="0" width="6" height="9" fill="#fff" />
        {hasBlock && <rect x="30" y="-5" width="10" height="10" fill="#fff" stroke="#666" />}
      </g>
      {/* Body */}
      <rect x="-5" y="0" width="34" height="25" fill={THEME.ft_red} rx="2" stroke="#000" />
    </g>
  </g>
);

// ==============================================================================
// 2. ROBOT (MIDDEN)
// ==============================================================================
const Robot = ({ x, y, angle, reach, hasBlock }) => (
  <g transform={`translate(${x}, ${y})`}>
    <rect x="-30" y="-30" width="60" height="60" fill="#111" stroke="#333" rx="8" />
    <circle r="25" fill="#222" stroke="#444" />
    <g transform={`rotate(${angle})`}>
      <rect x="-12" y="-12" width="24" height="24" rx="2" fill="#333" />
      <rect x="-8" y="-80" width="16" height="80" rx="2" fill={THEME.ft_red} stroke="#990000" />
      <g transform={`translate(0, -${reach})`}>
        <rect x="-3" y="-85" width="6" height="60" fill="#ccc" />
        <g transform="translate(0, -85)">
          <rect x="-8" y="-8" width="16" height="10" fill="#222" />
          <circle cx="0" cy="-8" r="4" fill={THEME.pneumatic} />
          {hasBlock && <rect x="-5" y="-18" width="10" height="10" fill="#fff" stroke="#666" />}
        </g>
      </g>
    </g>
  </g>
);

// ==============================================================================
// 3. PRODUCTIE & SORTEER LIJN (RECHTS)
// ==============================================================================
const ProductionLine = ({ 
  x, y, 
  ovenState, sawState, 
  lineProgress, 
  pistonActiveIndex, pistonExtension,
  blockInBin 
}) => {
    
    let bx = -100, by = -100;
    let isVisible = true;
    
    if (lineProgress > 0) {
        if (lineProgress <= 30) { 
            // FASE 1: Oven In (-15 -> 25)
            bx = -15 + (lineProgress / 30) * 40; 
            by = 30;
            if (lineProgress > 20 && ovenState.heating) isVisible = false;
        } else if (lineProgress <= 60) { 
            // FASE 2: Naar Zaag (25 -> 125)
            const p = (lineProgress - 30) / 30;
            bx = 25 + p * 100; 
            by = 30;
        } else if (lineProgress <= 100) { 
            // FASE 3: Naar Band (125 -> 175) en Omlaag
            const p = (lineProgress - 60) / 40;
            if (p < 0.25) {
                const subP = p / 0.25;
                bx = 125 + subP * 50; 
                by = 30;
            } else {
                const subP = (p - 0.25) / 0.75;
                bx = 175;
                if (pistonExtension > 0) bx -= pistonExtension; 
                by = 30 + subP * 320;
            }
        }
    }

    return (
      <g transform={`translate(${x}, ${y})`}>
        <rect x="-20" y="30" width="20" height="10" fill={THEME.conveyor} />
        <g transform="translate(0, 0)">
            <rect width="60" height="50" fill="#222" stroke="#444" />
            <text x="30" y="-8" fontSize="6" fill="#666" textAnchor="middle">OVEN</text>
            <rect x="5" y="5" width="50" height="40" fill={ovenState.heating ? THEME.heating : "#000"} className={ovenState.heating ? "animate-pulse" : ""} />
            <g style={{ transition: 'transform 0.5s', transform: ovenState.open ? 'translateY(-30px)' : 'translateY(0)' }}>
                <rect x="2" y="2" width="56" height="46" fill="#404040" stroke="#555" />
                <rect x="25" y="20" width="6" height="6" fill="#222" rx="1" />
            </g>
        </g>
        <g transform="translate(100, 0)">
            <rect width="50" height="50" fill="none" stroke="#333" strokeDasharray="2 2" />
            <text x="25" y="-8" fontSize="6" fill="#666" textAnchor="middle">ZAAG</text>
            <rect x="0" y="30" width="50" height="10" fill={THEME.conveyor} />
            <g transform={`translate(25, ${sawState.down ? 30 : 5})`} style={{ transition: 'transform 0.2s ease-in' }}>
                <path d="M -15 0 L 15 0 L 10 -40 L -10 -40 Z" fill="#ccc" stroke="#888" />
                <path d="M -15 0 L -10 5 L -5 0 L 0 5 L 5 0 L 10 5 L 15 0" fill="#999" />
            </g>
            <rect x="15" y="-40" width="20" height="40" fill="#222" />
        </g>
        <rect x="60" y="30" width="40" height="10" fill={THEME.conveyor} />
        <rect x="150" y="30" width="35" height="10" fill={THEME.conveyor} />
        <g transform="translate(180, 35)">
            <path d="M -20 0 Q 0 0 0 15" fill="none" stroke={THEME.conveyor} strokeWidth="10" />
            <rect x="-5" y="15" width="10" height="300" fill={THEME.conveyor} stroke="#111" />
            <g transform="translate(0, 30)">
                <rect x="-10" y="0" width="20" height="6" fill="#333" stroke="#555" />
                <line x1="-10" y1="4" x2="10" y2="4" stroke="red" strokeWidth="1.5" opacity="0.8" />
            </g>
            <g transform="translate(0, 160)"> 
                {[0, 1, 2].map(i => {
                    const isMoving = pistonActiveIndex === i;
                    const currentX = isMoving ? -pistonExtension : 0; 
                    return (
                        <g key={i} transform={`translate(0, ${i * 50})`}>
                            <text x="-40" y="4" fontSize="6" fill="#666" textAnchor="end" fontWeight="bold">#{i+1}</text>
                            <rect x="-35" y="-2" width="35" height="4" fill="#2a2a2a" />
                            <g transform={`translate(${currentX}, 0)`}>
                                <rect x="5" y="-3" width="15" height="6" fill={THEME.pneumatic} />
                                <rect x="20" y="-6" width="8" height="12" fill="#333" />
                                <rect x="5" y="-6" width="2" height="12" fill="#555" />
                            </g>
                            <g transform="translate(-45, -10)">
                                <rect width="20" height="20" rx="3" fill="#222" stroke="#444" />
                                {blockInBin === i && (
                                    <rect x="5" y="5" width="10" height="10" fill={THEME.active} stroke="#fff" rx="1" />
                                )}
                            </g>
                        </g>
                    );
                })}
            </g>
        </g>
        {lineProgress > 0 && isVisible && (
             <g transform={`translate(${bx}, ${by})`}>
                 <rect x="-6" y="-6" width="12" height="12" fill={THEME.active} stroke="#fff" strokeWidth="1" rx="1" />
             </g>
        )}
      </g>
    );
};

// ==============================================================================
// HOOFD COMPONENT - MET SUPER SMOOTH ANIMATIE LOOP
// ==============================================================================

export const Overview = () => {
  const { isOnline } = usePlantData();
  const [status, setStatus] = useState("KLAAR");

  const [craneY, setCraneY] = useState(240);
  const [armX, setArmX] = useState(0);
  const [whHasBlock, setWhHasBlock] = useState(false);
  const [robAngle, setRobAngle] = useState(-90);
  const [robReach, setRobReach] = useState(0);
  const [robHasBlock, setRobHasBlock] = useState(false);
  const [ovenState, setOvenState] = useState({ open: false, heating: false });
  const [sawState, setSawState] = useState({ down: false });
  const [lineProgress, setLineProgress] = useState(0);
  const [activePiston, setActivePiston] = useState(-1);
  const [pistonExt, setPistonExt] = useState(0);
  const [blockInBin, setBlockInBin] = useState(-1);

  // Ref om animaties te cancelen als component unmount
  const requestRef = useRef();

  useEffect(() => {
    const runSequence = async () => {
      const wait = ms => new Promise(r => setTimeout(r, ms));
      
      // DEZE FUNCTIE ZORGT VOOR DE SMOOTHNESS (RequestAnimationFrame)
      const animate = (setter, start, end, duration) => {
          return new Promise(resolve => {
              const startTime = performance.now();
              
              const tick = (currentTime) => {
                  const elapsed = currentTime - startTime;
                  const progress = Math.min(elapsed / duration, 1);
                  
                  // Easing function voor nog zachtere beweging (optioneel, nu lineair)
                  const val = start + (end - start) * progress;
                  
                  setter(val);
                  
                  if (progress < 1) {
                      requestRef.current = requestAnimationFrame(tick);
                  } else {
                      resolve();
                  }
              };
              
              requestRef.current = requestAnimationFrame(tick);
          });
      };

      while(true) {
        // --- 1. MAGAZIJN UITSLAG ---
        setStatus("MAGAZIJN: OPHALEN");
        const slot = [180, 130, 80][Math.floor(Math.random()*3)];
        
        await animate(setCraneY, craneY, slot, 600); 
        await wait(100);
        await animate(setArmX, 0, 42, 400); 
        setWhHasBlock(true); await wait(150);
        await animate(setArmX, 42, 0, 400); 
        await animate(setCraneY, slot, 240, 600);

        // --- 2. ROBOT TRANSFER ---
        setStatus("ROBOT: TRANSFER");
        setWhHasBlock(false);
        // Naar Links (-90)
        await animate(setRobAngle, -90, -90, 100); // Check
        await animate(setRobReach, 0, 200, 400); 
        setRobHasBlock(true);
        await animate(setRobReach, 200, 50, 400);
        
        // Naar Rechts (0 graden = recht omhoog/rechts)
        await animate(setRobAngle, -90, 0, 800);
        await animate(setRobReach, 50, 240, 400); 
        
        setRobHasBlock(false);
        setLineProgress(1); 
        await wait(100);
        await animate(setRobReach, 240, 0, 300);

        // --- 3. OVEN PROCES ---
        setStatus("OVEN: PROCES");
        setOvenState({ open: true, heating: false }); await wait(200);
        await animate(setLineProgress, 1, 30, 800); 
        setOvenState({ open: false, heating: true }); await wait(1500);
        setOvenState({ open: true, heating: false }); await wait(200);

        // --- 4. ZAAG PROCES ---
        setStatus("ZAAG: PROCES");
        await animate(setLineProgress, 30, 60, 1000); 
        setOvenState({ open: false, heating: false });
        
        setSawState({ down: true }); await wait(200);
        await wait(600);
        setSawState({ down: false }); await wait(200);
        
        // --- 5. BAND ---
        setStatus("SORTEREN...");
        const targetPiston = Math.floor(Math.random() * 3);
        const targetProgress = 80 + (targetPiston * 8); 
        await animate(setLineProgress, 60, targetProgress, 1200);

        // --- 6. PISTON ---
        setStatus(`SORTEREN: BAKJE #${targetPiston+1}`);
        setActivePiston(targetPiston);
        await animate(setPistonExt, 0, 35, 150);
        setLineProgress(0); setBlockInBin(targetPiston);
        await animate(setPistonExt, 35, 0, 150);
        setActivePiston(-1);

        // --- 7. ROBOT PICKUP ---
        setStatus("ROBOT: OPHALEN");
        // Naar Rechts (90 graden)
        let pAngle = 90; 
        let pReach = 160; 
        if(targetPiston === 1) pReach = 150;
        if(targetPiston === 2) pReach = 140;

        await animate(setRobAngle, 0, 90, 600);
        await animate(setRobReach, 0, pReach, 400);
        
        setBlockInBin(-1);
        setRobHasBlock(true);
        await animate(setRobReach, pReach, 50, 400);

        // --- 8. RETOUR ---
        setStatus("MAGAZIJN: OPSLAAN");
        // Terug naar -90
        await animate(setRobAngle, 90, -90, 800);
        
        await animate(setRobReach, 50, 200, 400);
        setRobHasBlock(false);
        setWhHasBlock(true);
        await animate(setRobReach, 200, 0, 300);
        
        await animate(setCraneY, 240, slot, 600);
        await animate(setArmX, 0, 42, 400);
        setWhHasBlock(false); 
        await animate(setArmX, 42, 0, 400);
        await animate(setCraneY, slot, 240, 600);
      }
    };

    runSequence();
    
    // Cleanup
    return () => cancelAnimationFrame(requestRef.current);
  }, []);

  return (
    <div className="kensan-container" style={{ height: '100vh', backgroundColor: '#121212', color: '#ccc' }}>
      <Sidebar activeItem="overview" />
      <div className="kensan-main-content" style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <Header buttonColor={isOnline ? "green" : "red"} />
        
        <div className="kensan-dashboard-main" style={{ flex: 1, padding: '1rem', display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <h1 style={{ color: THEME.accent_orange, margin: 0 }}>OVERVIEW</h1>
            <div style={{ background: '#222', padding: '5px 15px', borderRadius: '4px', border: '1px solid #444' }}>
                STATUS: <span style={{ color: '#fff', fontWeight: 'bold' }}>{status}</span>
            </div>
          </div>

          <div style={{ flex: 1, background: '#080808', border: '1px solid #333', borderRadius: '8px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ position: 'absolute', inset: 0, opacity: 0.1, backgroundImage: 'linear-gradient(#444 1px, transparent 1px), linear-gradient(90deg, #444 1px, transparent 1px)', backgroundSize: '40px 40px' }} />

            <svg viewBox="100 80 600 400" style={{ width: '100%', height: '100%' }} preserveAspectRatio="xMidYMid meet">
                
                <Warehouse x={160} y={140} craneY={craneY} armX={armX} hasBlock={whHasBlock} />

                <Robot x={360} y={380} angle={robAngle} reach={robReach} hasBlock={robHasBlock} />

                <ProductionLine 
                    x={340} 
                    y={140} 
                    ovenState={ovenState} 
                    sawState={sawState} 
                    lineProgress={lineProgress}
                    pistonActiveIndex={activePiston}
                    pistonExtension={pistonExt}
                    blockInBin={blockInBin} 
                />

            </svg>
          </div>
        </div>
      </div>
    </div>
  );
};