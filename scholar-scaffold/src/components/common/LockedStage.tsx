import { Lock } from 'lucide-react';

interface LockedStageProps {
  title: string;
  requirements: string[];
  currentProgress?: Record<string, { current: number; required: number }>;
}

export default function LockedStage({ title, requirements, currentProgress }: LockedStageProps) {
  return (
    <div className="bg-white border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
      <Lock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
      <h2 className="text-2xl font-bold text-gray-400 mb-2">{title} is Locked</h2>
      <p className="text-gray-500 mb-6">Complete the following to unlock:</p>
      <div className="max-w-md mx-auto space-y-3">
        {requirements.map((req, i) => {
          const progress = currentProgress?.[req];
          return (
            <div key={i} className="flex items-center gap-3 bg-gray-50 rounded-lg p-3">
              <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                progress && progress.current >= progress.required
                  ? 'bg-green-100 text-green-600'
                  : 'bg-gray-200 text-gray-500'
              }`}>
                {progress ? (progress.current >= progress.required ? '✓' : progress.current) : i + 1}
              </div>
              <span className="text-sm text-gray-600 flex-1 text-left">{req}</span>
              {progress && (
                <span className="text-xs text-gray-400">
                  {progress.current}/{progress.required}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
