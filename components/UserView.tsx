
import React, { useState, useEffect, useCallback } from 'react';
import type { Meal, Employee, Order } from '../types';
import { submitOrder, getOrderHistory } from '../services/googleSheetsService';
import Spinner from './Spinner';
import Alert from './Alert';
import DailyOrderSummary from './DailyOrderSummary';

interface UserViewProps {
  menu: Meal[];
  isMenuPublished: boolean;
  employees: Employee[];
  currentUser: Employee;
}

const UserView: React.FC<UserViewProps> = ({ menu, isMenuPublished, employees, currentUser }) => {
  const [selectedMealId, setSelectedMealId] = useState<string | null>(null);
  const [withSoup, setWithSoup] = useState(false);
  const [note, setNote] = useState('');
  const [selectedUser, setSelectedUser] = useState(currentUser.name);
  const [isLoading, setIsLoading] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [todaysOrders, setTodaysOrders] = useState<Order[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const result = await getOrderHistory();
      if (result.success) {
        const today = new Date().toISOString().split('T')[0];
        const filteredOrders = result.orders.filter(order => order.date === today);
        setTodaysOrders(filteredOrders);
      } else {
        throw new Error();
      }
    } catch (error) {
      setHistoryError('Napaka pri pridobivanju današnjih naročil.');
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    if (isMenuPublished) {
      fetchHistory();
    }
  }, [isMenuPublished, fetchHistory]);

  // Set user to current logged in user
  useEffect(() => {
    setSelectedUser(currentUser.name);
  }, [currentUser]);


  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedMealId) {
      setFeedback({ type: 'error', message: 'Prosimo, izberite malico.' });
      return;
    }
    if (!selectedUser) {
        setFeedback({ type: 'error', message: 'Prosimo, izberite svoje ime.' });
        return;
    }

    setIsLoading(true);
    setFeedback(null);
    const selectedMeal = menu.find(m => m.id === selectedMealId);

    if (selectedMeal) {
      const order = {
        date: new Date().toISOString().split('T')[0],
        user: selectedUser,
        meal: selectedMeal.name,
        hasSoup: withSoup,
        note: note.trim(),
      };
      const result = await submitOrder(order);
      if (result.success) {
        setFeedback({ type: 'success', message: 'Vaše naročilo je bilo uspešno oddano. Dober tek!' });
        setSelectedMealId(null);
        setWithSoup(false);
        setNote('');
        fetchHistory(); // Refresh the summary
      } else {
        setFeedback({ type: 'error', message: 'Napaka pri oddaji naročila. Poskusite znova.' });
      }
    }
    setIsLoading(false);
  };

  if (!isMenuPublished) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h2 className="text-2xl font-bold text-slate-700 mb-2">Današnji meni še ni objavljen.</h2>
        <p className="text-slate-500">Prosimo, počakajte, da administrator objavi meni.</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-slate-800 text-center">Današnji Meni</h2>
        {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="block text-lg font-semibold text-slate-700">Izberite malico:</label>
            {menu.map((meal) => (
              <div key={meal.id} className="flex items-center p-3 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors">
                <input
                  type="radio"
                  id={`meal-${meal.id}`}
                  name="meal"
                  value={meal.id}
                  checked={selectedMealId === meal.id}
                  onChange={(e) => setSelectedMealId(e.target.value)}
                  className="h-5 w-5 text-blue-600 focus:ring-blue-500 border-slate-300"
                />
                <label htmlFor={`meal-${meal.id}`} className="ml-3 block text-md font-medium text-slate-700">
                  {meal.name}
                </label>
              </div>
            ))}
          </div>
          
          <div className="border-t pt-6 space-y-4">
              <div>
                  <label htmlFor="note" className="block text-md font-medium text-slate-700 mb-1">
                      Opomba (posebne želje):
                  </label>
                  <textarea
                      id="note"
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                      rows={2}
                      placeholder="Npr. brez solate, dodatna tatarska omaka..."
                      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
              </div>
              <div className="flex items-center">
                <input
                  id="soup"
                  name="soup"
                  type="checkbox"
                  checked={withSoup}
                  onChange={(e) => setWithSoup(e.target.checked)}
                  className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="soup" className="ml-3 block text-md font-medium text-slate-700">
                  Želim juho
                </label>
              </div>

              <div>
                  <label htmlFor="user" className="block text-lg font-semibold text-slate-700 mb-2">Vaše ime:</label>
                  <select 
                      id="user" 
                      value={selectedUser}
                      onChange={(e) => setSelectedUser(e.target.value)}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-100 cursor-not-allowed"
                      disabled
                  >
                      <option value={currentUser.name}>{currentUser.name}</option>
                  </select>
              </div>
          </div>
          
          <button
            type="submit"
            disabled={isLoading}
            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-3 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors text-lg"
          >
            {isLoading ? <Spinner /> : 'Oddaj Naročilo'}
          </button>
        </form>
      </div>
      <DailyOrderSummary 
        orders={todaysOrders}
        isLoading={isHistoryLoading}
        error={historyError}
      />
    </div>
  );
};

export default UserView;