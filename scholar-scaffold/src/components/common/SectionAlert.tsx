import { AlertTriangle, Info, Lightbulb } from 'lucide-react';

type AlertType = 'warning' | 'info' | 'coaching';

interface SectionAlertProps {
  type: AlertType;
  message: string;
}

const alertConfig = {
  warning: { icon: AlertTriangle, bg: 'bg-amber-50 border-amber-200', text: 'text-amber-800', iconColor: 'text-amber-500' },
  info: { icon: Info, bg: 'bg-blue-50 border-blue-200', text: 'text-blue-800', iconColor: 'text-blue-500' },
  coaching: { icon: Lightbulb, bg: 'bg-purple-50 border-purple-200', text: 'text-purple-800', iconColor: 'text-purple-500' },
};

export default function SectionAlert({ type, message }: SectionAlertProps) {
  const config = alertConfig[type];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-3 p-3 rounded-lg border ${config.bg}`}>
      <Icon className={`w-5 h-5 mt-0.5 flex-shrink-0 ${config.iconColor}`} />
      <p className={`text-sm ${config.text}`}>{message}</p>
    </div>
  );
}
