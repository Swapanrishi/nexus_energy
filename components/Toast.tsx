
import React, { useEffect } from 'react';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

interface ToastProps {
  message: string;
  type: ToastType;
  onClose: () => void;
}

const Toast: React.FC<ToastProps> = ({ message, type, onClose }) => {
  useEffect(() => {
    const timer = setTimeout(onClose, 4000);
    return () => clearTimeout(timer);
  }, [onClose]);

  const styles = {
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    error: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    info: 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400'
  };

  const Icons = {
    success: <CheckCircle size={18} />,
    error: <AlertCircle size={18} />,
    info: <CheckCircle size={18} />
  };

  return (
    <div className={`fixed bottom-8 right-8 z-[100] flex items-center gap-3 px-5 py-3 rounded-2xl border backdrop-blur-md shadow-2xl animate-in fade-in slide-in-from-bottom-4 ${styles[type]}`}>
      {Icons[type]}
      <span className="text-sm font-medium">{message}</span>
      <button onClick={onClose} className="ml-2 hover:opacity-70 transition-opacity">
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
