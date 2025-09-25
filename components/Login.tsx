import React, { useState } from 'react';
import type { Employee } from '../types';

interface LoginProps {
  employees: Employee[];
  onLogin: (userId: string) => void;
  onGuestLogin: () => void;
}

const Login: React.FC<LoginProps> = ({ employees, onLogin, onGuestLogin }) => {
  const [selectedUserId, setSelectedUserId] = useState<string>(employees[0]?.id || '');
  const [error, setError] = useState<string>('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUserId) {
        setError('Prosimo, izberite svoje ime s seznama.');
        return;
    }
    setError('');
    onLogin(selectedUserId);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="w-full max-w-sm p-8 space-y-6 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-slate-800">
            Prijava
          </h1>
          <p className="text-slate-500 mt-2">Prosimo, izberite svoje ime za nadaljevanje.</p>
        </div>
        <form onSubmit={handleLogin} className="space-y-6">
            <div>
                <label htmlFor="user-select" className="sr-only">Izberite Uporabnika</label>
                <select 
                    id="user-select"
                    value={selectedUserId}
                    onChange={(e) => setSelectedUserId(e.target.value)}
                    className="w-full px-4 py-3 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 text-lg"
                >
                    <option value="" disabled>-- Izberite ime --</option>
                    {employees.map(emp => (
                        <option key={emp.id} value={emp.id}>{emp.name}</option>
                    ))}
                </select>
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
                <button
                    type="submit"
                    className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors text-lg"
                >
                    Prijavi se
                </button>
            </div>
        </form>

        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="bg-white px-2 text-slate-500">ali</span>
          </div>
        </div>
        
        <div>
          <button
            type="button"
            onClick={onGuestLogin}
            className="w-full flex justify-center items-center bg-slate-600 text-white font-bold py-3 px-4 rounded-md hover:bg-slate-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-500 transition-colors text-lg"
          >
            Naroči brez prijave
          </button>
        </div>

         <footer className="text-center pt-4 text-slate-500 text-sm border-t">
            <p>&copy; 2025 Lačen si full drugačen</p>
        </footer>
      </div>
    </div>
  );
};

export default Login;