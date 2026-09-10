import React from 'react';
import { motion } from 'motion/react';
import { Check, ChevronRight, Menu, Home, Wifi, Tv } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Template3() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-outfit selection:bg-emerald-500/20">
      {/* Header */}
      <header className="fixed top-0 w-full z-50 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center">
              <span className="font-bold text-xl text-white">F</span>
            </div>
            <span className="font-bold text-2xl tracking-tight text-slate-900">Fibra<span className="text-emerald-600 font-medium">Net</span></span>
          </div>
          
          <nav className="hidden md:flex gap-8 text-sm font-bold text-slate-600">
            <a href="#planos" className="hover:text-emerald-600 transition-colors">Planos Internet</a>
            <a href="#vantagens" className="hover:text-emerald-600 transition-colors">Vantagens</a>
            <a href="#atendimento" className="hover:text-emerald-600 transition-colors">Atendimento</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link to="/portal" className="hidden md:flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-emerald-600 transition-colors">
              Portal do Cliente
            </Link>
            <Link to="/login" className="bg-emerald-600 text-white px-6 py-2.5 rounded-full text-sm font-bold hover:bg-emerald-700 transition-all flex items-center gap-2 shadow-lg shadow-emerald-600/20">
              Assine Já
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-700 text-sm font-bold mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Conectando Famílias e Empresas
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-5xl md:text-7xl font-bold tracking-tight mb-6 text-slate-900"
          >
            A internet que não te <br/> deixa na mão.
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl text-slate-600 mb-10 max-w-2xl mx-auto"
          >
            Estabilidade, velocidade e um suporte que realmente funciona. Leve a melhor fibra óptica para a sua casa.
          </motion.p>
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row justify-center gap-4"
          >
            <button className="bg-emerald-600 text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-emerald-700 transition-all shadow-xl shadow-emerald-600/20 active:scale-95">
              Ver planos residenciais
            </button>
            <button className="bg-white text-slate-700 border border-slate-200 px-8 py-4 rounded-full font-bold text-lg hover:bg-slate-50 transition-all flex items-center justify-center gap-2">
              Falar com Consultor
            </button>
          </motion.div>
        </div>

        {/* Hero image placeholder / graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
          className="mt-20 max-w-5xl mx-auto bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden relative h-[400px]"
        >
          {/* Abstract clean background */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-50 to-blue-50"></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="flex gap-12">
               <div className="flex flex-col items-center gap-4 text-emerald-700">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Home size={32} />
                  </div>
                  <span className="font-bold">Casa Inteligente</span>
               </div>
               <div className="flex flex-col items-center gap-4 text-emerald-700 mt-12">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Wifi size={32} />
                  </div>
                  <span className="font-bold">Wi-Fi Estável</span>
               </div>
               <div className="flex flex-col items-center gap-4 text-emerald-700">
                  <div className="w-20 h-20 bg-white rounded-2xl shadow-lg flex items-center justify-center">
                    <Tv size={32} />
                  </div>
                  <span className="font-bold">Streaming 4K</span>
               </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Pricing */}
      <section className="py-24 px-6 bg-white border-t border-slate-100" id="planos">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Planos que cabem no bolso</h2>
            <p className="text-slate-500 text-lg">Sem pegadinhas. Preço fixo e instalação gratuita.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {[
              { mb: "300", name: "Básico", price: "79,90", features: ["100% Fibra Óptica", "Roteador Wi-Fi Incluso", "Acesso ao App Cliente"] },
              { mb: "600", name: "Família", price: "99,90", highlight: true, features: ["100% Fibra Óptica", "Roteador Wi-Fi 6", "Acesso ao App Cliente", "Paramount+ Incluso"] },
              { mb: "900", name: "Avançado", price: "129,90", features: ["100% Fibra Óptica", "Roteador Wi-Fi 6 Mesh", "Atendimento Prioritário", "Paramount+ Incluso"] }
            ].map((plan, i) => (
              <div 
                key={i}
                className={`bg-white rounded-3xl p-8 border ${plan.highlight ? 'border-emerald-500 shadow-2xl shadow-emerald-500/10' : 'border-slate-200 shadow-sm'} flex flex-col`}
              >
                {plan.highlight && (
                  <span className="bg-emerald-100 text-emerald-700 text-xs font-bold px-3 py-1 rounded-full self-start mb-4">
                    MAIS ASSINADO
                  </span>
                )}
                <h3 className="text-xl font-bold text-slate-900 mb-2">{plan.name}</h3>
                <div className="flex items-baseline gap-1 mb-6">
                  <span className="text-5xl font-bold text-slate-900">{plan.mb}</span>
                  <span className="text-lg font-bold text-slate-500">Mega</span>
                </div>
                <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-slate-100">
                  <span className="text-slate-500 font-medium">R$</span>
                  <span className="text-3xl font-bold text-slate-900">{plan.price}</span>
                  <span className="text-slate-500">/mês</span>
                </div>
                
                <div className="space-y-4 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <div key={j} className="flex items-center gap-3 text-slate-600">
                      <div className="w-5 h-5 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="font-medium text-sm">{f}</span>
                    </div>
                  ))}
                </div>
                
                <button className={`w-full py-4 rounded-xl font-bold transition-all ${plan.highlight ? 'bg-emerald-600 hover:bg-emerald-700 text-white' : 'bg-slate-100 hover:bg-slate-200 text-slate-900'}`}>
                  Quero este plano
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
