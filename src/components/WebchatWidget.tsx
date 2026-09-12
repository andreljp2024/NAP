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
          history: messages.map(m => ({ role: m.sender === 'user' ? 'user' : 'model', parts: [{ text: m.text }] })),
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
          className="webchat-widget-toggle fixed bottom-20 md:bottom-6 right-4 md:right-6 w-14 h-14 bg-[#25D366] text-white rounded-full  flex items-center justify-center hover:bg-[#128C7E] hover:scale-105 transition-all z-50"
        >
          <MessageCircle size={28} />
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-0 md:bottom-6 right-0 md:right-6 w-full md:w-[380px] h-[85vh] md:h-[600px] bg-[#efeae2] md:rounded-2xl border border-slate-200  flex flex-col z-50 overflow-hidden  transition-all">
          {/* Header */}
          <div className="bg-[#00a884] text-white p-4 flex justify-between items-center shrink-0">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot size={22} className="text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">MaIA - Inteligência Artificial</h3>
                <p className="text-[10px] text-white/80 uppercase tracking-wider font-bold">Google Gemini Nativo</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setIsOpen(false)} className="p-2 text-white hover:bg-white/10 rounded-full transition-colors">
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-3 relative z-0">
            <div 
              className="absolute inset-0 pointer-events-none -z-10"
              style={{ 
                backgroundImage: 'url("https://web.whatsapp.com/img/bg-chat-tile-dark_a4be512e7195b6b733d9110b408f075d.png")',
                backgroundRepeat: 'repeat',
                backgroundSize: '400px',
                opacity: 0.08
              }}
            />
            
            {messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] rounded-lg p-2.5 text-[13.5px]  ${
                  msg.sender === 'user' 
                    ? 'bg-[#d9fdd3] text-[#111b21] rounded-tr-none' 
                    : 'bg-white text-[#111b21] rounded-tl-none'
                }`}>
                  <p className="leading-relaxed">{msg.text}</p>
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white rounded-lg rounded-tl-none p-3  flex gap-1.5 items-center">
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  <div className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <form onSubmit={handleSend} className="p-3 bg-[#f0f2f5] shrink-0">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Mensagem"
                className="flex-1 bg-white border-none outline-none focus:ring-0 rounded-full px-4 py-3 text-[14px] text-[#111b21]  placeholder:text-[#8696a0] transition-all"
              />
              <button 
                type="submit"
                disabled={!inputValue.trim() || isTyping}
                className="w-11 h-11 bg-[#00a884] text-white rounded-full flex items-center justify-center hover:bg-[#008f6f] disabled:opacity-50 transition-all  shrink-0"
              >
                <Send size={18} className="ml-0.5" />
              </button>
            </div>
            <div className="text-center mt-2 pb-1">
              <span className="text-[10px] text-[#8696a0] font-medium flex items-center justify-center gap-1">
                Protegido por criptografia
              </span>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
