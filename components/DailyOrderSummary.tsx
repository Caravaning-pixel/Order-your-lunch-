import React from 'react';
import type { Order } from '../types';

interface DailyOrderSummaryProps {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

interface Summary {
  [key: string]: {
    count: number;
    users: string[];
  };
}

const DailyOrderSummary: React.FC<DailyOrderSummaryProps> = ({ orders, isLoading, error }) => {
  const summary = orders.reduce((acc, order) => {
    if (!acc[order.meal]) {
      acc[order.meal] = { count: 0, users: [] };
    }
    acc[order.meal].count++;
    acc[order.meal].users.push(order.user);
    return acc;
  }, {} as Summary);

  const totalOrders = orders.length;
  const sortedSummary = Object.entries(summary).sort(([, a], [, b]) => b.count - a.count);

  const renderContent = () => {
    if (isLoading) {
      return (
        <div className="flex justify-center items-center h-24">
          <svg className="animate-spin h-8 w-8 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      );
    }

    if (error) {
      return <p className="text-center text-red-600">{error}</p>;
    }

    if (totalOrders === 0) {
      return <p className="text-center text-slate-500">Danes še ni bilo oddanih naročil.</p>;
    }
    
    return (
      <div className="space-y-4">
        {sortedSummary.map(([meal, data]) => {
          const percentage = totalOrders > 0 ? (data.count / totalOrders) * 100 : 0;
          return (
            <div key={meal}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-slate-700">{meal}</span>
                <span className="text-sm font-bold text-slate-800">{data.count}x</span>
              </div>
              <div className="w-full bg-slate-200 rounded-full h-4 overflow-hidden">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="text-xs text-slate-500 mt-1">
                <span className="font-semibold">Naročili:</span> {data.users.join(', ')}
              </div>
            </div>
          );
        })}
      </div>
    );
  };
  

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h3 className="text-2xl font-bold text-slate-700 mb-4 border-b pb-2">
        Današnja Naročila (Skupaj: {totalOrders})
      </h3>
      {renderContent()}
    </div>
  );
};

export default DailyOrderSummary;
