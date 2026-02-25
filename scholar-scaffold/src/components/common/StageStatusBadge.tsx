import { StageStatus } from '../../types';

const badgeConfig: Record<StageStatus, { bg: string; text: string; label: string }> = {
  not_started: { bg: 'bg-gray-100', text: 'text-gray-600', label: 'Not Started' },
  in_progress: { bg: 'bg-yellow-100', text: 'text-yellow-700', label: 'In Progress' },
  complete: { bg: 'bg-green-100', text: 'text-green-700', label: 'Complete' },
  locked: { bg: 'bg-gray-100', text: 'text-gray-400', label: 'Locked' },
};

export default function StageStatusBadge({ status }: { status: StageStatus }) {
  const config = badgeConfig[status];
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
      {config.label}
    </span>
  );
}
