import React, { useState, useEffect } from 'react';
import { Search, Send, User, Phone, Zap } from 'lucide-react';
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

  return (
    <div className="flex-1 flex h-full">
      {/* Lista de Conversas */}
      <div className="w-80 border-r border-slate-200 bg-white flex flex-col">
        <div className="p-4 border-b border-slate-200">
          <h1 className="font-bold text-lg mb-4">Inbox Unificado</h1>
          <div className="relative">
            <Search className="absolute left-3 top-2.5 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Buscar conversas..." 
              className="w-full pl-10 pr-4 py-2 bg-slate-100 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        <div className="flex-1 overflow-y-auto">
          {chats.map(chat => (
            <div 
              key={chat.id} 
              onClick={() => setActiveChat(chat.id)}
              className={`p-4 border-b border-slate-100 cursor-pointer hover:bg-slate-50 transition-colors ${activeChat === chat.id ? 'bg-blue-50 border-l-4 border-l-blue-600' : ''}`}
            >
              <div className="flex justify-between items-start mb-1">
                <span className="font-medium text-slate-900">Cliente #{chat.contato_id}</span>
                <span className="text-xs text-slate-500">{chat.mensagens[chat.mensagens.length - 1].enviada_em}</span>
              </div>
              <p className="text-sm text-slate-600 truncate">{chat.mensagens[chat.mensagens.length - 1].conteudo}</p>
              <div className="mt-2 flex gap-2">
                <span className="text-xs bg-slate-200 px-2 py-1 rounded-full">{chat.canal}</span>
                {chat.prioridade === 1 && <span className="text-xs bg-red-100 text-red-700 px-2 py-1 rounded-full font-medium">Urgente</span>}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Área de Chat */}
      {activeConversation ? (
        <div className="flex-1 flex flex-col bg-slate-50">
          {/* Header */}
          <div className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 text-blue-700 rounded-full flex items-center justify-center">
                <User size={20} />
              </div>
              <div>
                <h2 className="font-bold text-slate-900">Cliente #{activeConversation.contato_id}</h2>
                <p className="text-xs text-slate-500">CPF/CNPJ validado no SGP</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button className="flex items-center gap-2 px-3 py-1.5 text-sm font-medium text-blue-700 bg-blue-50 rounded-md hover:bg-blue-100 transition-colors">
                <Phone size={16} /> Ligar
              </button>
            </div>
          </div>

          {/* Mensagens */}
          <div className="flex-1 overflow-y-auto p-6 flex flex-col gap-4">
            {activeConversation.mensagens.map(msg => (
              <div key={msg.id} className={`flex ${msg.autor_tipo === 'cliente' ? 'justify-start' : 'justify-end'}`}>
                <div className={`max-w-[70%] rounded-xl p-3 ${
                  msg.autor_tipo === 'cliente' ? 'bg-white border border-slate-200 text-slate-900' :
                  msg.autor_tipo === 'ia' ? 'bg-slate-800 text-white' : 'bg-blue-600 text-white'
                }`}>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xs font-bold opacity-75 uppercase">
                      {msg.autor_tipo === 'ia' ? 'Assistente IA (9router)' : msg.autor_tipo === 'cliente' ? 'Cliente' : 'Operador'}
                    </span>
                    <span className="text-xs opacity-60">{msg.enviada_em}</span>
                  </div>
                  <p className="text-sm">{msg.conteudo}</p>
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
          <div className="p-4 bg-white border-t border-slate-200">
            <div className="flex gap-2">
              <input 
                id="chat-input"
                type="text" 
                placeholder="Digite sua mensagem (use '/' para comandos rápidos)..." 
                className="flex-1 bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-md px-4 py-2"
              />
              <button className="w-10 h-10 bg-blue-600 hover:bg-blue-700 text-white rounded-md flex items-center justify-center transition-colors">
                <Send size={18} />
              </button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex-1 flex items-center justify-center bg-slate-50 text-slate-400">
          Selecione uma conversa para iniciar
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
    <div className="px-6 py-2">
      <div className="bg-indigo-50 border border-indigo-100 rounded-md p-3 flex items-start gap-3">
        <Zap size={18} className={`text-indigo-500 shrink-0 mt-0.5 ${loading ? 'animate-pulse' : ''}`} />
        <div className="flex-1">
          <div className="flex justify-between items-start mb-1">
            <p className="text-sm text-indigo-900 font-medium">Sugestão da IA (9router)</p>
            {loading && <span className="text-[10px] uppercase font-bold text-indigo-400">Gerando...</span>}
          </div>
          <p className="text-sm text-indigo-700 min-h-5">
            {loading ? 'Analisando histórico e dados do SGP...' : suggestion || 'Não foi possível gerar sugestão.'}
          </p>
          {!loading && suggestion && (
            <button 
              onClick={() => onUseSuggestion(suggestion)}
              className="mt-2 text-xs font-medium bg-indigo-600 text-white px-3 py-1.5 rounded hover:bg-indigo-700 transition-colors"
            >
              Usar Resposta
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
