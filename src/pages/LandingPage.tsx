import React, { useState } from 'react';
import Template1 from './landing/Template1';
import Template2 from './landing/Template2';
import Template3 from './landing/Template3';
import { Settings2 } from 'lucide-react';

export default function LandingPage() {
  const [activeTemplate, setActiveTemplate] = useState<1 | 2 | 3>(1);
  const [isConfigOpen, setIsConfigOpen] = useState(false);

  return (
    <>
      {activeTemplate === 1 && <Template1 />}
      {activeTemplate === 2 && <Template2 />}
      {activeTemplate === 3 && <Template3 />}

      {/* Floating Demo Switcher */}
      <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-[100] flex flex-col items-center gap-2">
        {isConfigOpen && (
          <div className="bg-white p-2 rounded-2xl shadow-2xl border border-slate-200 flex gap-2 animate-in slide-in-from-bottom-4">
            <button 
              onClick={() => setActiveTemplate(1)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTemplate === 1 ? 'bg-blue-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
            >
              1. Tech Dark
            </button>
            <button 
              onClick={() => setActiveTemplate(2)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTemplate === 2 ? 'bg-purple-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
            >
              2. Gamer Vibrant
            </button>
            <button 
              onClick={() => setActiveTemplate(3)}
              className={`px-4 py-2 rounded-xl text-sm font-bold transition-all ${activeTemplate === 3 ? 'bg-emerald-600 text-white shadow-md' : 'bg-transparent text-slate-600 hover:bg-slate-100'}`}
            >
              3. Clean Family
            </button>
          </div>
        )}
        
        <button 
          onClick={() => setIsConfigOpen(!isConfigOpen)}
          className="bg-slate-900 text-white px-5 py-3 rounded-full font-bold shadow-xl flex items-center gap-2 hover:scale-105 active:scale-95 transition-all border border-slate-700"
        >
          <Settings2 size={18} /> Mudar Tema (Demo)
        </button>
      </div>
    </>
  );
}
