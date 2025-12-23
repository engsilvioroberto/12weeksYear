
import React, { useState, useEffect } from 'react';
import { AppState } from '../types';
import { Play, Pause, RotateCcw, ShieldCheck, Inbox, Zap } from 'lucide-react';

interface ProfileViewProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

export const ProfileView: React.FC<ProfileViewProps> = ({ state, updateState }) => {
  const [activeBlock, setActiveBlock] = useState<'strategic' | 'buffer' | 'breakout' | null>(null);
  const [timeLeft, setTimeLeft] = useState(0);

  useEffect(() => {
    let interval: any;
    if (activeBlock && timeLeft > 0) {
      interval = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0) {
      setActiveBlock(null);
    }
    return () => clearInterval(interval);
  }, [activeBlock, timeLeft]);

  const startBlock = (type: 'strategic' | 'buffer' | 'breakout', minutes: number) => {
    setActiveBlock(type);
    setTimeLeft(minutes * 60);
  };

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-3xl font-light tracking-tight">Performance</h1>
        <p className="text-gray-500 text-sm">Gestão intencional do seu tempo.</p>
      </header>

      {/* Timer Display */}
      {activeBlock && (
        <section className="bg-gray-900 text-white p-8 rounded-2xl text-center space-y-4 animate-in zoom-in duration-300">
          <h3 className="text-[10px] font-bold uppercase tracking-[0.3em] text-emerald-500">
            {activeBlock === 'strategic' ? 'Bloco Estratégico Ativo' : 
             activeBlock === 'buffer' ? 'Bloco de Reserva Ativo' : 'Bloco de Fuga Ativo'}
          </h3>
          <div className="text-6xl font-mono tracking-tight tabular-nums">
            {formatTime(timeLeft)}
          </div>
          <div className="flex justify-center space-x-4">
            <button 
              onClick={() => setActiveBlock(null)}
              className="px-6 py-2 bg-white/10 rounded-full text-xs font-bold uppercase tracking-widest hover:bg-white/20 transition-all"
            >
              Encerrar
            </button>
          </div>
        </section>
      )}

      {/* Block Selectors */}
      <div className="space-y-4">
        <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Performance Time</h2>
        
        <button 
          onClick={() => startBlock('strategic', 180)}
          className="w-full bg-white border border-gray-100 p-6 rounded-2xl flex items-center space-x-4 text-left hover:border-gray-200 transition-all shadow-sm"
        >
          <div className="p-3 bg-indigo-50 text-indigo-500 rounded-xl">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">Bloco Estratégico</h4>
            <p className="text-xs text-gray-500">3h de foco profundo e sem interrupções.</p>
          </div>
          <Play size={20} className="text-gray-300" />
        </button>

        <button 
          onClick={() => startBlock('buffer', 45)}
          className="w-full bg-white border border-gray-100 p-6 rounded-2xl flex items-center space-x-4 text-left hover:border-gray-200 transition-all shadow-sm"
        >
          <div className="p-3 bg-amber-50 text-amber-500 rounded-xl">
            <Inbox size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">Bloco de Reserva</h4>
            <p className="text-xs text-gray-500">30-60min para e-mails e tarefas adm.</p>
          </div>
          <Play size={20} className="text-gray-300" />
        </button>

        <button 
          onClick={() => startBlock('breakout', 180)}
          className="w-full bg-white border border-gray-100 p-6 rounded-2xl flex items-center space-x-4 text-left hover:border-gray-200 transition-all shadow-sm"
        >
          <div className="p-3 bg-emerald-50 text-emerald-500 rounded-xl">
            <Zap size={24} />
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">Bloco de Fuga</h4>
            <p className="text-xs text-gray-500">3h livres para recarregar as energias.</p>
          </div>
          <Play size={20} className="text-gray-300" />
        </button>
      </div>

      <div className="pt-10 border-t border-gray-100">
        <button 
          onClick={() => {
            if(confirm('Deseja resetar todos os dados do ciclo?')) {
              localStorage.clear();
              window.location.reload();
            }
          }}
          className="w-full py-4 text-xs font-bold uppercase tracking-widest text-red-400 hover:text-red-600 transition-colors"
        >
          Resetar Ciclo de 12 Semanas
        </button>
      </div>
    </div>
  );
};
