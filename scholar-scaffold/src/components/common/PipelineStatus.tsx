import { useNavigate } from 'react-router-dom';
import { useUser } from '../../context/UserContext';
import { CheckCircle, Circle, Clock, Lock } from 'lucide-react';
import { StageStatus } from '../../types';

const statusConfig: Record<StageStatus, { icon: typeof CheckCircle; color: string; label: string }> = {
  not_started: { icon: Circle, color: 'text-gray-400', label: 'Not Started' },
  in_progress: { icon: Clock, color: 'text-yellow-500', label: 'In Progress' },
  complete: { icon: CheckCircle, color: 'text-green-500', label: 'Complete' },
  locked: { icon: Lock, color: 'text-gray-300', label: 'Locked' },
};

export default function PipelineStatus() {
  const { pipelineStages } = useUser();
  const navigate = useNavigate();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Research Pipeline</h2>
      <div className="space-y-3">
        {pipelineStages.map((stage, index) => {
          const config = statusConfig[stage.status];
          const Icon = config.icon;
          const isClickable = stage.status !== 'locked';

          return (
            <div key={stage.id} className="flex items-center gap-3">
              <div className="flex flex-col items-center">
                <Icon className={`w-6 h-6 ${config.color}`} />
                {index < pipelineStages.length - 1 && (
                  <div className={`w-0.5 h-6 mt-1 ${stage.status === 'complete' ? 'bg-green-300' : 'bg-gray-200'}`} />
                )}
              </div>
              <button
                onClick={() => isClickable && navigate(stage.path)}
                disabled={!isClickable}
                className={`flex-1 text-left p-3 rounded-lg transition-colors ${
                  isClickable ? 'hover:bg-gray-50 cursor-pointer' : 'cursor-not-allowed'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className={`font-medium ${stage.status === 'locked' ? 'text-gray-400' : 'text-gray-900'}`}>
                    {stage.name}
                  </span>
                  <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${
                    stage.status === 'complete' ? 'bg-green-100 text-green-700' :
                    stage.status === 'in_progress' ? 'bg-yellow-100 text-yellow-700' :
                    stage.status === 'locked' ? 'bg-gray-100 text-gray-400' :
                    'bg-gray-100 text-gray-500'
                  }`}>
                    {config.label}
                  </span>
                </div>
                {stage.status === 'locked' && stage.unlockRequirement && (
                  <p className="text-xs text-gray-400 mt-1">Unlock: {stage.unlockRequirement}</p>
                )}
              </button>
            </div>
          );
        })}
      </div>
    </div>
  );
}
