import React, { useState, useEffect } from 'react';

interface PinModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (pin: string) => void;
  error: string;
}

const PinModal: React.FC<PinModalProps> = ({ isOpen, onClose, onSubmit, error }) => {
  const [pin, setPin] = useState('');

  useEffect(() => {
    // Reset pin when modal opens or closes
    if (isOpen) {
      setPin('');
    }
  }, [isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(pin);
  };

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-labelledby="pin-modal-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-sm m-4">
        <h2 id="pin-modal-title" className="text-xl font-bold text-slate-800 mb-4">
          Vnos Kode PIN
        </h2>
        <p className="text-slate-600 mb-4">
          Za dostop do skrbniškega pogleda vnesite svojo kodo PIN.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            type="password"
            value={pin}
            onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
            className={`w-full px-4 py-2 border rounded-md shadow-sm text-center text-lg tracking-widest ${error ? 'border-red-500' : 'border-slate-300 focus:border-blue-500'} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            maxLength={4}
            autoFocus
            pattern="\d*"
            inputMode="numeric"
            aria-label="Koda PIN"
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

export default PinModal;