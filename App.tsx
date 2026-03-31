
import React, { useState, useEffect, useCallback } from 'react';
import { Layout } from './components/Layout';
import { View, AppState, Goal, Cycle, User } from './types';
import { VisionView } from './views/VisionView';
import { PlanView } from './views/PlanView';
import { WeekView } from './views/WeekView';
import { ScorecardView } from './views/ScorecardView';
import { ProfileView } from './views/ProfileView';
import { CyclesView } from './views/CyclesView';
import { LoginView } from './views/LoginView';

const BASE_STORAGE_KEY = '12S_DATA_';

const MOCK_ACTIVE_GOALS: Goal[] = [
  {
    id: 'goal-demo-1',
    title: 'Minha Primeira Meta Estratégica',
    tactics: [
      { id: 't-demo-1', description: 'Executar tática de exemplo semanal', weeks: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12], completedWeeks: [] }
    ]
  }
];

const getInitialState = (user: User | null): AppState => ({
  user,
  globalVision: {
    aspirational: 'Minha grande visão de vida.',
    threeYear: 'Onde estarei em 3 anos.'
  },
  cycles: [
    {
      id: 'cycle-initial',
      name: 'Ciclo Inicial',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
      status: 'active',
      currentWeek: 1,
      twelveWeekVision: 'Minha visão para as próximas 12 semanas.',
      goals: MOCK_ACTIVE_GOALS
    }
  ],
  activeCycleId: 'cycle-initial',
  viewingCycleId: 'cycle-initial',
  seenEncartes: []
});

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.PLAN);
  const [user, setUser] = useState<User | null>(() => {
    const savedUser = localStorage.getItem('12S_CURRENT_USER');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [state, setState] = useState<AppState | null>(null);

  // Load user-specific data when user changes
  useEffect(() => {
    if (user) {
      const userKey = `${BASE_STORAGE_KEY}${user.email}`;
      const savedData = localStorage.getItem(userKey);
      if (savedData) {
        setState(JSON.parse(savedData));
      } else {
        const newState = getInitialState(user);
        setState(newState);
        localStorage.setItem(userKey, JSON.stringify(newState));
      }
      localStorage.setItem('12S_CURRENT_USER', JSON.stringify(user));
    } else {
      setState(null);
      localStorage.removeItem('12S_CURRENT_USER');
    }
  }, [user]);

  // Persist state changes to user-specific key
  useEffect(() => {
    if (state && user) {
      const userKey = `${BASE_STORAGE_KEY}${user.email}`;
      localStorage.setItem(userKey, JSON.stringify(state));
    }
  }, [state, user]);

  const updateState = useCallback((newState: Partial<AppState>) => {
    setState(prev => prev ? { ...prev, ...newState } : null);
  }, []);

  const handleLogin = (newUser: User) => {
    setUser(newUser);
  };

  const handleLogout = () => {
    setUser(null);
    setCurrentView(View.PLAN);
  };

  if (!user || !state) {
    return <LoginView onLogin={handleLogin} />;
  }

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
      case View.PROFILE: return <ProfileView state={state} updateState={updateState} onLogout={handleLogout} />;
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
      user={user}
    >
      <div key={`${currentView}-${state.viewingCycleId}-${user.email}`} className="view-transition">
        {renderView()}
      </div>
    </Layout>
  );
};

export default App;
