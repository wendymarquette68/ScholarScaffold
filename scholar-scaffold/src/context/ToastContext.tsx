/**
 * ToastContext — Global toast notification system.
 *
 * Usage: Call showToast(message, type) from any component.
 * Types: 'success' (green), 'error' (red), 'warning' (yellow), 'info' (blue).
 * Toasts auto-dismiss after 4 seconds and can be manually closed.
 *
 * Wrap your app with <ToastProvider> in main.tsx.
 * Access via: const { showToast } = useToast();
 */
import { createContext, useContext, useState, useCallback } from 'react';
import { CheckCircle, XCircle, AlertTriangle, Info, X } from 'lucide-react';

type ToastType = 'success' | 'error' | 'warning' | 'info';

interface Toast {
  id: number;
  message: string;
  type: ToastType;
}

interface ToastContextValue {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextValue>({ showToast: () => {} });

export function useToast() {
  return useContext(ToastContext);
}

// Auto-incrementing ID to uniquely identify each toast notification
let nextId = 0;

// Maps each toast type to its corresponding Lucide icon component
const iconMap = {
  success: CheckCircle,
  error: XCircle,
  warning: AlertTriangle,
  info: Info,
};

// Tailwind CSS classes for each toast type's background, border, and text color
const colorMap = {
  success: 'bg-green-50 border-green-200 text-green-800',
  error: 'bg-red-50 border-red-200 text-red-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  info: 'bg-blue-50 border-blue-200 text-blue-800',
};

const iconColorMap = {
  success: 'text-green-500',
  error: 'text-red-500',
  warning: 'text-yellow-500',
  info: 'text-blue-500',
};

/**
 * ToastProvider — Renders toast notifications in the bottom-right corner.
 * Manages the toast queue: adding, auto-removing after 4s, and manual dismiss.
 */
export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const removeToast = useCallback((id: number) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = nextId++;
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => removeToast(id), 4000);
  }, [removeToast]);

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      {/* Toast container — fixed bottom-right, stacks vertically */}
      <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm">
        {toasts.map(toast => {
          const Icon = iconMap[toast.type];
          return (
            <div
              key={toast.id}
              className={`flex items-start gap-3 px-4 py-3 rounded-lg border shadow-lg animate-slide-in ${colorMap[toast.type]}`}
            >
              <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${iconColorMap[toast.type]}`} />
              <p className="text-sm flex-1">{toast.message}</p>
              <button
                onClick={() => removeToast(toast.id)}
                className="flex-shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
}
