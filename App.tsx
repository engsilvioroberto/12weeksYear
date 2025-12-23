
import React, { useState, useEffect } from 'react';
import { Layout } from './components/Layout';
import { View, AppState, Goal, Cycle } from './types';
import { VisionView } from './views/VisionView';
import { PlanView } from './views/PlanView';
import { WeekView } from './views/WeekView';
import { ScorecardView } from './views/ScorecardView';
import { ProfileView } from './views/ProfileView';
import { CyclesView } from './views/CyclesView';

const STORAGE_KEY = '1ano12semanas_v2';

const MOCK_COMPLETED_CYCLE: Cycle = {
  id: 'cycle-old-1',
  name: 'Ciclo 01: Q1/2025 - Decolagem',
  startDate: '2025-01-01',
  endDate: '2025-03-26',
  status: 'completed',
  currentWeek: 12,
  twelveWeekVision: 'Estabelecer as bases do meu negócio digital.',
  finalScore: 82,
  goals: [
    {
      id: 'old-g1',
      title: 'Lançar Mentoria Beta',
      tactics: [
        { id: 'ot1', description: 'Definir currículo', weeks: [1, 2], completedWeeks: [1, 2] },
        { id: 'ot2', description: 'Vender 5 vagas', weeks: [3, 4], completedWeeks: [3] }
      ]
    },
    {
      id: 'old-g2',
      title: 'Rotina de Saúde 80%',
      tactics: [
        { id: 'ot3', description: 'Academia 3x', weeks: [1,2,3,4,5,6,7,8,9,10,11,12], completedWeeks: [1,2,3,5,6,7,8,10,11,12] }
      ]
    }
  ]
};

const MOCK_ACTIVE_GOALS: Goal[] = [
  {
    id: 'goal-1',
    title: 'Lançar Novo Curso "Alta Performance 12S"',
    tactics: [
      { id: 't-1-1', description: 'Gravar 3 módulos do curso por semana', weeks: [1, 2, 3, 4], completedWeeks: [1] },
      { id: 't-1-2', description: 'Criar funil de vendas e landing page', weeks: [1, 2], completedWeeks: [1] },
      { id: 't-1-3', description: 'Fazer 3 lives de aquecimento semanais', weeks: [3, 4, 5, 6], completedWeeks: [] }
    ]
  },
  {
    id: 'goal-2',
    title: 'Dobrar Energia e Condicionamento Físico',
    tactics: [
      { id: 't-2-1', description: 'Treinar na academia 4x por semana', weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], completedWeeks: [1] },
      { id: 't-2-2', description: 'Beber 3 litros de água por dia', weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], completedWeeks: [1] }
    ]
  }
];

const INITIAL_STATE: AppState = {
  globalVision: {
    aspirational: 'Ser a maior referência em consultoria de produtividade do Brasil.',
    threeYear: 'Faturamento anual de R$ 2M, equipe de 5 pessoas.'
  },
  cycles: [
    {
      id: 'cycle-current',
      name: 'Ciclo 02: Expansão',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      currentWeek: 1,
      twelveWeekVision: 'Validar o novo método de mentoria em grupo.',
      goals: MOCK_ACTIVE_GOALS
    },
    MOCK_COMPLETED_CYCLE
  ],
  activeCycleId: 'cycle-current',
  viewingCycleId: 'cycle-current',
  seenEncartes: []
};

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.PLAN);
  const [state, setState] = useState<AppState>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : INITIAL_STATE;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  }, [state]);

  const updateState = (newState: Partial<AppState>) => {
    setState(prev => ({ ...prev, ...newState }));
  };

  const activeCycle = state.cycles.find(c => c.id === state.activeCycleId) || state.cycles[0];
  const viewingCycle = state.cycles.find(c => c.id === state.viewingCycleId) || activeCycle;

  const updateViewingCycle = (updates: Partial<Cycle>) => {
    updateState({
      cycles: state.cycles.map(c => 
        c.id === viewingCycle.id ? { ...c, ...updates } : c
      )
    });
  };

  const renderView = () => {
    switch (currentView) {
      case View.CYCLES: return <CyclesView state={state} updateState={updateState} />;
      case View.VISION: return <VisionView state={state} updateState={updateState} />;
      case View.PLAN: return <PlanView activeCycle={viewingCycle} updateActiveCycle={updateViewingCycle} seenEncartes={state.seenEncartes} updateGlobalState={updateState} />;
      case View.WEEK: return <WeekView activeCycle={viewingCycle} updateActiveCycle={updateViewingCycle} />;
      case View.SCORE: return <ScorecardView activeCycle={viewingCycle} seenEncartes={state.seenEncartes} updateGlobalState={updateState} />;
      case View.PROFILE: return <ProfileView state={state} updateState={updateState} />;
      default: return <CyclesView state={state} updateState={updateState} />;
    }
  };

  return (
    <Layout 
      currentView={currentView} 
      setView={setCurrentView}
      activeCycleName={viewingCycle?.name}
      isViewingPastCycle={viewingCycle.id !== state.activeCycleId}
      onReturnToActive={() => updateState({ viewingCycleId: state.activeCycleId })}
    >
      <div key={`${currentView}-${state.viewingCycleId}`} className="view-transition">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
