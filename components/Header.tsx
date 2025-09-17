import React from 'react';
import type { View, Employee } from '../types';
import { View as ViewEnum } from '../types';

interface HeaderProps {
  currentView: View;
  setView: (view: View) => void;
  currentUser: Employee | null;
  onLogout: () => void;
  onAdminViewRequest: () => void;
}

const Header: React.FC<HeaderProps> = ({ currentView, setView, currentUser, onLogout, onAdminViewRequest }) => {
  const getButtonClass = (view: View) => {
    return currentView === view
      ? 'bg-blue-600 text-white'
      : 'bg-white text-slate-700 hover:bg-slate-200';
  };

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 md:px-8 py-4 flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-800">
          Naročanje Malic
        </h1>
        {currentUser && (
          <div className="flex items-center gap-4">
            <div className="text-sm">
                Prijavljeni kot: <span className="font-semibold">{currentUser.name}</span>
            </div>
            <div className="flex items-center p-1 bg-slate-100 rounded-lg">
              <button
                onClick={() => setView(ViewEnum.User)}
                className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${getButtonClass(ViewEnum.User)}`}
              >
                Naročanje
              </button>
              {currentUser.role === 'admin' && (
                <button
                  onClick={onAdminViewRequest}
                  className={`px-3 py-1 text-sm font-semibold rounded-md transition-colors ${getButtonClass(ViewEnum.Admin)}`}
                >
                  Admin
                </button>
              )}
            </div>
            <button
              onClick={onLogout}
              className="px-3 py-1 text-sm font-semibold text-red-600 hover:bg-red-100 rounded-md transition-colors"
            >
              Odjava
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;