
import React, { useState } from 'react';
import { Vision, AppState, Cycle } from '../types';
import { EducationCard } from '../components/EducationCard';
import { EDUCATIONAL_ENCARTES } from '../constants';
import { Sparkles, Loader2 } from 'lucide-react';
import { refineVision } from '../lib/ai';

interface VisionViewProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

export const VisionView: React.FC<VisionViewProps> = ({ state, updateState }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [isRefining, setIsRefining] = useState<string | null>(null);
  
  const activeCycle = state.cycles.find(c => c.id === state.activeCycleId);
  
  const [tempGlobal, setTempGlobal] = useState<Vision>(state.globalVision);
  const [tempCycleVision, setTempCycleVision] = useState(activeCycle?.twelveWeekVision || '');

  const handleRefine = async (field: 'aspirational' | 'threeYear' | 'twelveWeek') => {
    setIsRefining(field);
    const textToRefine = field === 'twelveWeek' ? tempCycleVision : tempGlobal[field as keyof Vision];
    const refined = await refineVision(textToRefine);
    
    if (field === 'twelveWeek') {
      setTempCycleVision(refined);
    } else {
      setTempGlobal(prev => ({ ...prev, [field]: refined }));
    }
    setIsRefining(null);
  };

  const handleSave = () => {
    updateState({
      globalVision: tempGlobal,
      cycles: state.cycles.map(c => 
        c.id === state.activeCycleId ? { ...c, twelveWeekVision: tempCycleVision } : c
      )
    });
    setIsEditing(false);
  };

  const showEncarte = !state.seenEncartes.includes('vision');

  if (isEditing) {
    return (
      <div className="space-y-8 pb-10">
        <header>
          <h1 className="text-3xl font-light tracking-tight mb-2">Clareza é Poder</h1>
          <p className="text-gray-500 text-sm">Refine sua visão para os próximos anos e para este ciclo.</p>
        </header>

        <div className="space-y-6">
          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visão Aspiracional (Global)</label>
              <button onClick={() => handleRefine('aspirational')} disabled={!!isRefining} className="text-[9px] font-bold uppercase text-emerald-500 flex items-center space-x-1">
                {isRefining === 'aspirational' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Refinar</span>
              </button>
            </div>
            <textarea 
              className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm focus:ring-1 focus:ring-gray-200 outline-none min-h-[80px]"
              value={tempGlobal.aspirational}
              onChange={e => setTempGlobal({...tempGlobal, aspirational: e.target.value})}
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visão de 3 Anos (Global)</label>
              <button onClick={() => handleRefine('threeYear')} disabled={!!isRefining} className="text-[9px] font-bold uppercase text-emerald-500 flex items-center space-x-1">
                {isRefining === 'threeYear' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Refinar</span>
              </button>
            </div>
            <textarea 
              className="w-full bg-white border border-gray-100 rounded-xl p-4 text-sm focus:ring-1 focus:ring-gray-200 outline-none min-h-[80px]"
              value={tempGlobal.threeYear}
              onChange={e => setTempGlobal({...tempGlobal, threeYear: e.target.value})}
            />
          </section>

          <section>
            <div className="flex justify-between items-center mb-2">
              <label className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Visão do Ciclo Atual (12 Semanas)</label>
              <button onClick={() => handleRefine('twelveWeek')} disabled={!!isRefining} className="text-[9px] font-bold uppercase text-emerald-500 flex items-center space-x-1">
                {isRefining === 'twelveWeek' ? <Loader2 size={12} className="animate-spin" /> : <Sparkles size={12} />}
                <span>Refinar</span>
              </button>
            </div>
            <textarea 
              className="w-full bg-emerald-50/30 border border-emerald-100 rounded-xl p-4 text-sm focus:ring-1 focus:ring-emerald-200 outline-none min-h-[80px]"
              value={tempCycleVision}
              onChange={e => setTempCycleVision(e.target.value)}
            />
          </section>

          <button onClick={handleSave} className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold">Salvar Visões</button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {showEncarte && (
        <EducationCard 
          encarte={EDUCATIONAL_ENCARTES.vision} 
          onDismiss={(id) => updateState({ seenEncartes: [...state.seenEncartes, id] })} 
        />
      )}
      <header className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Visão</h1>
          <p className="text-gray-500 text-sm">Seu norte diário.</p>
        </div>
        <button onClick={() => setIsEditing(true)} className="text-xs font-semibold text-gray-400 uppercase tracking-widest hover:text-gray-900 transition-colors">Editar</button>
      </header>
      <div className="space-y-10 py-6">
        <section className="border-l-2 border-gray-900 pl-6 py-2">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2">Aspiracional</h2>
          <p className="text-lg font-medium leading-relaxed italic text-gray-900">"{state.globalVision.aspirational}"</p>
        </section>
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-3">Próximos 3 Anos</h2>
          <p className="text-sm text-gray-700 leading-relaxed">{state.globalVision.threeYear}</p>
        </section>
        <section className="bg-emerald-50 p-6 rounded-3xl border border-emerald-100 shadow-sm">
          <div className="flex items-center space-x-2 mb-3">
             <h2 className="text-[10px] font-bold uppercase tracking-widest text-emerald-600">Foco do Ciclo: {activeCycle?.name}</h2>
          </div>
          <p className="text-sm text-emerald-900 font-semibold italic">"{activeCycle?.twelveWeekVision || 'Defina sua visão para este ciclo.'}"</p>
        </section>
      </div>
    </div>
  );
};
