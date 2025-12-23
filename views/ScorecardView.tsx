
import React from 'react';
import { Cycle, AppState } from '../types';
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Cell, ReferenceLine, Tooltip } from 'recharts';
import { EducationCard } from '../components/EducationCard';
import { EDUCATIONAL_ENCARTES } from '../constants';
import { Trophy, TrendingUp, AlertCircle, Sparkles } from 'lucide-react';

interface ScorecardViewProps {
  activeCycle: Cycle;
  seenEncartes: string[];
  updateGlobalState: (newState: Partial<AppState>) => void;
}

export const ScorecardView: React.FC<ScorecardViewProps> = ({ activeCycle, seenEncartes, updateGlobalState }) => {
  const showEncarte = !seenEncartes.includes('score');
  const showBonusEncarte = !seenEncartes.includes('scorecard_85');

  const weeklyData = Array.from({ length: 12 }, (_, i) => {
    const weekNum = i + 1;
    let total = 0;
    let completed = 0;

    activeCycle.goals.forEach(goal => {
      goal.tactics.forEach(tactic => {
        if (tactic.weeks.includes(weekNum)) {
          total++;
          if (tactic.completedWeeks.includes(weekNum)) {
            completed++;
          }
        }
      });
    });

    const percentage = total === 0 ? 0 : Math.round((completed / total) * 100);
    return {
      week: `S${weekNum}`,
      score: percentage,
      isExceeding: percentage >= 85
    };
  });

  const currentScore = weeklyData[activeCycle.currentWeek - 1]?.score || 0;
  const avgScore = Math.round(weeklyData.slice(0, activeCycle.currentWeek).reduce((acc, curr) => acc + curr.score, 0) / activeCycle.currentWeek);

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
      {showEncarte && (
        <EducationCard 
          encarte={EDUCATIONAL_ENCARTES.score} 
          onDismiss={(id) => updateGlobalState({ seenEncartes: [...seenEncartes, id] })} 
        />
      )}

      <header className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 mb-1">
             <span className="text-[10px] font-bold bg-gray-900 text-white px-2 py-0.5 rounded uppercase">{activeCycle.status === 'completed' ? 'Finalizado' : 'Ativo'}</span>
             <h1 className="text-4xl md:text-5xl font-light tracking-tight text-gray-900">Scorecard</h1>
          </div>
          <p className="text-gray-500 text-lg">Métricas do ciclo: <span className="font-semibold text-gray-900">{activeCycle.name}</span></p>
        </div>
        {activeCycle.status === 'completed' && (
          <div className="flex items-center space-x-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-2xl border border-emerald-100">
            <Sparkles size={18} />
            <span className="text-sm font-bold uppercase tracking-widest">Meta Superada</span>
          </div>
        )}
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
             <Trophy size={100} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-hover:text-emerald-500 transition-colors">
            {activeCycle.status === 'completed' ? 'Score Final' : 'Semana Atual'}
          </p>
          <div className="flex items-end space-x-3">
            <span className={`text-5xl md:text-6xl font-black tracking-tight ${currentScore >= 85 ? 'text-emerald-500' : 'text-gray-900'}`}>
              {currentScore}%
            </span>
            {currentScore >= 85 && <Trophy size={32} className="text-emerald-500 mb-2" />}
          </div>
        </div>
        
        <div className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm hover:shadow-md transition-shadow group relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
             <TrendingUp size={100} />
          </div>
          <p className="text-[10px] font-bold uppercase tracking-widest text-gray-400 mb-2 group-hover:text-blue-500 transition-colors">Média do Ciclo</p>
          <div className="flex items-end space-x-3">
            <span className="text-5xl md:text-6xl font-black tracking-tight text-gray-900">{avgScore}%</span>
            <TrendingUp size={32} className="text-blue-500 mb-2" />
          </div>
        </div>
      </div>

      <section className="bg-white p-8 rounded-[2rem] border border-gray-100 shadow-sm h-[450px]">
        <div className="flex justify-between items-center mb-10">
          <h3 className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Histórico de Execução (12 Semanas)</h3>
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Excelência (85%+)</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <div className="w-2.5 h-2.5 rounded-full bg-gray-900" />
              <span className="text-[10px] font-bold text-gray-400 uppercase">Semana Atual</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={weeklyData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
            <XAxis 
              dataKey="week" 
              axisLine={false} 
              tickLine={false} 
              tick={{ fontSize: 11, fontWeight: 700, fill: '#D1D5DB' }} 
              dy={15}
            />
            <YAxis hide domain={[0, 100]} />
            <Tooltip 
              cursor={{ fill: '#F9FAFB' }} 
              contentStyle={{ borderRadius: '24px', border: 'none', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)', padding: '16px' }}
              itemStyle={{ fontSize: '12px', fontWeight: 'bold' }}
            />
            <ReferenceLine y={85} stroke="#10B981" strokeDasharray="8 8" strokeWidth={2} opacity={0.3} />
            <Bar dataKey="score" radius={[10, 10, 10, 10]} barSize={40}>
              {weeklyData.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={entry.score >= 85 ? '#10B981' : (index + 1 === activeCycle.currentWeek ? '#111827' : '#F3F4F6')} 
                  className="transition-all duration-500 hover:opacity-80"
                />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </section>

      {currentScore < 85 && activeCycle.status === 'active' && (
        <div className="bg-amber-50 border border-amber-100 p-8 rounded-3xl flex items-start space-x-6">
          <div className="bg-amber-100 p-3 rounded-2xl text-amber-600 shadow-sm shadow-amber-200/50">
            <AlertCircle size={28} />
          </div>
          <div className="space-y-2">
            <h4 className="font-bold text-amber-900 text-base">Alerta de Performance</h4>
            <p className="text-sm text-amber-800/80 leading-relaxed max-w-2xl">
              Sua execução atual de <span className="font-bold">{currentScore}%</span> está abaixo da meta de excelência. Lembre-se: no Ciclo de 12 Semanas, cada dia é um mês. Revise suas táticas no Plano e priorize o essencial.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};
