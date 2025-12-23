
import React, { useState } from 'react';
import { Goal, Tactic, Cycle, AppState } from '../types';
// Fixed: Added 'LayoutList' to imports to resolve "Cannot find name 'LayoutList'" error on line 332
import { Plus, Trash2, ChevronRight, X, Info, Sparkles, Loader2, ExternalLink, Check, Pencil, LayoutList } from 'lucide-react';
import { EducationCard } from '../components/EducationCard';
import { EDUCATIONAL_ENCARTES } from '../constants';
import { suggestTactics } from '../lib/ai';

interface PlanViewProps {
  activeCycle: Cycle;
  updateActiveCycle: (updates: Partial<Cycle>) => void;
  seenEncartes: string[];
  updateGlobalState: (newState: Partial<AppState>) => void;
}

const MethodologyHint: React.FC<{ text: string }> = ({ text }) => (
  <div className="group relative inline-block ml-1 align-middle">
    <Info size={12} className="text-gray-300 cursor-help hover:text-gray-500 transition-colors" />
    <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 w-48 p-2 bg-gray-900 text-white text-[10px] rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50 shadow-xl leading-relaxed">
      {text}
      <div className="absolute top-full left-1/2 -translate-x-1/2 border-4 border-transparent border-t-gray-900"></div>
    </div>
  </div>
);

export const PlanView: React.FC<PlanViewProps> = ({ activeCycle, updateActiveCycle, seenEncartes, updateGlobalState }) => {
  const [isAddingGoal, setIsAddingGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [isSuggesting, setIsSuggesting] = useState(false);
  const [aiSuggestions, setAiSuggestions] = useState<{tactics: string[], sources: any[]}>({tactics: [], sources: []});
  const [selectedAiTactics, setSelectedAiTactics] = useState<string[]>([]);
  
  const [addingTacticToGoalId, setAddingTacticToGoalId] = useState<string | null>(null);
  const [editingTacticId, setEditingTacticId] = useState<string | null>(null);
  
  const [newTacticDesc, setNewTacticDesc] = useState('');
  const [selectedWeeks, setSelectedWeeks] = useState<number[]>([]);

  const isReadOnly = activeCycle.status === 'completed';

  const handleAISuggest = async () => {
    if (!newGoalTitle.trim() || isReadOnly) return;
    setIsSuggesting(true);
    setSelectedAiTactics([]);
    try {
      const result = await suggestTactics(newGoalTitle);
      setAiSuggestions(result);
    } catch (error) {
      console.error("Erro ao sugerir táticas:", error);
    } finally {
      setIsSuggesting(false);
    }
  };

  const toggleAiTacticSelection = (tactic: string) => {
    if (isReadOnly) return;
    setSelectedAiTactics(prev => 
      prev.includes(tactic) 
        ? prev.filter(t => t !== tactic) 
        : [...prev, tactic]
    );
  };

  const addGoal = () => {
    if (!newGoalTitle.trim() || isReadOnly) return;
    
    const initialTactics: Tactic[] = selectedAiTactics.map(desc => ({
      id: crypto.randomUUID(),
      description: desc,
      weeks: Array.from({ length: 12 }, (_, i) => i + 1),
      completedWeeks: []
    }));

    const newGoal: Goal = {
      id: crypto.randomUUID(),
      title: newGoalTitle,
      tactics: initialTactics
    };

    updateActiveCycle({ goals: [...activeCycle.goals, newGoal] });
    setNewGoalTitle('');
    setIsAddingGoal(false);
    setAiSuggestions({tactics: [], sources: []});
    setSelectedAiTactics([]);
  };

  const removeGoal = (id: string) => {
    if (isReadOnly) return;
    updateActiveCycle({ goals: activeCycle.goals.filter(g => g.id !== id) });
  };

  const handleToggleWeek = (week: number) => {
    if (isReadOnly) return;
    setSelectedWeeks(prev => 
      prev.includes(week) ? prev.filter(w => w !== week) : [...prev, week].sort((a, b) => a - b)
    );
  };

  const handleSelectAllWeeks = () => {
    if (isReadOnly) return;
    if (selectedWeeks.length === 12) {
      setSelectedWeeks([]);
    } else {
      setSelectedWeeks(Array.from({ length: 12 }, (_, i) => i + 1));
    }
  };

  const saveTactic = (goalId: string) => {
    if (!newTacticDesc.trim() || selectedWeeks.length === 0 || isReadOnly) return;

    if (editingTacticId) {
      updateActiveCycle({
        goals: activeCycle.goals.map(g => 
          g.id === goalId ? { 
            ...g, 
            tactics: g.tactics.map(t => 
              t.id === editingTacticId 
                ? { ...t, description: newTacticDesc, weeks: selectedWeeks } 
                : t
            ) 
          } : g
        )
      });
    } else {
      const newTactic: Tactic = {
        id: crypto.randomUUID(),
        description: newTacticDesc,
        weeks: selectedWeeks,
        completedWeeks: []
      };

      updateActiveCycle({
        goals: activeCycle.goals.map(g => 
          g.id === goalId ? { ...g, tactics: [...g.tactics, newTactic] } : g
        )
      });
    }

    setAddingTacticToGoalId(null);
    setEditingTacticId(null);
    setNewTacticDesc('');
    setSelectedWeeks([]);
  };

  const startEditingTactic = (goalId: string, tactic: Tactic) => {
    if (isReadOnly) return;
    setAddingTacticToGoalId(goalId);
    setEditingTacticId(tactic.id);
    setNewTacticDesc(tactic.description);
    setSelectedWeeks(tactic.weeks);
  };

  const removeTactic = (goalId: string, tacticId: string) => {
    if (isReadOnly) return;
    updateActiveCycle({
      goals: activeCycle.goals.map(g => 
        g.id === goalId 
          ? { ...g, tactics: g.tactics.filter(t => t.id !== tacticId) } 
          : g
      )
    });
  };

  const showEncarte = !seenEncartes.includes('plan');

  return (
    <div className="space-y-8">
      {showEncarte && (
        <EducationCard 
          encarte={EDUCATIONAL_ENCARTES.plan} 
          onDismiss={(id) => updateGlobalState({ seenEncartes: [...seenEncartes, id] })} 
        />
      )}

      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-light tracking-tight">Plano: {activeCycle.name}</h1>
          <p className="text-gray-500 text-sm">{isReadOnly ? 'Ciclo finalizado (Apenas leitura)' : 'Sua estratégia de 12 semanas.'}</p>
        </div>
        {!isReadOnly && activeCycle.goals.length < 5 && !isAddingGoal && (
          <button 
            onClick={() => setIsAddingGoal(true)}
            className="p-2 bg-gray-900 text-white rounded-full hover:bg-black transition-colors"
          >
            <Plus size={20} />
          </button>
        )}
      </header>

      {isAddingGoal && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-4 animate-in slide-in-from-top-2">
          <div className="flex items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Nova Meta para este Ciclo</h3>
          </div>
          <div className="flex space-x-2">
            <input 
              className="flex-1 bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-gray-200"
              placeholder="Ex: Dobrar número de leads..."
              autoFocus
              value={newGoalTitle}
              onChange={e => setNewGoalTitle(e.target.value)}
            />
            <button 
                onClick={handleAISuggest}
                disabled={isSuggesting || !newGoalTitle.trim()}
                className="px-4 bg-emerald-50 text-emerald-600 rounded-xl flex flex-col items-center justify-center hover:bg-emerald-100 transition-colors disabled:opacity-30 min-w-[100px] border border-emerald-100"
            >
                {isSuggesting ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
                <span className="text-[8px] font-bold uppercase mt-1 text-center leading-tight">Sugestões IA</span>
            </button>
          </div>

          {aiSuggestions.tactics.length > 0 && (
            <div className="p-4 bg-emerald-50/30 rounded-xl border border-emerald-100 space-y-3">
                <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-widest flex items-center">
                  <Sparkles size={10} className="mr-1" /> Selecione as táticas sugeridas
                </p>
                <div className="space-y-2 max-h-60 overflow-y-auto pr-2">
                    {aiSuggestions.tactics.map((t, i) => {
                        const isSelected = selectedAiTactics.includes(t);
                        return (
                          <button 
                              key={i} 
                              onClick={() => toggleAiTacticSelection(t)}
                              className={`w-full text-left text-xs p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                                isSelected ? 'bg-emerald-50 border-emerald-300' : 'bg-white border-emerald-50'
                              }`}
                          >
                              <div className={`mt-0.5 flex-shrink-0 w-4 h-4 rounded border flex items-center justify-center ${isSelected ? 'bg-emerald-500 border-emerald-500 text-white' : 'bg-white border-gray-300'}`}>
                                {isSelected && <Check size={10} />}
                              </div>
                              <span className={isSelected ? 'text-emerald-900' : 'text-gray-700'}>{t}</span>
                          </button>
                        );
                    })}
                </div>
            </div>
          )}

          <div className="flex space-x-2">
            <button onClick={addGoal} className="flex-1 bg-gray-900 text-white py-3 rounded-xl text-sm font-medium">Criar</button>
            <button onClick={() => { setIsAddingGoal(false); setAiSuggestions({tactics: [], sources: []}); }} className="flex-1 bg-gray-100 text-gray-600 py-3 rounded-xl text-sm font-medium">Cancelar</button>
          </div>
        </div>
      )}

      <div className="space-y-6">
        {activeCycle.goals.map(goal => (
          <div key={goal.id} className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden group">
            <div className="p-6 flex justify-between items-start">
              <div className="flex-1">
                <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Meta Estratégica</h3>
                <h2 className="text-xl font-bold text-gray-900">{goal.title}</h2>
              </div>
              {!isReadOnly && <button onClick={() => removeGoal(goal.id)} className="text-gray-200 hover:text-red-500 p-2"><Trash2 size={18} /></button>}
            </div>

            <div className="px-6 pb-6 space-y-4">
              <h4 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Plano de Execução</h4>
              <div className="space-y-2">
                {goal.tactics.map(tactic => (
                  editingTacticId === tactic.id ? (
                    <div key={tactic.id} className="p-4 bg-blue-50/50 rounded-2xl border border-blue-100 space-y-4">
                       <input 
                        className="w-full bg-white border border-blue-100 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-blue-200"
                        value={newTacticDesc}
                        onChange={e => setNewTacticDesc(e.target.value)}
                        autoFocus
                      />
                      <div className="grid grid-cols-6 gap-2">
                          {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                            <button key={w} onClick={() => handleToggleWeek(w)} className={`h-8 rounded-lg text-[10px] font-bold border transition-all ${selectedWeeks.includes(w) ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-400 border-gray-100'}`}>{w}</button>
                          ))}
                      </div>
                      <div className="flex space-x-2">
                        <button onClick={() => saveTactic(goal.id)} className="flex-1 bg-blue-600 text-white py-2 rounded-lg text-xs font-bold uppercase">Salvar</button>
                        <button onClick={() => setEditingTacticId(null)} className="flex-1 bg-white text-gray-500 py-2 rounded-lg text-xs font-bold uppercase border">Cancelar</button>
                      </div>
                    </div>
                  ) : (
                    <div key={tactic.id} className="group/item flex items-center space-x-3 text-sm bg-gray-50/50 p-4 rounded-2xl border border-gray-100/50 hover:bg-white transition-all">
                      <ChevronRight size={14} className="text-gray-300" />
                      <span className="flex-1 text-gray-700 font-medium">{tactic.description}</span>
                      <div className="flex items-center space-x-3">
                        <span className="text-[9px] font-black text-gray-400 bg-gray-100/50 px-2 py-1 rounded-md uppercase">S{tactic.weeks.join(',')}</span>
                        {!isReadOnly && (
                          <div className="flex items-center space-x-1 opacity-0 group-hover/item:opacity-100 transition-opacity">
                            <button onClick={() => startEditingTactic(goal.id, tactic)} className="p-1.5 text-gray-400 hover:text-blue-500"><Pencil size={14} /></button>
                            <button onClick={() => removeTactic(goal.id, tactic.id)} className="p-1.5 text-gray-400 hover:text-red-500"><X size={14} /></button>
                          </div>
                        )}
                      </div>
                    </div>
                  )
                ))}
              </div>

              {!isReadOnly && !editingTacticId && (
                addingTacticToGoalId === goal.id ? (
                  <div className="p-4 bg-gray-50 rounded-2xl border border-gray-200 space-y-4">
                    <input 
                      className="w-full bg-white border border-gray-200 rounded-xl p-3 text-sm outline-none focus:ring-1 focus:ring-gray-300"
                      placeholder="Descrição da tática..."
                      value={newTacticDesc}
                      onChange={e => setNewTacticDesc(e.target.value)}
                      autoFocus
                    />
                    <div className="grid grid-cols-6 gap-2">
                        {Array.from({ length: 12 }, (_, i) => i + 1).map(w => (
                          <button key={w} onClick={() => handleToggleWeek(w)} className={`h-8 rounded-lg text-[10px] font-bold border transition-all ${selectedWeeks.includes(w) ? 'bg-gray-900 text-white border-gray-900' : 'bg-white text-gray-400 border-gray-100'}`}>{w}</button>
                        ))}
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={saveTactic(goal.id)} className="flex-1 bg-gray-900 text-white py-2 rounded-lg text-xs font-bold uppercase">Confirmar</button>
                      <button onClick={() => setAddingTacticToGoalId(null)} className="flex-1 bg-white text-gray-500 py-2 rounded-lg text-xs font-bold uppercase border">Cancelar</button>
                    </div>
                  </div>
                ) : (
                  <button onClick={() => {
                    setAddingTacticToGoalId(goal.id);
                    setNewTacticDesc('');
                    setSelectedWeeks(Array.from({ length: 12 }, (_, i) => i + 1));
                  }} className="w-full py-4 border-2 border-dashed border-gray-100 rounded-2xl text-[10px] font-bold text-gray-400 uppercase tracking-widest hover:border-gray-200 transition-all">+ Adicionar Tática</button>
                )
              )}
            </div>
          </div>
        ))}

        {activeCycle.goals.length === 0 && (
          <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
             <LayoutList size={40} className="mx-auto text-gray-100 mb-4" />
             <p className="text-gray-400 font-medium italic">Seu plano está em branco para este ciclo.</p>
             {!isReadOnly && <button onClick={() => setIsAddingGoal(true)} className="mt-4 text-gray-900 font-bold underline">Criar meta agora</button>}
          </div>
        )}
      </div>
    </div>
  );
};
