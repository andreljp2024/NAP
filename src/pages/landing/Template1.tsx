import React from 'react';
import { motion } from 'motion/react';
import { Wifi, Zap, Shield, ChevronRight, Globe, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Template1() {
  return (
    <div className="min-h-screen bg-[#060b14] text-white font-outfit overflow-x-hidden selection:bg-blue-500/30">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-[#060b14]/80 backdrop-blur-md border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg shadow-blue-600/20">
              <span className="font-bold text-xl">N</span>
            </div>
            <span className="font-bold text-2xl tracking-tight">NAP <span className="text-blue-500 font-medium text-lg">Fibra</span></span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-medium text-slate-300">
            <a href="#planos" className="hover:text-white transition-colors">Planos</a>
            <a href="#vantagens" className="hover:text-white transition-colors">Vantagens</a>
            <a href="#cobertura" className="hover:text-white transition-colors">Cobertura</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/portal" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-300 hover:text-white transition-colors">
              Área do Assinante
            </Link>
            <Link to="/login" className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-100 transition-all flex items-center gap-2">
              Contratar Agora <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 px-6 overflow-hidden">
        {/* Background Image with Overlay */}
        <div className="absolute inset-0 z-0">
          <img 
            src="https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop" 
            alt="Cyberpunk Fiber Background" 
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-[#060b14]/80 via-[#060b14]/90 to-[#060b14]"></div>
          <div className="absolute inset-0 bg-blue-900/10 mix-blend-color"></div>
        </div>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none z-0"></div>
        <div className="absolute top-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-5 pointer-events-none z-0"></div>
        
        <div className="max-w-7xl mx-auto relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-semibold mb-6"
          >
            <Zap size={14} className="fill-current" /> 100% Fibra Óptica de Ponta a Ponta
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
          >
            A internet que conecta <br /> você ao <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">futuro.</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed"
          >
            Navegue com ultravelocidade, jogue sem lag e assista seus filmes em 4K sem travamentos. A estabilidade que sua casa e empresa merecem.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <button className="w-full sm:w-auto bg-blue-600 hover:bg-blue-500 text-white px-8 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_40px_rgba(37,99,235,0.4)] hover:shadow-[0_0_60px_rgba(37,99,235,0.6)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2">
              Ver Planos Disponíveis
            </button>
            <Link to="/portal" className="w-full sm:w-auto bg-white/5 hover:bg-white/10 text-white px-8 py-4 rounded-full font-bold text-lg transition-all border border-white/10 hover:border-white/20 flex items-center justify-center">
              Já sou cliente
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 px-6 border-t border-white/5 bg-slate-900/50" id="vantagens">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Por que escolher a NAP Fibra?</h2>
            <p className="text-slate-400">Tecnologia de ponta para entregar a melhor experiência.</p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: <Wifi size={32} />, title: "Wi-Fi 6 Incluso", desc: "Roteadores de última geração com maior alcance e capacidade de dispositivos." },
              { icon: <Shield size={32} />, title: "Conexão Segura", desc: "Rede monitorada 24/7 com proteção contra ataques e instabilidades." },
              { icon: <Phone size={32} />, title: "Suporte Premium", desc: "Atendimento humano e rápido via WhatsApp, Telefone ou App exclusivo." }
            ].map((item, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="bg-[#0b1120] border border-white/5 p-8 rounded-3xl hover:border-blue-500/30 transition-colors group"
              >
                <div className="w-16 h-16 bg-blue-500/10 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 group-hover:bg-blue-500 group-hover:text-white transition-all">
                  {item.icon}
                </div>
                <h3 className="text-xl font-bold mb-3">{item.title}</h3>
                <p className="text-slate-400 leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6" id="planos">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold mb-4">Planos Residenciais</h2>
            <p className="text-slate-400">Escolha a velocidade ideal para a sua necessidade.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { mb: "500", name: "Essencial", price: "89,90", features: ["Ideal para o dia a dia", "Wi-Fi Dual Band", "Upload de 250 Mega", "Instalação Grátis"] },
              { mb: "700", name: "Família", price: "109,90", popular: true, features: ["Streaming em 4K", "Wi-Fi 6 Incluso", "Upload de 350 Mega", "Instalação Grátis"] },
              { mb: "1000", name: "Gamer Ultra", price: "149,90", features: ["Ping ultra baixo", "Wi-Fi 6 Mesh", "Upload de 500 Mega", "IP Válido Fixo"] }
            ].map((plan, i) => (
              <motion.div 
                key={i}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className={`relative rounded-3xl p-1 ${plan.popular ? 'bg-gradient-to-b from-blue-500 to-cyan-400' : 'bg-white/5'} overflow-hidden`}
              >
                {plan.popular && (
                  <div className="absolute top-6 right-0 bg-white text-blue-600 text-xs font-bold px-3 py-1 rounded-l-full uppercase tracking-wider">
                    Mais Vendido
                  </div>
                )}
                <div className="bg-[#0b1120] rounded-[22px] p-8 h-full flex flex-col">
                  <h3 className="text-xl font-medium text-slate-300 mb-2">{plan.name}</h3>
                  <div className="flex items-baseline gap-2 mb-6">
                    <span className="text-5xl font-bold text-white">{plan.mb}</span>
                    <span className="text-xl text-slate-400 font-medium">Mega</span>
                  </div>
                  <div className="flex items-baseline gap-1 mb-8">
                    <span className="text-slate-400">R$</span>
                    <span className="text-3xl font-bold">{plan.price}</span>
                    <span className="text-slate-400">/mês</span>
                  </div>
                  <div className="space-y-4 mb-8 flex-1">
                    {plan.features.map((f, j) => (
                      <div key={j} className="flex items-center gap-3 text-slate-300">
                        <CheckIcon /> <span>{f}</span>
                      </div>
                    ))}
                  </div>
                  <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.popular ? 'bg-blue-600 hover:bg-blue-500 text-white' : 'bg-white/5 hover:bg-white/10 text-white'}`}>
                    Assinar Plano
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
      
      <footer className="py-8 border-t border-white/5 text-center text-slate-500 text-sm">
        <p>© 2026 NAP Fibra Telecom. Todos os direitos reservados.</p>
      </footer>
    </div>
  );
}

const CheckIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-emerald-400">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);
