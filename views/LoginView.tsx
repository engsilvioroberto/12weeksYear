
import React, { useState, useEffect } from 'react';
import { Sparkles, Mail, Lock, User as UserIcon, ArrowRight, Loader2, LogIn, UserPlus } from 'lucide-react';
import { User } from '../types';

interface LoginViewProps {
  onLogin: (user: User) => void;
}

export const LoginView: React.FC<LoginViewProps> = ({ onLogin }) => {
  const [mode, setMode] = useState<'login' | 'signup'>('login');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [recentUsers, setRecentUsers] = useState<User[]>([]);

  // Load recent users from local storage for easy testing
  useEffect(() => {
    const keys = Object.keys(localStorage);
    const users: User[] = [];
    keys.forEach(key => {
      if (key.startsWith('12S_DATA_')) {
        const data = JSON.parse(localStorage.getItem(key) || '{}');
        if (data.user) users.push(data.user);
      }
    });
    setRecentUsers(users);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password || (mode === 'signup' && !name)) return;

    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      const user: User = {
        name: mode === 'signup' ? name : (recentUsers.find(u => u.email === email)?.name || 'Usuário'),
        email: email.toLowerCase(),
        photo: `https://ui-avatars.com/api/?name=${encodeURIComponent(mode === 'signup' ? name : 'User')}&background=random`,
      };
      onLogin(user);
      setLoading(false);
    }, 1200);
  };

  const handleGoogleLogin = () => {
    setLoading(true);
    setTimeout(() => {
      const googleUser: User = {
        name: 'Alex Performance',
        email: 'alex.google@test.com',
        photo: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
      };
      onLogin(googleUser);
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-white overflow-hidden">
      {/* Visual Section */}
      <div className="hidden md:flex flex-[1.2] bg-gray-900 relative items-center justify-center p-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full opacity-20 pointer-events-none">
          <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] bg-emerald-500 blur-[120px] rounded-full animate-pulse" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500 blur-[120px] rounded-full animate-pulse" />
        </div>
        
        <div className="relative z-10 max-w-lg">
          <div className="flex items-center space-x-3 mb-10">
            <div className="w-14 h-14 bg-emerald-500 rounded-2xl flex items-center justify-center shadow-2xl shadow-emerald-500/40 transform -rotate-6">
              <Sparkles size={28} className="text-white" />
            </div>
            <span className="text-3xl font-bold text-white tracking-tight">12 Week Year</span>
          </div>
          <h1 className="text-7xl font-light text-white leading-[1.1] mb-8 tracking-tighter">
            Pare de planejar <br />
            <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-blue-400">Comece a executar.</span>
          </h1>
          <p className="text-gray-400 text-xl leading-relaxed font-light">
            A metodologia que transformou a produtividade corporativa, agora na palma da sua mão. 12 semanas para mudar tudo.
          </p>
        </div>
        
        <div className="absolute bottom-12 left-12 text-[10px] font-bold text-gray-600 uppercase tracking-[0.4em]">
          Plataforma de Alta Performance © 2025
        </div>
      </div>

      {/* Auth Section */}
      <div className="flex-1 flex flex-col bg-[#F9FAFB] relative">
        <div className="flex-1 flex flex-col items-center justify-center p-8 md:p-16">
          <div className="w-full max-w-md">
            <div className="md:hidden flex items-center space-x-2 mb-12">
              <div className="w-8 h-8 bg-gray-900 rounded-lg flex items-center justify-center">
                <Sparkles size={16} className="text-emerald-400" />
              </div>
              <span className="font-bold text-gray-900">12 Week Year</span>
            </div>

            <div className="mb-10 text-center md:text-left">
              <h2 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">
                {mode === 'login' ? 'Bem-vindo' : 'Crie sua conta'}
              </h2>
              <p className="text-gray-500 font-medium">
                {mode === 'login' 
                  ? 'Entre para continuar sua jornada de 12 semanas.' 
                  : 'Junte-se a milhares de executores de alta performance.'}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 mb-8">
              {mode === 'signup' && (
                <div className="relative">
                  <UserIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                  <input 
                    type="text"
                    placeholder="Nome Completo"
                    className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>
              )}
              
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="email"
                  placeholder="Seu melhor e-mail"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="relative">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input 
                  type="password"
                  placeholder="Senha"
                  className="w-full bg-white border border-gray-200 rounded-2xl py-4 pl-12 pr-4 text-sm outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500 transition-all"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="w-full bg-gray-900 text-white py-4 rounded-2xl font-bold flex items-center justify-center space-x-2 hover:bg-black transition-all shadow-xl shadow-gray-200 active:scale-[0.98] disabled:opacity-50"
              >
                {loading ? <Loader2 className="animate-spin" size={20} /> : (
                  <>
                    <span>{mode === 'login' ? 'Entrar Agora' : 'Finalizar Cadastro'}</span>
                    <ArrowRight size={18} />
                  </>
                )}
              </button>
            </form>

            <div className="relative py-2 mb-6">
              <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-gray-200"></div></div>
              <div className="relative flex justify-center text-[10px] uppercase font-bold tracking-widest text-gray-400"><span className="bg-[#F9FAFB] px-4">Ou continue com</span></div>
            </div>

            <button 
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-3 bg-white border border-gray-200 py-4 px-6 rounded-2xl shadow-sm hover:shadow-md hover:border-gray-300 transition-all active:scale-[0.98] disabled:opacity-50"
            >
              <svg width="20" height="20" viewBox="0 0 20 20">
                <path d="M19.6 10.23c0-.82-.07-1.42-.25-2.05H10v3.86h5.5c-.15.96-.74 2.39-2.06 3.32l-.02.13 3.11 2.42.21.02c1.98-1.83 3.11-4.51 3.11-7.7z" fill="#4285F4"/>
                <path d="M10 20c2.7 0 4.96-.89 6.62-2.42l-3.3-2.56c-.89.61-2.04.99-3.32.99-2.55 0-4.72-1.68-5.49-4.01l-.12.01-3.23 2.5-.04.12C3.12 18.06 6.3 20 10 20z" fill="#34A853"/>
                <path d="M4.51 12.01c-.2-.59-.31-1.22-.31-1.87s.11-1.28.31-1.87l-.01-.15-3.23-2.51-.11.05C.42 7.02 0 8.47 0 10s.42 2.98 1.17 4.33l3.34-2.32z" fill="#FBBC05"/>
                <path d="M10 3.94c1.88 0 3.14.81 3.86 1.49l2.87-2.81C14.96.95 12.7 0 10 0 6.3 0 3.12 1.94 1.17 4.83L4.5 7.42c.78-2.34 2.95-4.02 5.5-3.48z" fill="#EA4335"/>
              </svg>
              <span className="font-bold text-gray-700">Google</span>
            </button>

            <div className="mt-8 text-center">
              <button 
                onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                className="text-sm font-bold text-gray-500 hover:text-gray-900 transition-colors"
              >
                {mode === 'login' ? (
                  <>Ainda não tem conta? <span className="text-emerald-600 underline">Crie uma agora</span></>
                ) : (
                  <>Já possui conta? <span className="text-emerald-600 underline">Faça login</span></>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Local Test Switcher - Only visible if there are multiple accounts */}
        {recentUsers.length > 0 && (
          <div className="p-8 border-t border-gray-100 bg-white/50 backdrop-blur-sm">
            <h4 className="text-[10px] font-black uppercase tracking-widest text-gray-400 mb-4 text-center">Contas locais (Test Mode)</h4>
            <div className="flex flex-wrap justify-center gap-3">
              {recentUsers.map(u => (
                <button 
                  key={u.email}
                  onClick={() => onLogin(u)}
                  className="flex items-center space-x-2 bg-white border border-gray-200 px-3 py-1.5 rounded-full hover:border-emerald-500 transition-all text-xs group"
                >
                  <img src={u.photo} className="w-5 h-5 rounded-full" />
                  <span className="font-bold text-gray-600 group-hover:text-emerald-600">{u.name}</span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
