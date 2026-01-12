import React, { useState, useEffect } from 'react';
import Sidebar from '../components/Sidebar';
import Header from '../components/Header';
import { usePlantData } from '../hooks/usePlantData';
import { ConnectionStatusBanner } from '../components/dashboard/ConnectionStatusBanner';
import '../kensan.css';

// ==============================================================================
// 1. VISUALISATIE CONFIGURATIE (Coördinaten & Kleuren)
// ==============================================================================
const machineZones = {
  magazijn: { top: '350px', left: '50px', width: '200px', height: '220px', label: "MAGAZIJN" },
  kraan:    { top: '400px', left: '380px', width: '150px', height: '150px', label: "KRAAN ZONE" }, 
  oven:     { top: '150px', left: '280px', width: '300px', height: '200px', label: "OVEN & ZAAG" },
  loopband: { top: '100px', right: '50px', width: '140px', height: '480px', label: "SORTEERLIJN" } 
};

const blokjePosities: { [key: string]: React.CSSProperties } = {
  magazijn_stelling: { top: '390px', left: '170px' },   
  magazijn_uitgifte: { top: '500px', left: '220px' },  
  kraan_haalt_op: { top: '475px', left: '410px' }, 
  bij_oven_invoer: { top: '220px', left: '330px' },
  in_oven: { top: '220px', left: '400px' },
  na_oven_zaag: { top: '220px', left: '520px' },
  op_band: { top: '240px', left: '720px' }, 
  check_band: { top: '450px', left: '720px' }, 
  retour_kraan: { top: '520px', left: '530px' },
};

// ==============================================================================
// 2. SUB-COMPONENTEN (Styling match met Dashboard kaarten)
// ==============================================================================

const PlantCard = ({ title, status, children, className = "" }: any) => (
  <div className={`kensan-status-card ${className}`}>
    <div className="kensan-card-header">
      <h3 className="kensan-card-title">{title}</h3>
      <span className={`kensan-status-badge ${status ? 'online' : 'offline'}`}>
        {status ? 'ACTIEF' : 'STANDBY'}
      </span>
    </div>
    <div className="kensan-card-content">
      {children}
    </div>
  </div>
);

const MachineBlock = ({ zone, status, isActive }: { zone: any, status: string, isActive: boolean }) => (
  <div className="absolute flex flex-col items-center justify-center font-bold text-sm transition-all duration-700 rounded-2xl border-2"
    style={{ 
      top: zone.top, left: zone.left, width: zone.width, height: zone.height, 
      borderColor: isActive ? '#10b981' : '#334155', 
      backgroundColor: isActive ? 'rgba(16, 185, 129, 0.05)' : 'rgba(30, 41, 59, 0.5)', 
      color: isActive ? '#f8fafc' : '#64748b',
      zIndex: 2,
      boxShadow: isActive ? '0 0 20px -5px rgba(16, 185, 129, 0.3)' : 'none'
    }}>
    <div className="mb-1 text-[10px] tracking-widest opacity-80 uppercase">{zone.label}</div>
    <div className={`px-2 py-0.5 rounded-full text-[9px] ${isActive ? 'bg-emerald-500/20 text-emerald-400' : 'bg-slate-700 text-slate-500'}`}>
      {status}
    </div>
  </div>
);

// ==============================================================================
// 3. MAIN COMPONENT (OVERVIEW)
// ==============================================================================

export function Overview() {
  const { data, isOnline, timeUntilRefresh } = usePlantData(); 
  const [logs, setLogs] = useState<string[]>(["Initialiseren fabrieksmonitor..."]);
  const [blokjePos, setBlokjePos] = useState<React.CSSProperties>(blokjePosities.magazijn_stelling);

  // Animatie cyclus voor het product (simulatie)
  useEffect(() => {
    const locs = Object.keys(blokjePosities);
    let i = 0;
    const interval = setInterval(() => {
        setBlokjePos(blokjePosities[locs[i]]);
        setLogs(prev => [`Log: Product naar ${locs[i].replace(/_/g, ' ')}`, ...prev].slice(0, 5));
        i = (i + 1) % locs.length;
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="kensan-container">
      {/* De Sidebar met Overview als actieve item */}
      <Sidebar activeItem="overview" />

      <div className="kensan-main-content">
        {/* Header met statuskleur op basis van de oven/kraan */}
        <Header buttonColor={data?.ovenRunning && data?.craneRunning ? "green" : "red"} />

        <main className="kensan-dashboard-main">
          {/* Banner voor verbindingsstatus zoals in Dashboard */}
          <ConnectionStatusBanner isOnline={isOnline} timeUntilRefresh={timeUntilRefresh} />

          <div className="kensan-dashboard-grid">
            
            {/* LINKER KOLOM: De Grote Visualisatie (Vervangt de Chart in Dashboard) */}
            <div className="kensan-status-card xl:col-span-3 h-[750px] relative overflow-hidden bg-slate-950/50">
                <div className="kensan-card-header">
                    <h3 className="kensan-card-title text-blue-400">LIVE PLANT VISUALISATIE</h3>
                    <div className="flex gap-2">
                        <span className="px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded text-[10px] text-blue-400 font-mono">
                            CAMERA: TOP_VIEW
                        </span>
                    </div>
                </div>

                <div className="relative w-full h-full p-4">
                    {/* Grid Achtergrond */}
                    <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-[0.05]">
                        <defs>
                            <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                                <path d="M 40 0 L 0 0 0 40" fill="none" stroke="white" strokeWidth="1" />
                            </pattern>
                        </defs>
                        <rect width="100%" height="100%" fill="url(#grid)" />
                    </svg>

                    {/* Machine Blocks */}
                    <MachineBlock zone={machineZones.magazijn} status={data?.warehouseRunning ? "RUNNING" : "IDLE"} isActive={!!data?.warehouseRunning} />
                    <MachineBlock zone={machineZones.oven} status={data?.ovenStatus || "READY"} isActive={!!data?.ovenRunning} />
                    <MachineBlock zone={machineZones.loopband} status={data?.conveyerRunning ? "MOVING" : "IDLE"} isActive={!!data?.conveyerRunning} />

                    {/* Product Blokje */}
                    <div className="absolute transition-all duration-1000 ease-in-out border-2 border-white shadow-[0_0_20px_rgba(59,130,246,0.5)] z-30"
                        style={{ 
                            width: '36px', height: '36px', backgroundColor: '#3b82f6', 
                            borderRadius: '8px', transform: 'translate(-50%, -50%)', ...blokjePos 
                        }}>
                        <div className="w-full h-full flex items-center justify-center">
                            <div className="w-1.5 h-1.5 bg-white rounded-full animate-ping"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RECHTER KOLOM: Status en Informatie */}
            <div className="xl:col-span-1 flex flex-col gap-6">
                
                {/* Voorraad Kaart (Grootte match met WarehouseDetails) */}
                <div className="kensan-status-card flex-1">
                    <div className="kensan-card-header border-none">
                        <h3 className="kensan-card-title uppercase text-[10px] tracking-widest text-slate-500">Actuele Voorraad</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center h-full py-10">
                        <div className="text-8xl font-black text-white tracking-tighter tabular-nums drop-shadow-2xl">
                            {data?.warehouseStock || 0}
                        </div>
                        <div className="mt-4 px-4 py-1 bg-blue-600/20 border border-blue-500/30 rounded-full text-blue-400 text-[10px] font-bold uppercase tracking-widest">
                            STUKS IN MAGAZIJN
                        </div>
                    </div>
                </div>

                {/* Live Log Paneel */}
                <div className="kensan-status-card h-[300px]">
                    <div className="kensan-card-header">
                        <h3 className="kensan-card-title">SYSTEEM LOGS</h3>
                    </div>
                    <div className="space-y-3 font-mono text-[11px] overflow-y-auto max-h-[220px] pr-2 custom-scrollbar">
                        {logs.map((log, i) => (
                            <div key={i} className={`flex items-start gap-3 border-l-2 pl-3 py-1 ${i === 0 ? 'border-blue-500 text-white bg-blue-500/5' : 'border-slate-800 text-slate-500'}`}>
                                <span className="opacity-40">{new Date().toLocaleTimeString([], {hour12: false})}</span>
                                <span>{log}</span>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
          </div>
        </main>
      </div>
    </div>
  );
}