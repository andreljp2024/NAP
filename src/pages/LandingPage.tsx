import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Template1 from './landing/Template1';
import Template2 from './landing/Template2';
import Template3 from './landing/Template3';
import { Settings2, Smartphone, ShieldCheck } from 'lucide-react';

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState<1 | 2 | 3>(1);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      {activeTemplate === 1 && <Template1 />}
      {activeTemplate === 2 && <Template2 />}
      {activeTemplate === 3 && <Template3 />}

      {/* Floating Quick Navigation & Demo Switcher */}
      <div className="fixed bottom-5 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2 max-w-[95vw]">
        {isConfigOpen && (
          <div className="bg-slate-900/95 backdrop-blur-md p-2 rounded-2xl border border-white/10 shadow-2xl flex gap-1.5 animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => { setActiveTemplate(1); setIsConfigOpen(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTemplate === 1 ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              1. Tech Dark
            </button>
            <button 
              onClick={() => { setActiveTemplate(2); setIsConfigOpen(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTemplate === 2 ? 'bg-purple-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              2. Gamer Vibrant
            </button>
            <button 
              onClick={() => { setActiveTemplate(3); setIsConfigOpen(false); }}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all ${activeTemplate === 3 ? 'bg-emerald-600 text-white shadow-md' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
            >
              3. Clean Family
            </button>
          </div>
        )}
        
        <div className="bg-slate-950/90 backdrop-blur-xl border border-white/10 shadow-2xl rounded-full p-1.5 flex items-center gap-1.5">
          <Link
            to="/portal"
            className="bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full font-bold text-xs sm:text-sm shadow-md shadow-blue-600/30 flex items-center gap-1.5 hover:scale-105 active:scale-95 transition-all"
            title="Acessar Portal do Cliente (PWA)"
          >
            <Smartphone size={15} />
            <span>Portal do Cliente</span>
          </Link>

          <Link
            to="/admin"
            className="text-slate-300 hover:text-white hover:bg-white/10 px-3.5 py-2 rounded-full font-bold text-xs sm:text-sm flex items-center gap-1.5 transition-all"
            title="Acessar Painel Operador / Admin"
          >
            <ShieldCheck size={15} className="text-emerald-400" />
            <span className="hidden sm:inline">Painel</span> Admin
          </Link>

          <button 
            onClick={() => setIsConfigOpen(!isConfigOpen)}
            className="text-slate-400 hover:text-white hover:bg-white/10 px-3 py-2 rounded-full font-bold text-xs flex items-center gap-1.5 transition-all"
            title="Alternar Tema da Landing Page"
          >
            <Settings2 size={14} />
            <span className="hidden md:inline">Mudar Tema</span>
          </button>
        </div>
      </div>
    </>
  );
}
