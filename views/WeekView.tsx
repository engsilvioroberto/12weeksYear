
import React, { useState, useEffect, useMemo } from 'react';
import { Cycle, Tactic } from '../types';
// Fixed: Added 'Calendar' to imports to resolve "Cannot find name 'Calendar'" error on line 124
import { CheckCircle2, Circle, Clock, Play, Pause, RotateCcw, Target, Sparkles, ChevronLeft, ChevronRight, Calendar } from 'lucide-react';
import { AICoach } from '../components/AICoach';

interface WeekViewProps {
  activeCycle: Cycle;
  updateActiveCycle: (updates: Partial<Cycle>) => void;
}

export const WeekView: React.FC<WeekViewProps> = ({ activeCycle, updateActiveCycle }) => {
  const [timer, setTimer] = useState(15 * 60);
  const [timerActive, setTimerActive] = useState(false);
  const [showAICoach, setShowAICoach] = useState(false);
  const [viewingWeek, setViewingWeek] = useState(activeCycle.currentWeek);

  const isReadOnly = activeCycle.status === 'completed';

  useEffect(() => {
    let interval: any;
    if (timerActive && timer > 0) {
      interval = setInterval(() => setTimer(prev => prev - 1), 1000);
    } else if (timer === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timerActive, timer]);

  const toggleTactic = (goalId: string, tacticId: string) => {
    if (isReadOnly) return;
    const newGoals = activeCycle.goals.map(goal => {
      if (goal.id !== goalId) return goal;
      return {
        ...goal,
        tactics: goal.tactics.map(tactic => {
          if (tactic.id !== tacticId) return tactic;
          const isCompleted = tactic.completedWeeks.includes(viewingWeek);
          return {
            ...tactic,
            completedWeeks: isCompleted 
              ? tactic.completedWeeks.filter(w => w !== viewingWeek)
              : [...tactic.completedWeeks, viewingWeek]
          };
        })
      };
    });
    updateActiveCycle({ goals: newGoals });
  };

  const currentWeekTactics = useMemo(() => {
    const items: Array<{ goalId: string; goalTitle: string; tactic: Tactic }> = [];
    activeCycle.goals.forEach(goal => {
      goal.tactics.forEach(tactic => {
        if (tactic.weeks.includes(viewingWeek)) {
          items.push({ goalId: goal.id, goalTitle: goal.title, tactic });
        }
      });
    });
    return items;
  }, [activeCycle.goals, viewingWeek]);

  const completionStats = useMemo(() => {
    if (currentWeekTactics.length === 0) return 0;
    const completedCount = currentWeekTactics.filter(t => t.tactic.completedWeeks.includes(viewingWeek)).length;
    return Math.round((completedCount / currentWeekTactics.length) * 100);
  }, [currentWeekTactics, viewingWeek]);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {showAICoach && (
        <AICoach 
          onClose={() => setShowAICoach(false)} 
          context={`Visualizando Semana ${viewingWeek} do ciclo "${activeCycle.name}". Progresso: ${completionStats}%.`}
        />
      )}

      <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2 bg-white border border-gray-100 rounded-2xl p-1 shadow-sm">
            <button 
              onClick={() => setViewingWeek(Math.max(1, viewingWeek - 1))}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
            >
              <ChevronLeft size={20} />
            </button>
            <div className="px-4 text-center min-w-[120px]">
              <h1 className="text-xl font-bold text-gray-900 leading-none">Semana {viewingWeek}</h1>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">de 12</p>
            </div>
            <button 
              onClick={() => setViewingWeek(Math.min(12, viewingWeek + 1))}
              className="p-2 hover:bg-gray-50 rounded-xl transition-colors text-gray-400"
            >
              <ChevronRight size={20} />
            </button>
          </div>
          {isReadOnly && <span className="text-[10px] font-bold bg-amber-50 text-amber-600 px-3 py-1 rounded-full border border-amber-100 uppercase">Histórico</span>}
        </div>
        
        {!isReadOnly && viewingWeek === activeCycle.currentWeek && (
          <button 
            onClick={() => setShowAICoach(true)}
            className="flex items-center justify-center space-x-2 px-6 py-3 bg-emerald-500 text-white rounded-2xl text-xs font-bold uppercase tracking-widest shadow-xl shadow-emerald-500/20 hover:bg-emerald-600 transition-all transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Sparkles size={16} />
            <span>Consultar Mentor IA</span>
          </button>
        )}
      </header>

      {currentWeekTactics.length > 0 ? (
        <section className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-4">
          <div className="flex justify-between items-center">
            <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Desempenho da Semana</h3>
            <span className={`text-lg font-bold ${completionStats >= 85 ? 'text-emerald-500' : 'text-gray-900'}`}>{completionStats}%</span>
          </div>
          <div className="h-2.5 w-full bg-gray-50 rounded-full overflow-hidden">
            <div className={`h-full transition-all duration-700 ease-out ${completionStats >= 85 ? 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]' : 'bg-gray-900'}`} style={{ width: `${completionStats}%` }} />
          </div>
        </section>
      ) : (
        <div className="bg-white p-12 rounded-3xl border border-dashed border-gray-200 text-center space-y-2">
            <Calendar size={40} className="mx-auto text-gray-100" />
            <p className="text-gray-400 font-medium">Nenhuma tática agendada para esta semana.</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <section className="md:col-span-2 space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Checklist Semanal</h2>
          <div className="space-y-3">
            {currentWeekTactics.map(({ goalId, goalTitle, tactic }) => {
              const isDone = tactic.completedWeeks.includes(viewingWeek);
              return (
                <button 
                  key={tactic.id} 
                  disabled={isReadOnly}
                  onClick={() => toggleTactic(goalId, tactic.id)} 
                  className={`w-full group flex items-start space-x-4 p-5 rounded-2xl border text-left transition-all ${
                    isDone ? 'bg-emerald-50/50 border-emerald-100' : 'bg-white border-gray-100 hover:border-gray-200 shadow-sm'
                  } ${isReadOnly ? 'cursor-default' : 'active:scale-[0.98]'}`}
                >
                  <div className={`mt-0.5 transition-colors ${isDone ? 'text-emerald-500 check-pop' : 'text-gray-200 group-hover:text-gray-400'}`}>
                    {isDone ? <CheckCircle2 size={24} /> : <Circle size={24} />}
                  </div>
                  <div className="flex-1 overflow-hidden">
                    <span className={`text-[9px] font-bold uppercase mb-1 block tracking-wider ${isDone ? 'text-emerald-600' : 'text-gray-400'}`}>{goalTitle}</span>
                    <p className={`text-[15px] font-semibold transition-all ${isDone ? 'text-emerald-900 line-through opacity-40' : 'text-gray-900'}`}>{tactic.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="space-y-4">
          <h2 className="text-[10px] font-bold uppercase tracking-widest text-gray-400 px-1">Ferramentas de Execução</h2>
          
          <div className="bg-gray-900 text-white p-6 rounded-3xl border border-gray-800 shadow-2xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-8 opacity-5 group-hover:opacity-10 transition-opacity"><Target size={120} /></div>
            <div className="relative z-10 space-y-6">
              <div>
                <h3 className="text-[10px] font-bold uppercase tracking-[0.2em] text-emerald-400 mb-1">Ritmo</h3>
                <p className="text-sm font-medium text-gray-400">Reunião de Responsabilidade</p>
              </div>
              <div className="flex flex-col items-center space-y-4">
                <div className="text-5xl font-mono tabular-nums font-light">{Math.floor(timer/60)}:{(timer%60).toString().padStart(2, '0')}</div>
                <div className="flex space-x-3">
                  <button 
                    onClick={() => setTimerActive(!timerActive)} 
                    disabled={isReadOnly}
                    className={`p-4 rounded-full transition-all ${timerActive ? 'bg-white/10 text-white' : 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/20 active:scale-95'}`}
                  >
                    {timerActive ? <Pause size={20} /> : <Play size={20} />}
                  </button>
                  <button 
                    onClick={() => { setTimer(15*60); setTimerActive(false); }} 
                    disabled={isReadOnly}
                    className="p-4 bg-white/10 rounded-full hover:bg-white/20 transition-all"
                  >
                    <RotateCcw size={20} />
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm space-y-3">
            <h4 className="text-[10px] font-bold uppercase text-gray-400 tracking-widest">Dica do Método</h4>
            <p className="text-xs text-gray-600 leading-relaxed italic">"Não confunda atividade com produtividade. Foque nas táticas que realmente movem o ponteiro das suas metas."</p>
          </div>
        </section>
      </div>
    </div>
  );
};
