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
        className="flex items-center gap-2 bg-white hover:bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-xl transition-all shadow-sm"
      >
        <div className="relative">
          <Phone size={16} className={onCall ? 'text-emerald-600' : 'text-slate-500'} />
          <div className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-emerald-500 border border-white"></div>
        </div>
        <span className="text-xs font-bold text-slate-700">Ramal {ramal}</span>
      </button>

      {/* Janela do Webphone */}
      {isOpen && (
        <div className="absolute top-16 right-6 w-72 bg-white border border-slate-200 shadow-md rounded-3xl overflow-hidden z-50 animate-in slide-in-from-top-4">
          
          {/* Header */}
          <div className="bg-slate-50 border-b border-slate-200 p-4 flex justify-between items-center">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
              <span className="text-xs font-bold text-emerald-700 uppercase tracking-wider">{sipStatus}</span>
            </div>
            <span className="text-xs text-slate-600 font-mono">SIP/FreePBX</span>
          </div>

          {/* Visor */}
          <div className="p-5 flex flex-col items-center justify-center border-b border-slate-100 bg-white min-h-[100px]">
            {onCall ? (
              <>
                <p className="text-xs font-bold text-emerald-600 uppercase tracking-widest mb-1">Em Chamada</p>
                <h3 className="text-2xl font-mono text-slate-900 tracking-widest">{dialNumber}</h3>
                <p className="text-sm font-mono text-slate-500 mt-2">{callDuration}</p>
              </>
            ) : (
              <h3 className="text-3xl font-mono text-slate-800 tracking-widest min-h-[36px]">
                {dialNumber || '...'}
              </h3>
            )}
          </div>

          {/* Teclado */}
          {!onCall ? (
            <div className="p-5 bg-slate-50">
              <div className="grid grid-cols-3 gap-3 mb-4">
                {['1', '2', '3', '4', '5', '6', '7', '8', '9', '*', '0', '#'].map((key) => (
                  <button 
                    key={key}
                    onClick={() => handleKeyPress(key)}
                    className="h-12 bg-white hover:bg-slate-100 border border-slate-200 rounded-xl text-lg font-bold text-slate-700 flex items-center justify-center transition-colors active:scale-95 shadow-sm"
                  >
                    {key}
                  </button>
                ))}
              </div>
              <div className="flex gap-3">
                <button 
                  onClick={toggleCall}
                  disabled={dialNumber.length === 0}
                  className="flex-1 h-12 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white rounded-xl flex items-center justify-center transition-all shadow-md active:scale-95"
                >
                  <Phone size={20} />
                </button>
                <button 
                  onClick={handleBackspace}
                  disabled={dialNumber.length === 0}
                  className="w-12 h-12 bg-white hover:bg-slate-100 disabled:opacity-50 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-xl flex items-center justify-center transition-all active:scale-95 shadow-sm"
                >
                  <Delete size={20} />
                </button>
              </div>
            </div>
          ) : (
            <div className="p-6 flex flex-col gap-4 bg-slate-50">
              <div className="flex justify-center gap-4 mb-2">
                <button 
                  onClick={() => setMuted(!muted)}
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-sm ${muted ? 'bg-amber-50 border-amber-200 text-amber-600' : 'bg-white border-slate-200 text-slate-600 hover:text-slate-900'} border`}
                >
                  {muted ? <MicOff size={22} /> : <Mic size={22} />}
                </button>
                <button className="w-14 h-14 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <Pause size={22} />
                </button>
                <button className="w-14 h-14 bg-white border border-slate-200 text-slate-600 hover:text-slate-900 rounded-2xl flex items-center justify-center transition-all shadow-sm">
                  <Hash size={22} />
                </button>
              </div>
              <button 
                onClick={toggleCall}
                className="w-full h-14 bg-red-600 hover:bg-red-700 text-white rounded-2xl flex items-center justify-center transition-all shadow-md active:scale-95"
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
