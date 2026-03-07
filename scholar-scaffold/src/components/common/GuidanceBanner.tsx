import { Lightbulb, X } from 'lucide-react';
import { useState } from 'react';

interface GuidanceBannerProps {
  title: string;
  steps?: string[];
  children?: React.ReactNode;
  dismissible?: boolean;
  storageKey?: string;
}

export default function GuidanceBanner({ title, steps, children, dismissible = true, storageKey }: GuidanceBannerProps) {
  const key = storageKey ? `guidance_dismissed_${storageKey}` : null;
  const [dismissed, setDismissed] = useState(() => {
    if (!key) return false;
    return localStorage.getItem(key) === 'true';
  });

  if (dismissed) return null;

  const handleDismiss = () => {
    setDismissed(true);
    if (key) localStorage.setItem(key, 'true');
  };

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-xl p-5 mb-6 relative">
      <div className="flex items-start gap-3">
        <Lightbulb className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <h3 className="font-semibold text-blue-900 text-sm mb-1">{title}</h3>
          {steps && steps.length > 0 && (
            <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
              {steps.map((step, i) => (
                <li key={i}>{step}</li>
              ))}
            </ol>
          )}
          {children && <div className="text-sm text-blue-800">{children}</div>}
        </div>
        {dismissible && (
          <button onClick={handleDismiss} className="text-blue-400 hover:text-blue-600 flex-shrink-0" aria-label="Dismiss">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}
