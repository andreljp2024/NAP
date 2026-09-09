import React, { useState, useEffect } from 'react';
import { Search, Send, User, Phone, Zap, MessageCircle, MonitorSmartphone } from 'lucide-react';
import type { Conversa } from '../types';

export default function Inbox() {
  const [activeChat, setActiveChat] = useState<number | null>(1);
  
  // Mock Data
  const chats: Conversa[] = [
    {
      id: 1,
      canal: 'whatsapp',
      contato_id: 1,
      status: 'aberta',
      prioridade: 1,
      mensagens: [
        { id: 1, conversa_id: 1, autor_tipo: 'cliente', conteudo: 'Minha internet está lenta.', enviada_em: '10:00' },
        { id: 2, conversa_id: 1, autor_tipo: 'ia', conteudo: 'Olá! Entendi que está com lentidão. Vou verificar no SGP...', enviada_em: '10:01' },
      ]
    },
    {
      id: 2,
      canal: 'webchat',
      contato_id: 2,
      status: 'aberta',
      prioridade: 2,
      mensagens: [
        { id: 3, conversa_id: 2, autor_tipo: 'cliente', conteudo: 'Quero a 2 via do boleto.', enviada_em: '09:45' },
      ]
    }
  ];

  const activeConversation = chats.find(c => c.id === activeChat);

  const getChannelIcon = (canal: string) => {
    switch (canal) {
      case 'whatsapp': return <MessageCircle size={14} className="text-emerald-400" />;
      case 'webchat': return <MonitorSmartphone size={14} className="text-blue-400" />;
      default: return <Phone size={14} className="text-slate-400" />;
    }
  };

  return (
    <div className="flex-1 flex h-full bg-[#0b0f19]">
      {/* Lista de Conversas */}
      <div className="w-80 border-r border-slate-800/60 bg-[#0d1321] flex flex-col z-10">
        <div className="p-5 border-b border-slate-800/60">
          <h1 className="font-bold text-xl text-white font-outfit mb-4">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full pl-10 pr-4 py-2 bg-[#1a2333] border border-slate-700/50 rounded-lg text-sm text-slate-200 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-slate-800/40 cursor-pointer transition-all ${activeChat === chat.id ? 'bg-[#1a2333] border-l-4 border-l-indigo-500' : 'hover:bg-slate-800/30 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-bold text-slate-200">Cliente #{chat.contato_id}</span>
                <span className="text-xs font-medium text-slate-500">{chat.mensagens[chat.mensagens.length - 1].enviada_em}</span>
              </div>
              <p className="text-sm text-slate-400 truncate mb-3">{chat.mensagens[chat.mensagens.length - 1].conteudo}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-800/50 border border-slate-700/30">
                  {getChannelIcon(chat.canal)}
                  <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">{chat.canal}</span>
                </div>
                {chat.prioridade === 1 && <span className="text-[10px] bg-red-500/10 text-red-400 border border-red-500/20 px-2 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">Urgente</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-[#0b0f19] relative">
          {/* Header */}
          <div className="h-16 border-b border-slate-800/60 bg-[#101726]/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-bold text-white font-outfit text-lg">Cliente #{activeConversation.contato_id}</h2>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-400">Autenticado via SGP</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-indigo-300 bg-indigo-500/10 border border-indigo-500/20 rounded-lg hover:bg-indigo-500/20 hover:text-indigo-200 transition-all">
                <Phone size={16} /> Ligar
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-6">
            {activeConversation.mensagens.map(msg => (
              <div key={msg.id} className={`flex ${msg.autor_tipo === 'cliente' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[75%] rounded-2xl p-4 shadow-sm ${
                  msg.autor_tipo === 'cliente' 
                    ? 'bg-[#1a2333] border border-slate-700/50 text-slate-200 rounded-tl-sm' 
                    : msg.autor_tipo === 'ia' 
                      ? 'bg-gradient-to-br from-indigo-900/40 to-purple-900/40 border border-indigo-500/30 text-indigo-100 rounded-tr-sm' 
                      : 'bg-indigo-600 text-white rounded-tr-sm shadow-indigo-500/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      msg.autor_tipo === 'cliente' ? 'text-slate-400' : msg.autor_tipo === 'ia' ? 'text-indigo-300 flex items-center gap-1' : 'text-indigo-200'
                    }`}>
                      {msg.autor_tipo === 'ia' && <Zap size={10} className="fill-indigo-400" />}
                      {msg.autor_tipo === 'ia' ? 'Assistente IA' : msg.autor_tipo === 'cliente' ? 'Cliente' : 'Você'}
                    </span>
                    <span className={`text-[10px] font-medium ${msg.autor_tipo === 'cliente' ? 'text-slate-500' : 'text-indigo-300/70'}`}>{msg.enviada_em}</span>
                  </div>
                  <p className="text-[15px] leading-relaxed">{msg.conteudo}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Sugestão de IA Dinâmica */}
          <DynamicAISuggestion 
            lastClientMessage={
              activeConversation.mensagens.filter(m => m.autor_tipo === 'cliente').pop()?.conteudo || ''
            } 
            onUseSuggestion={(text) => {
              const inputEl = document.getElementById('chat-input') as HTMLInputElement;
              if (inputEl) {
                inputEl.value = text;
                inputEl.focus();
              }
            }}
          />

          {/* Input */}
          <div className="p-4 bg-[#101726] border-t border-slate-800/60 relative z-20">
            <div className="flex gap-3 max-w-5xl mx-auto">
              <input 
                id="chat-input"
                type="text" 
                placeholder="Digite sua mensagem (use '/' para comandos rápidos)..." 
                className="flex-1 bg-[#1a2333] border border-slate-700/50 outline-none focus:ring-2 focus:ring-indigo-500/50 focus:border-indigo-500 rounded-xl px-5 py-3 text-slate-200 placeholder:text-slate-500 transition-all shadow-inner"
              />
              <button className="w-12 h-12 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-indigo-500/20 hover:scale-105 active:scale-95">
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-[#0b0f19] text-slate-500">
          <div className="w-20 h-20 bg-[#101726] rounded-full flex items-center justify-center mb-4 border border-slate-800/60 shadow-inner">
            <MessageCircle size={32} className="text-slate-600" />
          </div>
          <h3 className="font-outfit text-xl text-slate-300 font-bold mb-2">Inbox Vazio</h3>
          <p className="text-sm">Selecione uma conversa ao lado para iniciar o atendimento</p>
        </div>
      )}
    </div>
  );
}

function DynamicAISuggestion({ lastClientMessage, onUseSuggestion }: { lastClientMessage: string, onUseSuggestion: (text: string) => void }) {
  const [suggestion, setSuggestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!lastClientMessage) return;
    setLoading(true);
    setSuggestion(null);

    fetch('/api/ia/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ mensagem: lastClientMessage, vertical: 'suporte' })
    })
    .then(res => res.json())
    .then(data => {
      if (data.resposta) {
        setSuggestion(data.resposta);
      }
    })
    .catch(console.error)
    .finally(() => setLoading(false));

  }, [lastClientMessage]);

  if (!lastClientMessage) return null;

  return (
    <div className="px-6 py-4 bg-gradient-to-t from-[#101726] to-transparent relative z-10">
      <div className="bg-[#1a1c33] border border-indigo-500/30 rounded-xl p-4 flex items-start gap-4 shadow-xl shadow-indigo-900/10 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-full bg-indigo-500/20 flex items-center justify-center shrink-0">
          <Zap size={16} className={`text-indigo-400 ${loading ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] uppercase tracking-wider font-bold text-indigo-300">Sugestão da IA (9router)</p>
            {loading && <span className="text-[10px] uppercase font-bold text-indigo-400 animate-pulse">Gerando...</span>}
          </div>
          <p className="text-sm text-indigo-100 min-h-5 leading-relaxed">
            {loading ? 'Analisando histórico e dados do SGP...' : suggestion || 'Não foi possível gerar sugestão.'}
          </p>
          {!loading && suggestion && (
            <button 
              onClick={() => onUseSuggestion(suggestion)}
              className="mt-4 text-[11px] uppercase tracking-wider font-bold bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-500 transition-colors shadow-lg shadow-indigo-600/20"
            >
              Inserir na Resposta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
