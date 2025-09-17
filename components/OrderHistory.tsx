import React from 'react';
import type { Order } from '../types';
import Spinner from './Spinner';

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, isLoading, error, onRefresh }) => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-slate-700">Zgodovina Naročil</h2>
        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="px-3 py-1 text-sm font-semibold text-blue-600 border border-blue-600 rounded-md hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 transition-colors"
          aria-label="Osveži zgodovino naročil"
        >
          Osveži
        </button>
      </div>

      {isLoading ? (
        <div className="flex justify-center items-center h-24">
           <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      ) : error ? (
        <p className="text-center text-red-600">{error}</p>
      ) : orders.length === 0 ? (
        <p className="text-center text-slate-500">Zgodovina naročil je prazna.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-slate-200">
            <thead className="bg-slate-50">
              <tr>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Datum</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Uporabnik</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Malica</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Juha</th>
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Opomba</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.map((order) => (
                <tr key={order.id}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{order.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-800">{order.user}</td>
                  <td className="px-4 py-4 text-sm text-slate-600">{order.meal}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600">{order.hasSoup ? 'Da' : 'Ne'}</td>
                  <td className="px-4 py-4 text-sm text-slate-500 italic">{order.note || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;