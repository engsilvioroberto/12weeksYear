
import React from 'react';
import { View } from '../types';
import { 
  Target, 
  LayoutList, 
  Calendar, 
  BarChart3, 
  UserCircle,
  Sparkles,
  Layers,
  ArrowLeft
} from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentView: View;
  setView: (view: View) => void;
  activeCycleName?: string;
  isViewingPastCycle?: boolean;
  onReturnToActive?: () => void;
}

const NavItem: React.FC<{ 
  icon: React.ReactNode; 
  label: string; 
  active: boolean; 
  onClick: () => void;
  isSidebar?: boolean;
}> = ({ icon, label, active, onClick, isSidebar }) => (
  <button 
    onClick={onClick}
    className={`flex transition-all duration-200 ${
      isSidebar 
        ? `w-full items-center space-x-3 px-4 py-3 rounded-xl mb-1 ${active ? 'bg-gray-900 text-white shadow-lg shadow-gray-200' : 'text-gray-500 hover:bg-gray-100 hover:text-gray-900'}`
        : `flex-col items-center justify-center space-y-1 ${active ? 'text-gray-900' : 'text-gray-400 hover:text-gray-600'}`
    }`}
  >
    <div className={active && !isSidebar ? 'scale-110 transition-transform' : ''}>
      {icon}
    </div>
    <span className={`${isSidebar ? 'text-sm font-medium' : 'text-[10px] font-medium uppercase tracking-wider'}`}>
      {label}
    </span>
  </button>
);

export const Layout: React.FC<LayoutProps> = ({ children, currentView, setView, activeCycleName, isViewingPastCycle, onReturnToActive }) => {
  const menuItems = [
    { id: View.CYCLES, label: 'Ciclos', icon: <Layers size={20} /> },
    { id: View.VISION, label: 'Visão', icon: <Target size={20} /> },
    { id: View.PLAN, label: 'Plano', icon: <LayoutList size={20} /> },
    { id: View.WEEK, label: 'Semana', icon: <Calendar size={20} /> },
    { id: View.SCORE, label: 'Score', icon: <BarChart3 size={20} /> },
    { id: View.PROFILE, label: 'Perfil', icon: <UserCircle size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#F9FAFB] flex flex-col md:flex-row">
      {/* Sidebar - Desktop Only */}
      <aside className="hidden md:flex w-64 bg-white border-r border-gray-100 flex-col h-screen sticky top-0 p-6">
        <div className="flex items-center space-x-2 mb-10 px-2">
          <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
            <Sparkles size={18} className="text-emerald-400" />
          </div>
          <span className="font-bold text-gray-900 tracking-tight">12 Week Year</span>
        </div>
        
        <nav className="flex-1">
          {menuItems.map(item => (
            <NavItem 
              key={item.id}
              icon={item.icon}
              label={item.label}
              active={currentView === item.id}
              onClick={() => setView(item.id)}
              isSidebar
            />
          ))}
        </nav>

        <div className="mt-auto space-y-3">
          {isViewingPastCycle && onReturnToActive && (
            <button 
              onClick={onReturnToActive}
              className="w-full flex items-center space-x-2 px-4 py-3 bg-emerald-50 text-emerald-700 rounded-xl text-xs font-bold uppercase tracking-wider hover:bg-emerald-100 transition-colors border border-emerald-100 shadow-sm"
            >
              <ArrowLeft size={14} />
              <span>Ciclo Ativo</span>
            </button>
          )}

          {activeCycleName && (
            <div className={`p-4 rounded-2xl border shadow-xl overflow-hidden relative transition-all ${isViewingPastCycle ? 'bg-gray-100 border-gray-200 text-gray-400' : 'bg-gray-900 border-gray-800 text-white'}`}>
              {!isViewingPastCycle && (
                <div className="absolute -right-4 -top-4 opacity-10">
                  <Sparkles size={60} className="text-emerald-400" />
                </div>
              )}
              <p className="text-[10px] font-bold uppercase tracking-widest mb-1 relative z-10">{isViewingPastCycle ? 'Visualizando' : 'Ativo agora'}</p>
              <p className={`text-sm font-semibold truncate relative z-10 ${isViewingPastCycle ? 'text-gray-600' : 'text-white'}`}>{activeCycleName}</p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center">
        {isViewingPastCycle && (
          <div className="md:hidden w-full bg-emerald-600 text-white px-6 py-2 flex justify-between items-center animate-in slide-in-from-top-full">
            <span className="text-[10px] font-bold uppercase tracking-widest">Visualizando Histórico</span>
            <button onClick={onReturnToActive} className="text-[10px] font-bold uppercase underline">Voltar para o Ativo</button>
          </div>
        )}
        <div className="w-full max-w-4xl px-6 pt-8 pb-32 md:pb-12 md:px-12">
          {children}
        </div>
      </main>

      {/* Bottom Nav - Mobile Only */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-gray-100 px-4 py-3 flex justify-between items-center safe-bottom z-50">
        {menuItems.map(item => (
          <NavItem 
            key={item.id}
            icon={item.icon}
            label={item.label}
            active={currentView === item.id}
            onClick={() => setView(item.id)}
          />
        ))}
      </nav>
    </div>
  );
};
