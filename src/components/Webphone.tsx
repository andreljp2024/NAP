import React, { useState } from 'react';
import { Phone, PhoneOff, Mic, MicOff, Pause, Delete, Hash, User, Shield } from 'lucide-react';

export default function Webphone() {
  const [isOpen, setIsOpen] = useState(false);
  const [dialNumber, setDialNumber] = useState('');
  const [onCall, setOnCall] = useState(false);
  const [muted, setMuted] = useState(false);
  const [callDuration, setCallDuration] = useState('00:00');

  // Ramal simulado registrado no FreePBX 17
  const sipStatus = "Registrado";
  const ramal = "2001";

  const handleKeyPress = (key: string) => {
    setDialNumber((prev) => prev + key);
  };

  const handleBackspace = () => {
    setDialNumber((prev) => prev.slice(0, -1));
  };

  const toggleCall = () => {
    if (onCall) {
      setOnCall(false);
      setCallDuration('00:00');
    } else {
      if (dialNumber.length > 0) {
        setOnCall(true);
        // Em um cenário real, aqui seria iniciada a chamada via JsSIP / SIP.js
      }
    }
  };

  return (
    <>
      {/* Botão de Toggle do Webphone */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 px-3 py-1.5 rounded-xl transition-all"
      >
        <div className="relative">
          <Phone size={16} className={onCall ? 'text-emerald-400' : 'text-slate-400'} />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-[#0b0f19]"></div>
        </div>
        <span className="text-xs font-bold text-slate-300">Ramal {ramal}</span>
      </button>

      {/* Janela do Webphone */}
      {isOpen && (
        <div className="absolute top-16 right-6 w-72 bg-[#101726] border border-slate-800/60 shadow-2xl shadow-black/60 rounded-3xl overflow-hidden z-50 animate-in slide-in-from-top-4">
          
          {/* Header */}
          <div className="bg-[#0d1321] border-b border-slate-800/60 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">{sipStatus}</span>
            </div>
            <span className="text-xs text-slate-500 font-mono">SIP/FreePBX</span>
          </div>

          {/* Visor */}
          <div className="p-5 flex flex-col items-center justify-center border-b border-slate-800/60 bg-[#0b0f19]/50 min-h-[100px]">
            {onCall ? (
              <>
                <p className="text-xs font-bold text-emerald-400 uppercase tracking-widest mb-1">Em Chamada</p>
                <h3 className="text-2xl font-mono text-white tracking-widest">{dialNumber}</h3>
                <p className="text-sm font-mono text-slate-400 mt-2">{callDuration}</p>
              </>
            ) : (
              <h3 className="text-3xl font-mono text-slate-200 tracking-widest min-h-[36px]">
                {dialNumber || '...'}
              </h3>
            )}
          </div>

          {/* Teclado */}
          {!onCall ? (
            <div className="p-5">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                  <button 
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="h-12 bg-[#1a2333] hover:bg-slate-800 border border-slate-700/50 rounded-xl text-lg font-bold text-slate-300 flex items-center justify-center transition-colors active:scale-95"
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={toggleCall}
                  disabled={dialNumber.length === 0}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-emerald-600/20 active:scale-95"
                >
                  <Phone size={20} />
                </button>
                <button 
                  onClick={handleBackspace}
                  disabled={dialNumber.length === 0}
                  className="w-12 h-12 bg-[#1a2333] hover:bg-slate-800 disabled:opacity-50 border border-slate-700/50 text-slate-400 hover:text-white rounded-xl flex items-center justify-center transition-all active:scale-95"
                >
                  <Delete size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-4">
              <div className="flex justify-center gap-4 mb-2">
                <button 
                  onClick={() => setMuted(!muted)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all ${muted ? 'bg-amber-500/20 border-amber-500/30 text-amber-400' : 'bg-[#1a2333] border-slate-700/50 text-slate-400 hover:text-white'} border`}
                >
                  {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button className="w-14 h-14 bg-[#1a2333] border border-slate-700/50 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all">
                  <Pause size={22} />
                </button>
                <button className="w-14 h-14 bg-[#1a2333] border border-slate-700/50 text-slate-400 hover:text-white rounded-2xl flex items-center justify-center transition-all">
                  <Hash size={22} />
                </button>
              </div>
              <button 
                onClick={toggleCall}
                className="w-full h-14 bg-red-500 hover:bg-red-400 text-white rounded-2xl flex items-center justify-center transition-all shadow-lg shadow-red-500/20 active:scale-95"
              >
                <PhoneOff size={24} />
              </button>
            </div>
          )}

        </div>
      )}
    </>
  );
}
