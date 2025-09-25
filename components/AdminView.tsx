import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { PERMANENT_MEALS } from '../constants';
import { publishMenu, sendMonthlyReport, getOrderHistory, exportOrdersToSheet } from '../services/googleSheetsService';
import Spinner from './Spinner';
import Alert from './Alert';
import UserManagement from './UserManagement';
import OrderHistory from './OrderHistory';
import type { Employee, Order } from '../types';

interface AdminViewProps {
  onPublishMenu: (malica1: string, malica2: string) => void;
  employees: Employee[];
  onAddEmployee: (name: string, email: string, role: 'admin' | 'user', pin?: string) => Promise<boolean>;
  onUpdateEmployee: (id: string, name: string, email: string, role: 'admin' | 'user', pin?: string) => Promise<boolean>;
  onDeleteEmployee: (id: string) => Promise<boolean>;
}

const AdminView: React.FC<AdminViewProps> = ({ onPublishMenu, employees, onAddEmployee, onUpdateEmployee, onDeleteEmployee }) => {
  const [malica1, setMalica1] = useState('');
  const [malica2, setMalica2] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSendingReport, setIsSendingReport] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const [orderHistory, setOrderHistory] = useState<Order[]>([]);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [historyError, setHistoryError] = useState<string | null>(null);

  const fetchHistory = useCallback(async () => {
    setIsHistoryLoading(true);
    setHistoryError(null);
    try {
      const result = await getOrderHistory();
      if (result.success) {
        setOrderHistory(result.orders);
      } else {
        throw new Error();
      }
    } catch (error) {
      setHistoryError('Napaka pri pridobivanju zgodovine naročil.');
    } finally {
      setIsHistoryLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchHistory();
  }, [fetchHistory]);


  const handlePublish = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!malica1 || !malica2) {
      setFeedback({ type: 'error', message: 'Prosimo, vnesite obe dnevni malici.' });
      return;
    }
    setIsPublishing(true);
    setFeedback(null);
    const result = await publishMenu([{ name: malica1 }, { name: malica2 }]);
    setIsPublishing(false);
    if (result.success) {
      onPublishMenu(malica1, malica2);
      setFeedback({ type: 'success', message: 'Današnji meni je bil uspešno objavljen!' });
      setMalica1('');
      setMalica2('');
    } else {
      setFeedback({ type: 'error', message: 'Napaka pri objavi menija. Poskusite znova.' });
    }
  };

  const handleSendReport = async () => {
    setIsSendingReport(true);
    setFeedback(null);
    const result = await sendMonthlyReport();
    setIsSendingReport(false);
    if (result.success) {
      setFeedback({ type: 'success', message: 'Mesečno poročilo je bilo uspešno poslano!' });
    } else {
      setFeedback({ type: 'error', message: 'Napaka pri pošiljanju poročila. Poskusite znova.' });
    }
  };

  const handleExport = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orderHistory.filter(order => order.date === today);

    if (todaysOrders.length === 0) {
      setFeedback({ type: 'error', message: 'Danes ni nobenih naročil za izvoz.' });
      return;
    }

    setIsExporting(true);
    setFeedback(null);
    const result = await exportOrdersToSheet(todaysOrders);
    setIsExporting(false);
    
    if (result.success) {
      setFeedback({ type: 'success', message: 'Današnja naročila so bila uspešno izvožena v Google Sheets!' });
    } else {
      setFeedback({ type: 'error', message: 'Napaka pri izvozu naročil. Poskusite znova.' });
    }
  };
  
  const clearFeedback = () => setFeedback(null);

  return (
    <div className="space-y-8">
      {feedback && <Alert type={feedback.type}>{feedback.message}</Alert>}
      
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Objavi Današnji Meni</h2>
        <form onSubmit={handlePublish} className="space-y-4">
          <div>
            <label htmlFor="malica1" className="block text-sm font-medium text-slate-600 mb-1">Malica 1</label>
            <input
              type="text"
              id="malica1"
              value={malica1}
              onChange={(e) => setMalica1(e.target.value)}
              placeholder="Npr. Golaž s polento"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label htmlFor="malica2" className="block text-sm font-medium text-slate-600 mb-1">Malica 2</label>
            <input
              type="text"
              id="malica2"
              value={malica2}
              onChange={(e) => setMalica2(e.target.value)}
              placeholder="Npr. Rižota z morskimi sadeži"
              className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <button
            type="submit"
            disabled={isPublishing}
            className="w-full flex justify-center items-center bg-blue-600 text-white font-bold py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-blue-300 transition-colors"
          >
            {isPublishing ? <Spinner /> : 'Objavi Meni'}
          </button>
        </form>
      </div>

      <UserManagement 
        employees={employees} 
        onAddEmployee={onAddEmployee}
        onUpdateEmployee={onUpdateEmployee}
        onDeleteEmployee={onDeleteEmployee}
        setFeedback={setFeedback}
        clearFeedback={clearFeedback}
      />

      <OrderHistory 
        orders={orderHistory}
        isLoading={isHistoryLoading}
        error={historyError}
        onRefresh={fetchHistory}
      />

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-xl font-bold mb-3 text-slate-700">Stalne Malice</h3>
        <ul className="list-disc list-inside space-y-2 text-slate-600">
          {PERMANENT_MEALS.map(meal => <li key={meal.id}>{meal.name}</li>)}
        </ul>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Izvoz Podatkov</h2>
        <p className="text-slate-600 mb-4">Izvozi vsa današnja naročila v nov Google Sheet z imenom "Malice - [današnji datum]". Stolpci bodo: Datum, Ime osebe, Malica.</p>
        <button
          onClick={handleExport}
          disabled={isExporting}
          className="w-full flex justify-center items-center bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 transition-colors"
        >
          {isExporting ? <Spinner /> : 'Izvozi Malice'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Mesečno Poročilo</h2>
        <p className="text-slate-600 mb-4">S pritiskom na gumb boste sprožili pošiljanje mesečnega poročila o naročilih vsem zaposlenim.</p>
        <button
          onClick={handleSendReport}
          disabled={isSendingReport}
          className="w-full flex justify-center items-center bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 transition-colors"
        >
          {isSendingReport ? <Spinner /> : 'Pošlji Mesečno Poročilo'}
        </button>
      </div>
    </div>
  );
};

export default AdminView;