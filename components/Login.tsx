
import React, { useState } from 'react';

interface LoginProps {
  onLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Credenciais fixas para demonstração/uso inicial
    // Em um cenário real, isso seria validado em um backend
    if (email === 'admin@starlink.com' && password === 'admin123') {
      localStorage.setItem('starlink_auth', 'true');
      onLogin();
    } else {
      setError('E-mail ou senha incorretos.');
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-900 flex items-center justify-center p-4 z-[100]">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl overflow-hidden animate-scaleIn">
        <div className="bg-slate-900 p-8 text-center">
          <div className="bg-white w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4">
             <div className="bg-slate-900 text-white text-xs font-bold px-2 py-1 rounded">PRO</div>
          </div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Starlink Stock Pro</h2>
          <p className="text-slate-400 text-sm mt-1">Gestão Profissional de Inventário</p>
        </div>
        
        <form onSubmit={handleSubmit} className="p-8 space-y-6">
          {error && (
            <div className="bg-red-50 text-red-600 p-3 rounded-xl text-sm font-medium text-center border border-red-100">
              {error}
            </div>
          )}
          
          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">E-mail</label>
            <input 
              type="email"
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-slate-500 uppercase ml-1">Senha</label>
            <input 
              type="password"
              required
              className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl focus:ring-2 focus:ring-slate-900 focus:outline-none text-slate-900"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button 
            type="submit"
            className="w-full py-4 bg-slate-900 text-white font-bold rounded-2xl shadow-xl shadow-slate-200 hover:bg-slate-800 transition-all active:scale-[0.98] mt-4"
          >
            Entrar no Sistema
          </button>
          
          <p className="text-center text-slate-400 text-[10px] uppercase font-bold">
            Uso Restrito a Colaboradores Autorizados
          </p>
        </form>
      </div>
    </div>
  );
};

export default Login;
