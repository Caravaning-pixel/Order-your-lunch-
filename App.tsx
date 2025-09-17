import React, { useState, useCallback } from 'react';
import AdminView from './components/AdminView';
import UserView from './components/UserView';
import Header from './components/Header';
import Login from './components/Login';
import PinModal from './components/PinModal';
import type { Meal, Employee } from './types';
import { View } from './types';
import { PERMANENT_MEALS, INITIAL_EMPLOYEES } from './constants';
import { addEmployee as addEmployeeService, updateEmployee as updateEmployeeService, deleteEmployee as deleteEmployeeService } from './services/googleSheetsService';


const App: React.FC = () => {
  const [view, setView] = useState<View>(View.User);
  const [dailyMenu, setDailyMenu] = useState<Meal[]>([]);
  const [isMenuPublished, setIsMenuPublished] = useState<boolean>(false);
  const [employees, setEmployees] = useState<Employee[]>(INITIAL_EMPLOYEES);
  const [currentUser, setCurrentUser] = useState<Employee | null>(null);
  const [isPinModalOpen, setIsPinModalOpen] = useState<boolean>(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');

  const handleLogin = (userId: string) => {
    const user = employees.find(emp => emp.id === userId);
    if (user) {
      setCurrentUser(user);
      setView(View.User); // Default to user view on login
      setIsAdminAuthenticated(false); // Reset admin auth on new login
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setIsAdminAuthenticated(false);
  };

  const handleAdminViewRequest = () => {
    if (currentUser?.role !== 'admin') return;
    if (isAdminAuthenticated) {
      setView(View.Admin);
    } else {
      setPinError('');
      setIsPinModalOpen(true);
    }
  };

  const handlePinSubmit = (pin: string) => {
    if (currentUser?.role === 'admin' && currentUser.pin === pin) {
      setIsAdminAuthenticated(true);
      setIsPinModalOpen(false);
      setView(View.Admin);
      setPinError('');
    } else {
      setPinError('Napačna koda PIN. Poskusite znova.');
    }
  };

  const handlePublishMenu = useCallback((malica1: string, malica2: string) => {
    const newMenu: Meal[] = [
      { id: '1', name: malica1 },
      { id: '2', name: malica2 },
      ...PERMANENT_MEALS,
    ];
    setDailyMenu(newMenu);
    setIsMenuPublished(true);
    setView(View.User); // Switch to user view after publishing
  }, []);

  const handleAddEmployee = async (name: string, email: string, role: 'admin' | 'user', pin?: string): Promise<boolean> => {
    const result = await addEmployeeService(name, email, role, pin);
    if (result.success && result.newEmployee) {
      setEmployees(prev => [...prev, result.newEmployee!]);
      return true;
    }
    return false;
  };

  const handleUpdateEmployee = async (id: string, name: string, email: string, role: 'admin' | 'user', pin?: string): Promise<boolean> => {
    const result = await updateEmployeeService(id, name, email, role, pin);
    if (result.success) {
      setEmployees(prev => prev.map(emp => emp.id === id ? { ...emp, name, email, role, pin: role === 'admin' ? pin : undefined } : emp));
      // If the currently logged-in user is updated, update their session info
      if (currentUser?.id === id) {
        setCurrentUser(prev => prev ? { ...prev, name, email, role, pin: role === 'admin' ? pin : undefined } : null);
      }
      return true;
    }
    return false;
  };

  const handleDeleteEmployee = async (id: string): Promise<boolean> => {
    // Prevent deleting the currently logged-in user
    if (currentUser?.id === id) {
        alert("Ne morete izbrisati uporabnika, s katerim ste trenutno prijavljeni.");
        return false;
    }
    const result = await deleteEmployeeService(id);
    if (result.success) {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
      return true;
    }
    return false;
  };

  if (!currentUser) {
    return <Login employees={employees} onLogin={handleLogin} />;
  }

  return (
    <div className="min-h-screen bg-slate-100 font-sans text-slate-800">
      <Header 
        currentView={view} 
        setView={setView} 
        currentUser={currentUser}
        onLogout={handleLogout}
        onAdminViewRequest={handleAdminViewRequest}
      />
      <main className="p-4 sm:p-6 md:p-8 max-w-4xl mx-auto">
        {view === View.Admin && isAdminAuthenticated ? (
          <AdminView 
            onPublishMenu={handlePublishMenu} 
            employees={employees}
            onAddEmployee={handleAddEmployee}
            onUpdateEmployee={handleUpdateEmployee}
            onDeleteEmployee={handleDeleteEmployee}
          />
        ) : (
          <UserView 
            menu={dailyMenu} 
            isMenuPublished={isMenuPublished} 
            employees={employees}
            currentUser={currentUser}
          />
        )}
      </main>
      <PinModal
        isOpen={isPinModalOpen}
        onClose={() => setIsPinModalOpen(false)}
        onSubmit={handlePinSubmit}
        error={pinError}
      />
      <footer className="text-center py-4 text-slate-500 text-sm">
        <p>&copy; 2024 Naročanje Malic. Vse pravice pridržane.</p>
      </footer>
    </div>
  );
};

export default App;