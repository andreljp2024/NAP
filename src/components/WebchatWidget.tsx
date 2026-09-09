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
      const res = await fetch('/api/gemini/agent/run', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          prompt: userMsg,
          clientContext: {
            nome: "Assinante Webchat",
            plano: "Fibra 500MB Simétrico",
            status: "ativo"
          }
        })
      });
      const data = await res.json();
      
      setMessages(prev => [...prev, { 
        id: Date.now(), 
        text: data.resposta || 'Olá! Como posso ajudar você hoje com sua conexão de internet?', 
        sender: 'ia' 
      }]);
    } catch {
      setMessages(prev => [...prev, { id: Date.now(), text: 'Serviço temporariamente indisponível.', sender: 'ia' }]);
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
          className="fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-blue-700 text-white rounded-2xl shadow-lg flex items-center justify-center hover:bg-blue-600 hover:scale-105 transition-all z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] h-[85vh] md:h-[600px] bg-slate-50 md:rounded-3xl border-slate-200 shadow-sm shadow-lg flex flex-col z-50 overflow-hidden  transition-all">
          {/* Header */}
          <div className="bg-white text-slate-900 p-4 flex justify-between border-b border-slate-200 items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-600/10 border border-blue-200 rounded-2xl flex items-center justify-center">
                <Bot size={22} className="text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Assistente NAP</h3>
                <p className="text-[10px] text-indigo-600 uppercase tracking-wider font-bold">Google Gemini Nativo (Sem n8n)</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 border border-slate-200 hover:border-blue-200 rounded-2xl transition-colors">
                <Minus size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-5 flex flex-col gap-5">
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-2xl p-4 text-sm shadow-inner ${
                  msg.sender === 'user' 
                    ? 'bg-blue-700 text-white rounded-br-sm' 
                    : 'bg-white border border-slate-200 text-slate-600 rounded-bl-sm'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white border border-slate-200 rounded-2xl rounded-bl-sm p-4 shadow-inner flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-2xl animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-2xl animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-blue-600 rounded-2xl animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-4 bg-white border-t border-slate-200 shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Digite sua mensagem..."
                className="flex-1 bg-slate-50 border border-slate-200 outline-none focus:ring-2 focus:ring-blue-600/50 focus:border-blue-600 rounded-xl px-4 py-3.5 text-sm text-slate-900 shadow-inner placeholder:text-slate-600 transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-12 h-12 bg-blue-700 text-white rounded-xl flex items-center justify-center hover:bg-blue-600 disabled:opacity-50 disabled:hover:scale-100 disabled:hover:bg-blue-700 transition-all shadow-lg hover:scale-105 active:scale-95 shrink-0"
              >
                <Send size={18} />
              </button>
            </div>
            <div className="text-center mt-3">
              <span className="text-[10px] text-slate-600 font-medium">Protegido por criptografia ponta a ponta</span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
