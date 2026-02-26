import { Loader2 } from 'lucide-react';

interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  label?: string;
  className?: string;
}

const sizeMap = {
  sm: 'w-4 h-4',
  md: 'w-6 h-6',
  lg: 'w-10 h-10',
};

export default function Spinner({ size = 'md', label, className = '' }: SpinnerProps) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Loader2 className={`${sizeMap[size]} animate-spin text-primary-600`} />
      {label && <span className="text-gray-500 text-sm">{label}</span>}
    </span>
  );
}

export function FullPageSpinner({ label = 'Loading...' }: { label?: string }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-blue-100 flex items-center justify-center">
      <div className="text-center">
        <Loader2 className="w-12 h-12 text-primary-600 mx-auto mb-4 animate-spin" />
        <p className="text-gray-500 text-sm">{label}</p>
      </div>
    </div>
  );
}
