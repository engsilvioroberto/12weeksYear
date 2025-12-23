
import React, { useState } from 'react';
import { AppState, Cycle, Goal } from '../types';
import { 
  Plus, 
  CheckCircle2, 
  Circle, 
  Calendar, 
  ChevronRight, 
  History, 
  Sparkles, 
  X, 
  Eye, 
  ChevronDown, 
  Target,
  Lock
} from 'lucide-react';

interface CyclesViewProps {
  state: AppState;
  updateState: (newState: Partial<AppState>) => void;
}

const TacticHistory: React.FC<{ tactic: any }> = ({ tactic }) => {
  return (
    <div className="flex flex-col space-y-2 py-2">
      <div className="flex justify-between items-center text-[11px]">
        <span className="text-gray-600 font-medium">{tactic.description}</span>
        <span className="text-gray-400 font-bold">{tactic.completedWeeks.length}/{tactic.weeks.length}</span>
      </div>
      <div className="flex space-x-1">
        {Array.from({ length: 12 }, (_, i) => i + 1).map(w => {
          const isPlanned = tactic.weeks.includes(w);
          const isDone = tactic.completedWeeks.includes(w);
          
          return (
            <div 
              key={w}
              title={isPlanned ? (isDone ? `Semana ${w}: Concluída` : `Semana ${w}: Não executada`) : `Semana ${w}: Fora do plano`}
              className={`h-1.5 flex-1 rounded-full transition-all ${
                isDone 
                  ? 'bg-emerald-500' 
                  : isPlanned 
                    ? 'bg-gray-200' 
                    : 'bg-gray-50'
              }`}
            />
          );
        })}
      </div>
    </div>
  );
};

export const CyclesView: React.FC<CyclesViewProps> = ({ state, updateState }) => {
  const [isCreating, setIsCreating] = useState(false);
  const [newCycleName, setNewCycleName] = useState('');
  const [newCycleDates, setNewCycleDates] = useState({ start: '', end: '' });
  const [expandedGoalId, setExpandedGoalId] = useState<string | null>(null);

  const createCycle = () => {
    if (!newCycleName.trim()) return;

    const newCycle: Cycle = {
      id: crypto.randomUUID(),
      name: newCycleName,
      startDate: newCycleDates.start || new Date().toISOString().split('T')[0],
      endDate: newCycleDates.end || '',
      goals: [],
      currentWeek: 1,
      status: 'active',
      twelveWeekVision: ''
    };

    updateState({
      cycles: [newCycle, ...state.cycles],
      activeCycleId: newCycle.id,
      viewingCycleId: newCycle.id
    });
    setIsCreating(false);
    setNewCycleName('');
  };

  const selectCycle = (id: string) => {
    updateState({ viewingCycleId: id });
    setExpandedGoalId(null); // Reset expansion when switching cycles
  };

  const deleteCycle = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (state.cycles.length <= 1) return;
    const remaining = state.cycles.filter(c => c.id !== id);
    updateState({
      cycles: remaining,
      activeCycleId: id === state.activeCycleId ? remaining[0].id : state.activeCycleId,
      viewingCycleId: id === state.viewingCycleId ? remaining[0].id : state.viewingCycleId
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-4xl font-light tracking-tight">Ciclos</h1>
          <p className="text-gray-500 text-sm">Gerencie seus períodos de execução.</p>
        </div>
        {!isCreating && (
          <button 
            onClick={() => setIsCreating(true)}
            className="flex items-center space-x-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-semibold hover:bg-black transition-all shadow-lg shadow-gray-200"
          >
            <Plus size={18} />
            <span className="hidden md:inline">Novo Ciclo</span>
          </button>
        )}
      </header>

      {isCreating && (
        <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl space-y-6 animate-in slide-in-from-top-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xs font-bold uppercase tracking-widest text-gray-400">Configurar Novo Período</h3>
            <button onClick={() => setIsCreating(false)}><X size={18} className="text-gray-300" /></button>
          </div>
          
          <div className="space-y-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Nome do Ciclo</label>
              <input 
                className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-gray-200"
                placeholder="Ex: Q2 - Lançamento Produto X"
                autoFocus
                value={newCycleName}
                onChange={e => setNewCycleName(e.target.value)}
              />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Data de Início</label>
                <input 
                  type="date"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-gray-200"
                  value={newCycleDates.start}
                  onChange={e => setNewCycleDates({...newCycleDates, start: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-400 uppercase mb-2">Meta Final (Opcional)</label>
                <input 
                  type="date"
                  className="w-full bg-gray-50 border border-gray-100 rounded-xl p-4 text-sm outline-none focus:ring-1 focus:ring-gray-200"
                  value={newCycleDates.end}
                  onChange={e => setNewCycleDates({...newCycleDates, end: e.target.value})}
                />
              </div>
            </div>
          </div>

          <button 
            onClick={createCycle}
            disabled={!newCycleName.trim()}
            className="w-full bg-gray-900 text-white py-4 rounded-xl font-bold hover:bg-black transition-all disabled:opacity-30"
          >
            Iniciar Jornada de 12 Semanas
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4">
        {state.cycles.map(cycle => {
          const isViewing = cycle.id === state.viewingCycleId;
          const isActive = cycle.id === state.activeCycleId;
          const isCompleted = cycle.status === 'completed';
          
          return (
            <div 
              key={cycle.id}
              className={`flex flex-col rounded-3xl border transition-all overflow-hidden ${
                isViewing 
                  ? 'bg-white border-emerald-500 ring-1 ring-emerald-500 shadow-xl' 
                  : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
              }`}
            >
              <button 
                onClick={() => selectCycle(cycle.id)}
                className="w-full text-left p-6 flex items-center space-x-6 relative group"
              >
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 transition-colors ${
                  isActive ? 'bg-gray-900 text-emerald-400 shadow-lg shadow-emerald-400/10' : isCompleted ? 'bg-emerald-50 text-emerald-500' : 'bg-gray-50 text-gray-400'
                }`}>
                  {isCompleted ? <CheckCircle2 size={24} /> : isActive ? <Sparkles size={24} /> : <Circle size={24} />}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-2 mb-1">
                    <h3 className={`font-bold truncate ${isViewing ? 'text-gray-900' : 'text-gray-700'}`}>{cycle.name}</h3>
                    {isActive && <span className="bg-emerald-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-sm">Ativo</span>}
                    {isViewing && !isActive && <span className="bg-blue-500 text-white text-[8px] font-bold uppercase px-1.5 py-0.5 rounded shadow-sm flex items-center"><Eye size={8} className="mr-1"/> Visualizando</span>}
                  </div>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-gray-400">
                    <div className="flex items-center space-x-1">
                      <Calendar size={12} />
                      <span>Início: {cycle.startDate || 'N/A'}</span>
                    </div>
                    <span>•</span>
                    <span>{cycle.goals.length} Metas</span>
                    {cycle.finalScore !== undefined && (
                      <>
                        <span>•</span>
                        <span className="font-bold text-emerald-600">Score Final: {cycle.finalScore}%</span>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <ChevronRight size={20} className={`text-gray-300 transition-transform ${isViewing ? 'rotate-90 text-emerald-500' : 'group-hover:translate-x-1'}`} />
                </div>
                
                {!isActive && state.cycles.length > 1 && (
                  <button 
                    onClick={(e) => deleteCycle(cycle.id, e)}
                    className="absolute -top-2 -right-2 p-1.5 bg-red-50 text-red-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity border border-red-100 hover:bg-red-100 shadow-sm"
                  >
                    <X size={12} />
                  </button>
                )}
              </button>

              {/* Inline Inspector for the selected cycle */}
              {isViewing && (
                <div className="bg-gray-50/50 border-t border-gray-100 px-6 py-6 animate-in slide-in-from-top-2 duration-300">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 flex items-center">
                      <History size={12} className="mr-2" /> 
                      {isCompleted ? 'Auditoria de Histórico' : 'Conteúdo do Ciclo Atual'}
                    </h4>
                    {isCompleted && (
                      <div className="flex items-center space-x-1 text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded">
                        <Lock size={10} />
                        <span>MODO LEITURA</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    {cycle.goals.length > 0 ? cycle.goals.map((goal: Goal) => (
                      <div key={goal.id} className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                        <button 
                          onClick={() => setExpandedGoalId(expandedGoalId === goal.id ? null : goal.id)}
                          className="w-full flex items-center justify-between p-4 hover:bg-gray-50 transition-colors"
                        >
                          <div className="flex items-center space-x-3">
                            <Target size={16} className="text-gray-400" />
                            <span className="text-sm font-bold text-gray-700">{goal.title}</span>
                          </div>
                          <ChevronDown size={16} className={`text-gray-300 transition-transform ${expandedGoalId === goal.id ? 'rotate-180' : ''}`} />
                        </button>
                        
                        {expandedGoalId === goal.id && (
                          <div className="p-4 pt-0 space-y-4 border-t border-gray-50 animate-in fade-in slide-in-from-top-1">
                            <div className="mt-4 space-y-3">
                              {goal.tactics.map(tactic => (
                                <TacticHistory key={tactic.id} tactic={tactic} />
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )) : (
                      <p className="text-center py-4 text-xs text-gray-400 italic">Nenhuma meta definida para este ciclo.</p>
                    )}
                  </div>

                  {!isActive && (
                    <div className="mt-6 pt-4 border-t border-gray-200/50 flex justify-center">
                      <p className="text-[10px] text-gray-400 text-center max-w-xs">
                        Para editar ou executar este ciclo, você deve primeiro torná-lo o ciclo ativo em sua conta.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {state.cycles.length === 0 && (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <History size={48} className="mx-auto text-gray-200 mb-4" />
          <p className="text-gray-400 font-medium">Nenhum ciclo encontrado.</p>
          <button onClick={() => setIsCreating(true)} className="mt-4 text-gray-900 font-bold underline">Criar meu primeiro ciclo</button>
        </div>
      )}
    </div>
  );
};
