import React from 'react';
import { useState, useEffect, useCallback } from 'react';
import { PERMANENT_MEALS } from '../constants';
import { publishMenu, getOrderHistory, clearAllOrders } from '../services/googleSheetsService';
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
  const [isExportingDaily, setIsExportingDaily] = useState(false);
  const [isExportingMonthly, setIsExportingMonthly] = useState(false);
  const [isClearingHistory, setIsClearingHistory] = useState(false);
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
  
  const handleDailyExport = async () => {
    const today = new Date().toISOString().split('T')[0];
    const todaysOrders = orderHistory.filter(order => order.date === today);

    if (todaysOrders.length === 0) {
      setFeedback({ type: 'error', message: 'Danes ni nobenih naročil za izvoz.' });
      return;
    }

    setIsExportingDaily(true);
    setFeedback(null);
    
    await new Promise(resolve => setTimeout(resolve, 500));
    
    try {
      const xmlHeader = `<?xml version="1.0" encoding="UTF-8"?>\n<Narocila datum="${today}">\n`;
      const xmlFooter = '</Narocila>';
      
      const escapeXml = (text: string | undefined) => {
        if (!text) return '';
        return text.replace(/&/g, '&amp;')
                   .replace(/</g, '&lt;')
                   .replace(/>/g, '&gt;')
                   .replace(/"/g, '&quot;')
                   .replace(/'/g, '&apos;');
      };

      const xmlBody = todaysOrders.map(order => 
        `  <Narocilo>\n` +
        `    <Uporabnik>${escapeXml(order.user)}</Uporabnik>\n` +
        `    <Malica>${escapeXml(order.meal)}</Malica>\n` +
        `    <Juha>${order.hasSoup ? 'Da' : 'Ne'}</Juha>\n` +
        `    <Opomba>${escapeXml(order.note)}</Opomba>\n` +
        `  </Narocilo>`
      ).join('\n');
      
      const xmlContent = xmlHeader + xmlBody + '\n' + xmlFooter;

      const blob = new Blob([xmlContent], { type: 'application/xml;charset=utf-8;' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `malice-${today}.xml`);
      document.body.appendChild(link);
      link.click();
      
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      setFeedback({ type: 'success', message: `Uspešno izvoženo ${todaysOrders.length} naročil v datoteko malice-${today}.xml!` });

    } catch (error) {
      console.error("Daily export failed:", error);
      setFeedback({ type: 'error', message: 'Napaka pri izvozu naročil. Poskusite znova.' });
    } finally {
      setIsExportingDaily(false);
    }
  };

  const handleMonthlyExport = async () => {
    if (orderHistory.length === 0) {
        setFeedback({ type: 'error', message: 'Ni shranjenih naročil za izvoz.' });
        return;
    }
    
    setIsExportingMonthly(true);
    setFeedback(null);
    await new Promise(resolve => setTimeout(resolve, 500)); // UX delay

    try {
        const headers = "Datum,Uporabnik,Malica,Juha,Opomba";
        
        const escapeCsv = (field: string | undefined | boolean) => {
            if (field === undefined || field === null) return '';
            let str = String(field);
            if (typeof field === 'boolean') str = field ? 'Da' : 'Ne';

            if (str.includes(',') || str.includes('"') || str.includes('\n')) {
                return `"${str.replace(/"/g, '""')}"`;
            }
            return str;
        };

        const csvRows = orderHistory
            .slice() 
            .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()) 
            .map(order => 
                [
                    escapeCsv(order.date),
                    escapeCsv(order.user),
                    escapeCsv(order.meal),
                    escapeCsv(order.hasSoup),
                    escapeCsv(order.note),
                ].join(',')
            );

        const csvContent = [headers, ...csvRows].join('\n');
        
        const blob = new Blob([`\uFEFF${csvContent}`], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const month = new Date().toLocaleString('sl-SI', { month: 'long' });
        const year = new Date().getFullYear();
        link.href = url;
        link.setAttribute('download', `Malice-${month}-${year}.csv`);
        document.body.appendChild(link);
        link.click();
        
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        setFeedback({ type: 'success', message: `Uspešno izvoženo ${orderHistory.length} naročil. Priporočamo, da sedaj počistite zgodovino.` });
    } catch (error) {
        console.error("Monthly export failed:", error);
        setFeedback({ type: 'error', message: 'Napaka pri izvozu mesečnega poročila.' });
    } finally {
        setIsExportingMonthly(false);
    }
  };
  
  const handleClearHistory = async () => {
    if (orderHistory.length === 0) {
        setFeedback({ type: 'error', message: 'Zgodovina je že prazna.' });
        return;
    }
    if (window.confirm(`Ali ste prepričani, da želite trajno izbrisati vseh ${orderHistory.length} shranjenih naročil? Tega dejanja ni mogoče razveljaviti.`)) {
        setIsClearingHistory(true);
        setFeedback(null);
        const result = await clearAllOrders();
        if (result.success) {
            setFeedback({ type: 'success', message: 'Zgodovina naročil je bila uspešno počiščena.' });
            await fetchHistory();
        } else {
            setFeedback({ type: 'error', message: 'Napaka pri brisanju zgodovine.' });
        }
        setIsClearingHistory(false);
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
        <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Dnevni Izvoz (Varnostna Kopija)</h2>
        <p className="text-slate-600 mb-4">S klikom na gumb boste prenesli XML datoteko z vsemi <strong>današnjimi</strong> naročili. To je priporočljivo narediti vsak dan kot varnostno kopijo.</p>
        <button
          onClick={handleDailyExport}
          disabled={isExportingDaily}
          className="w-full flex justify-center items-center bg-teal-600 text-white font-bold py-2 px-4 rounded-md hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 disabled:bg-teal-300 transition-colors"
        >
          {isExportingDaily ? <Spinner /> : 'Izvozi Današnja Naročila (XML)'}
        </button>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-4 text-slate-700 border-b pb-2">Mesečni Obračun in Arhiviranje</h2>
        <p className="text-slate-600 mb-4">Ob koncu meseca izvozite vsa zbrana naročila v CSV datoteko za lažji obračun. Po uspešnem izvozu in preverjanju podatkov lahko počistite zgodovino za nov mesec.</p>
        <div className="flex flex-col sm:flex-row gap-4">
            <button
                onClick={handleMonthlyExport}
                disabled={isExportingMonthly || isClearingHistory}
                className="flex-1 flex justify-center items-center bg-emerald-600 text-white font-bold py-2 px-4 rounded-md hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 disabled:bg-emerald-300 transition-colors"
            >
                {isExportingMonthly ? <Spinner /> : 'Izvozi Vsa Naročila (CSV)'}
            </button>
            <button
                onClick={handleClearHistory}
                disabled={isClearingHistory || isExportingMonthly}
                className="flex-1 flex justify-center items-center bg-red-600 text-white font-bold py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-red-300 transition-colors"
            >
                {isClearingHistory ? <Spinner /> : 'Počisti Zgodovino Naročil'}
            </button>
        </div>
      </div>
    </div>
  );
};

export default AdminView;