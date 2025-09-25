import React, { useState, useEffect } from 'react';

interface GuestNameModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

const GuestNameModal: React.FC<GuestNameModalProps> = ({ isOpen, onClose, onSubmit }) => {
  const [name, setName] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (isOpen) {
      setName('');
      setError('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Prosimo, vnesite svoje ime in priimek.');
      return;
    }
    onSubmit(name);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-labelledby="guest-name-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
        <h2 id="guest-name-modal-title" className="text-xl font-bold text-slate-800 mb-4">
          Vnos Imena
        </h2>
        <p className="text-slate-600 mb-4">
          Za oddajo naročila kot gost, prosimo, vnesite svoje ime in priimek.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={`w-full px-4 py-2 border rounded-md shadow-sm text-lg ${error ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            autoFocus
            aria-label="Ime in priimek"
            placeholder="Npr. Janez Novak"
          />
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <div className="flex justify-end gap-3 mt-6">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-slate-200 text-slate-800 font-semibold rounded-md hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-slate-400"
            >
              Prekliči
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Potrdi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GuestNameModal;