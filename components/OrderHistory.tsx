import React, { useState } from 'react';
import type { Order } from '../types';
import Spinner from './Spinner';

interface OrderHistoryProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
  onRefresh: () => void;
  onUpdateOrder: (order: Order) => Promise<boolean>;
  onDeleteOrder: (orderId: string) => Promise<boolean>;
}

const OrderHistory: React.FC<OrderHistoryProps> = ({ orders, isLoading, error, onRefresh, onUpdateOrder, onDeleteOrder }) => {
  const [editingOrder, setEditingOrder] = useState<Order | null>(null);
  const [isUpdating, setIsUpdating] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState<string | null>(null);

  const handleEditClick = (order: Order) => {
    setEditingOrder({ ...order }); // Create a copy to edit
  };

  const handleCancelClick = () => {
    setEditingOrder(null);
  };

  const handleSaveClick = async () => {
    if (!editingOrder) return;
    setIsUpdating(editingOrder.id!);
    const success = await onUpdateOrder(editingOrder);
    if (success) {
      setEditingOrder(null);
    }
    setIsUpdating(null);
  };
  
  const handleDeleteClick = async (order: Order) => {
    if (window.confirm(`Ali ste prepričani, da želite izbrisati naročilo uporabnika ${order.user} na dan ${order.date}?`)) {
        setIsDeleting(order.id!);
        await onDeleteOrder(order.id!);
        setIsDeleting(null);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!editingOrder) return;
    const { name, value, type } = e.target;

    if (type === 'checkbox' && e.target instanceof HTMLInputElement) {
        setEditingOrder({ ...editingOrder, [name]: e.target.checked });
    } else {
        setEditingOrder({ ...editingOrder, [name]: value });
    }
  };


  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4 border-b pb-2">
        <h2 className="text-2xl font-bold text-slate-700">Zgodovina Naročil</h2>
        <button
          onClick={onRefresh}
          disabled={isLoading || !!editingOrder || !!isDeleting}
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
                <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">Dejanja</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-slate-200">
              {orders.map((order) => {
                const isEditingThisRow = editingOrder?.id === order.id;
                return (
                    <tr key={order.id} className={isEditingThisRow ? 'bg-blue-50' : ''}>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 align-top">{order.date}</td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-slate-800 align-top">{order.user}</td>
                    <td className="px-4 py-4 text-sm text-slate-600 align-top">
                        {isEditingThisRow ? (
                        <input
                            type="text"
                            name="meal"
                            value={editingOrder.meal}
                            onChange={handleInputChange}
                            className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        ) : (
                        order.meal
                        )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm text-slate-600 align-top">
                        {isEditingThisRow ? (
                        <input
                            type="checkbox"
                            name="hasSoup"
                            checked={editingOrder.hasSoup}
                            onChange={handleInputChange}
                            className="h-5 w-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                        />
                        ) : (
                        order.hasSoup ? 'Da' : 'Ne'
                        )}
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-500 italic align-top">
                         {isEditingThisRow ? (
                        <textarea
                            name="note"
                            value={editingOrder.note || ''}
                            onChange={handleInputChange}
                            rows={2}
                            className="w-full px-2 py-1 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                        />
                        ) : (
                        order.note || '-'
                        )}
                    </td>
                    <td className="px-4 py-4 whitespace-nowrap text-sm font-medium align-top">
                        <div className="flex items-center gap-4">
                        {isEditingThisRow ? (
                            <>
                            <button onClick={handleSaveClick} disabled={isUpdating === order.id} className="text-green-600 hover:text-green-800 disabled:text-slate-300 font-semibold flex items-center">
                                {isUpdating === order.id ? <Spinner /> : 'Shrani'}
                            </button>
                            <button onClick={handleCancelClick} disabled={isUpdating === order.id} className="text-slate-500 hover:text-slate-700 disabled:text-slate-300">Prekliči</button>
                            </>
                        ) : (
                            <>
                                <button onClick={() => handleEditClick(order)} disabled={!!editingOrder || !!isDeleting} className="text-blue-600 hover:text-blue-800 disabled:text-slate-300 font-semibold">Uredi</button>
                                <button onClick={() => handleDeleteClick(order)} disabled={!!editingOrder || isDeleting === order.id} className="text-red-600 hover:text-red-800 disabled:text-slate-300 font-semibold flex items-center">
                                    {isDeleting === order.id ? <Spinner /> : 'Izbriši'}
                                </button>
                            </>
                        )}
                        </div>
                    </td>
                    </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default OrderHistory;