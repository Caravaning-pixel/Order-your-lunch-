import React, { useState } from 'react';
import type { Employee } from '../types';
import Spinner from './Spinner';

interface UserManagementProps {
  employees: Employee[];
  onAddEmployee: (name: string, email: string, role: 'admin' | 'user', pin?: string) => Promise<boolean>;
  onUpdateEmployee: (id: string, name: string, email: string, role: 'admin' | 'user', pin?: string) => Promise<boolean>;
  onDeleteEmployee: (id: string) => Promise<boolean>;
  setFeedback: (feedback: { type: 'success' | 'error'; message: string } | null) => void;
  clearFeedback: () => void;
}

const UserManagement: React.FC<UserManagementProps> = ({ employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee, setFeedback, clearFeedback }) => {
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'user' as 'admin' | 'user', pin: '' });
  const [editingUser, setEditingUser] = useState<Employee | null>(null);
  const [isLoading, setIsLoading] = useState<string | null>(null); // 'add', 'edit-id', 'delete-id'

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newUser.name.trim() || !newUser.email.trim()) {
      setFeedback({ type: 'error', message: 'Ime in e-pošta uporabnika ne smeta biti prazna.' });
      return;
    }
    if (newUser.role === 'admin' && !newUser.pin.trim()) {
        setFeedback({ type: 'error', message: 'Koda PIN je obvezna za administratorje.' });
        return;
    }
    clearFeedback();
    setIsLoading('add');
    const success = await onAddEmployee(newUser.name.trim(), newUser.email.trim(), newUser.role, newUser.pin.trim());
    if (success) {
      setFeedback({ type: 'success', message: `Uporabnik "${newUser.name.trim()}" je bil uspešno dodan.` });
      setNewUser({ name: '', email: '', role: 'user', pin: '' });
    } else {
      setFeedback({ type: 'error', message: 'Napaka pri dodajanju uporabnika.' });
    }
    setIsLoading(null);
  };

  const handleUpdate = async () => {
    if (!editingUser || !editingUser.name.trim() || !editingUser.email.trim()) {
      setFeedback({ type: 'error', message: 'Ime in e-pošta uporabnika ne smeta biti prazna.' });
      return;
    }
    if (editingUser.role === 'admin' && !editingUser.pin?.trim()) {
        setFeedback({ type: 'error', message: 'Koda PIN je obvezna za administratorje.' });
        return;
    }
    clearFeedback();
    setIsLoading(`edit-${editingUser.id}`);
    const success = await onUpdateEmployee(editingUser.id, editingUser.name.trim(), editingUser.email.trim(), editingUser.role, editingUser.pin?.trim());
    if (success) {
      setFeedback({ type: 'success', message: 'Podatki o uporabniku so bili posodobljeni.' });
      setEditingUser(null);
    } else {
      setFeedback({ type: 'error', message: 'Napaka pri posodabljanju uporabnika.' });
    }
    setIsLoading(null);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Ali ste prepričani, da želite izbrisati tega uporabnika?')) {
      clearFeedback();
      setIsLoading(`delete-${id}`);
      const success = await onDeleteEmployee(id);
      if (success) {
        setFeedback({ type: 'success', message: 'Uporabnik je bil izbrisan.' });
      } else {
        setFeedback({ type: 'error', message: 'Napaka pri brisanju uporabnika.' });
      }
      setIsLoading(null);
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Upravljanje Uporabnikov</h2>
      
      <form onSubmit={handleAdd} className="space-y-3 mb-6 p-4 bg-slate-50 rounded-md">
         <h3 className="font-semibold text-slate-600">Dodaj novega uporabnika</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          <input
            type="text"
            value={newUser.name}
            onChange={(e) => setNewUser(prev => ({ ...prev, name: e.target.value }))}
            placeholder="Ime in priimek"
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="Ime novega uporabnika"
          />
          <input
            type="email"
            value={newUser.email}
            onChange={(e) => setNewUser(prev => ({ ...prev, email: e.target.value }))}
            placeholder="E-poštni naslov"
            className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            aria-label="E-pošta novega uporabnika"
          />
           <select 
             value={newUser.role}
             onChange={(e) => setNewUser(prev => ({ ...prev, role: e.target.value as 'admin' | 'user' }))}
             className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
             aria-label="Vloga novega uporabnika"
            >
               <option value="user">Uporabnik</option>
               <option value="admin">Admin</option>
           </select>
           {newUser.role === 'admin' && (
              <input
                type="password"
                value={newUser.pin}
                onChange={(e) => setNewUser(prev => ({ ...prev, pin: e.target.value.replace(/\D/g, '') }))}
                placeholder="PIN (samo številke)"
                className="px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                aria-label="PIN za novega admina"
                pattern="\d*"
                inputMode="numeric"
                maxLength={4}
                autoComplete="new-password"
              />
           )}
        </div>
        <button
          type="submit"
          disabled={!!isLoading}
          className="w-full sm:w-auto flex justify-center items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
        >
          {isLoading === 'add' ? <Spinner/> : 'Dodaj Uporabnika'}
        </button>
      </form>

      <ul className="space-y-2">
        {employees.map(user => (
          <li key={user.id} className="flex flex-col sm:flex-row items-start sm:items-center justify-between p-3 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200">
            {editingUser?.id === user.id ? (
              <div className="flex-grow grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2 w-full mb-2 sm:mb-0">
                  <input
                    type="text"
                    value={editingUser.name}
                    onChange={(e) => setEditingUser({ ...editingUser, name: e.target.value })}
                    className="px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Uredi ime uporabnika"
                  />
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) => setEditingUser({ ...editingUser, email: e.target.value })}
                    className="px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    aria-label="Uredi e-pošto uporabnika"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({...editingUser, role: e.target.value as 'admin' | 'user'})}
                      className="px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label="Uredi vlogo uporabnika"
                    >
                        <option value="user">Uporabnik</option>
                        <option value="admin">Admin</option>
                    </select>
                    {editingUser.role === 'admin' && (
                        <input
                            type="password"
                            value={editingUser.pin || ''}
                            onChange={(e) => setEditingUser({...editingUser, pin: e.target.value.replace(/\D/g, '')})}
                            placeholder="PIN"
                            className="px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            aria-label="Uredi PIN"
                            pattern="\d*"
                            inputMode="numeric"
                            maxLength={4}
                            autoComplete="new-password"
                        />
                    )}
                  </div>
              </div>
            ) : (
              <div className="flex-grow mb-2 sm:mb-0">
                <p className="font-medium text-slate-800">{user.name} <span className="text-xs font-mono p-1 rounded bg-slate-200 text-slate-600">{user.role}</span></p>
                <p className="text-sm text-slate-500">{user.email}</p>
              </div>
            )}
            <div className="flex items-center gap-2 ml-auto sm:ml-2 flex-shrink-0">
              {editingUser?.id === user.id ? (
                <>
                  <button onClick={handleUpdate} disabled={!!isLoading} className="text-green-600 hover:text-green-800 disabled:text-slate-300 font-semibold" aria-label="Shrani spremembe">
                    {isLoading === `edit-${user.id}` ? <Spinner/> : 'Shrani'}
                  </button>
                  <button onClick={() => setEditingUser(null)} disabled={!!isLoading} className="text-slate-500 hover:text-slate-700 disabled:text-slate-300" aria-label="Prekliči urejanje">Prekliči</button>
                </>
              ) : (
                <>
                  <button onClick={() => setEditingUser({ ...user })} disabled={!!isLoading} className="text-blue-600 hover:text-blue-800 disabled:text-slate-300 font-semibold" aria-label={`Uredi uporabnika ${user.name}`}>Uredi</button>
                  <button onClick={() => handleDelete(user.id)} disabled={!!isLoading} className="text-red-600 hover:text-red-800 disabled:text-slate-300 font-semibold" aria-label={`Izbriši uporabnika ${user.name}`}>
                  {isLoading === `delete-${user.id}` ? <Spinner/> : 'Izbriši'}
                  </button>
                </>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserManagement;