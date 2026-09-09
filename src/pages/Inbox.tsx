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
      case 'whatsapp': return <MessageCircle size={14} className="text-emerald-600" />;
      case 'webchat': return <MonitorSmartphone size={14} className="text-blue-400" />;
      default: return <Phone size={14} className="text-slate-600" />;
    }
  };

  return (
    <div className="flex-1 flex h-full bg-slate-50">
      {/* Lista de Conversas */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col z-10">
        <div className="p-5 border-b border-slate-200">
          <h1 className="font-bold text-xl text-slate-900 font-outfit mb-4">Inbox</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-500" size={18} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm text-slate-900 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 transition-all placeholder:text-slate-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-slate-200 cursor-pointer transition-all ${activeChat === chat.id ? 'bg-slate-50 border-l-4 border-l-blue-600' : 'hover:bg-slate-100/30 border-l-4 border-l-transparent'}`}
            >
              <div className="flex justify-between items-start mb-1.5">
                <span className="font-bold text-slate-900">Cliente #{chat.contato_id}</span>
                <span className="text-xs font-medium text-slate-500">{chat.mensagens[chat.mensagens.length - 1].enviada_em}</span>
              </div>
              <p className="text-sm text-slate-600 truncate mb-3">{chat.mensagens[chat.mensagens.length - 1].conteudo}</p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-slate-50 border border-slate-200">
                  {getChannelIcon(chat.canal)}
                  <span className="text-[10px] uppercase font-bold text-slate-600 tracking-wider">{chat.canal}</span>
                </div>
                {chat.prioridade === 1 && <span className="text-[10px] bg-red-50 text-red-700 border border-red-200 px-2 py-1 rounded-md font-bold uppercase tracking-wider animate-pulse">Urgente</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-50 relative">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 bg-white/80 backdrop-blur-md flex items-center justify-between px-6 sticky top-0 z-10">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-200 text-blue-600 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900 font-outfit text-lg">Cliente #{activeConversation.contato_id}</h2>
                <div className="flex items-center gap-2">
                  <span className="flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-2 w-2 rounded-full bg-emerald-400 opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                  </span>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600">Autenticado via SGP</p>
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-4 py-2 text-sm font-bold text-blue-600 bg-blue-600/10 border border-blue-200 rounded-lg hover:bg-blue-600/20 hover:text-blue-700 transition-all">
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
                    ? 'bg-slate-50 border border-slate-200 text-slate-900 rounded-tl-sm' 
                    : msg.autor_tipo === 'ia' 
                      ? 'bg-blue-50 border border-blue-200 text-blue-800 rounded-tr-sm' 
                      : 'bg-blue-700 text-white rounded-tr-sm shadow-blue-600/20'
                }`}>
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`text-[10px] font-bold uppercase tracking-wider ${
                      msg.autor_tipo === 'cliente' ? 'text-slate-600' : msg.autor_tipo === 'ia' ? 'text-blue-600 flex items-center gap-1' : 'text-blue-700'
                    }`}>
                      {msg.autor_tipo === 'ia' && <Zap size={10} className="fill-blue-600" />}
                      {msg.autor_tipo === 'ia' ? 'Assistente IA' : msg.autor_tipo === 'cliente' ? 'Cliente' : 'Você'}
                    </span>
                    <span className={`text-[10px] font-medium ${msg.autor_tipo === 'cliente' ? 'text-slate-500' : 'text-blue-600/70'}`}>{msg.enviada_em}</span>
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
          <div className="p-4 bg-white border-t border-slate-200 relative z-20">
            {activeConversation.canal === 'whatsapp' && (
              <div className="max-w-5xl mx-auto flex gap-2 mb-3 overflow-x-auto pb-1" style={{scrollbarWidth: 'none'}}>
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 py-1.5 flex items-center shrink-0">WABA Templates:</span>
                <button className="text-[11px] font-bold text-emerald-600 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors">
                  Fatura Vencida (Boleto)
                </button>
                <button className="text-[11px] font-bold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-200 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors">
                  Manutenção Agendada
                </button>
                <button className="text-[11px] font-bold text-slate-600 bg-slate-100 hover:bg-slate-200 border border-slate-200 px-3 py-1.5 rounded-lg whitespace-nowrap transition-colors">
                  Aviso de Retenção
                </button>
              </div>
            )}
            <div className="flex gap-3 max-w-5xl mx-auto items-center">
              <button className="w-12 h-12 flex items-center justify-center text-slate-600 hover:text-slate-600 bg-slate-50 border border-slate-200 rounded-xl transition-colors hover:border-slate-600 shrink-0">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.44 11.05-9.19 9.19a6 6 0 0 1-8.49-8.49l8.57-8.57A4 4 0 1 1 18 8.84l-8.59 8.57a2 2 0 0 1-2.83-2.83l8.49-8.48"/></svg>
              </button>
              <input 
                id="chat-input"
                type="text" 
                placeholder="Digite sua mensagem (use '/' para comandos rápidos)..." 
                className="flex-1 bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 rounded-xl px-5 py-3 text-slate-900 placeholder:text-slate-500 transition-all shadow-inner"
              />
              <button className="w-12 h-12 bg-blue-700 hover:bg-blue-600 text-white rounded-xl flex items-center justify-center transition-all shadow-lg shadow-blue-700/20 hover:scale-105 active:scale-95 shrink-0">
                <Send size={18} className="ml-1" />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex flex-col items-center justify-center bg-slate-50 text-slate-500">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-4 border border-slate-200 shadow-inner">
            <MessageCircle size={32} className="text-slate-600" />
          </div>
          <h3 className="font-outfit text-xl text-slate-600 font-bold mb-2">Inbox Vazio</h3>
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
    <div className="px-6 py-4 bg-gradient-to-t from-white to-transparent relative z-10">
      <div className="bg-white border border-blue-200 rounded-xl p-4 flex items-start gap-4 shadow-md shadow-blue-100/10 backdrop-blur-sm">
        <div className="w-8 h-8 rounded-full bg-blue-600/20 flex items-center justify-center shrink-0">
          <Zap size={16} className={`text-blue-600 ${loading ? 'animate-pulse' : ''}`} />
        </div>
        <div className="flex-1">
          <div className="flex justify-between items-start mb-2">
            <p className="text-[11px] uppercase tracking-wider font-bold text-blue-600">Sugestão da IA (9router)</p>
            {loading && <span className="text-[10px] uppercase font-bold text-blue-600 animate-pulse">Gerando...</span>}
          </div>
          <p className="text-sm text-blue-800 min-h-5 leading-relaxed">
            {loading ? 'Analisando histórico e dados do SGP...' : suggestion || 'Não foi possível gerar sugestão.'}
          </p>
          {!loading && suggestion && (
            <button 
              onClick={() => onUseSuggestion(suggestion)}
              className="mt-4 text-[11px] uppercase tracking-wider font-bold bg-blue-700 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors shadow-lg shadow-blue-700/20"
            >
              Inserir na Resposta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
