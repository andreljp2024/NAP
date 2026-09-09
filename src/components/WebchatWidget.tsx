import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Minus } from 'lucide-react';

export default function WebchatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<{id: number, text: string, sender: 'user' | 'ia'}[]>([
    { id: 1, text: 'Olá, João! Sou o assistente virtual do seu provedor. Como posso ajudar com sua conexão hoje?', sender: 'ia' }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping, isOpen]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!inputValue.trim()) return;
    
    const userMsg = inputValue;
    setInputValue('');
    setMessages(prev => [...prev, { id: Date.now(), text: userMsg, sender: 'user' }]);
    setIsTyping(true);

    try {
      const res = await fetch('/api/ia/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ mensagem: userMsg, vertical: 'suporte' })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: data.resposta || 'Desculpe, ocorreu um erro ao processar sua solicitação.', 
        sender: 'ia' 
      }]);
    } catch (e) {
      setMessages(prev => [...prev, { id: Date.now(), text: 'Erro de conexão.', sender: 'ia' }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Floating Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-blue-600 text-white rounded-full shadow-lg flex items-center justify-center hover:bg-blue-700 hover:scale-105 transition-all z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] h-[85vh] md:h-[600px] bg-white md:rounded-2xl shadow-2xl flex flex-col z-50 overflow-hidden border border-slate-200 transition-all">
          {/* Header */}
          <div className="bg-blue-700 text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistente NAP</h3>
                <p className="text-xs text-blue-200">Respostas automáticas (IA)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors">
                <Minus size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-4">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${
                  msg.sender === 'user' 
                    ? 'bg-blue-600 text-white rounded-tr-sm' 
                    : 'bg-white border border-slate-200 text-slate-800 rounded-tl-sm shadow-sm'
                }`}>
                  <p>{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex gap-1">
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce"></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-2 h-2 bg-slate-300 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-slate-100 border-none outline-none focus:ring-2 focus:ring-blue-500 rounded-xl px-4 py-3 text-sm"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-blue-600 text-white rounded-xl flex items-center justify-center hover:bg-blue-700 disabled:opacity-50 disabled:hover:bg-blue-600 transition-colors shrink-0"
              >
                <Send size={20} />
              </button>
            </div>
            <div className="text-center mt-2">
              <span className="text-[10px] text-slate-400">Protegido por criptografia ponta a ponta</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
