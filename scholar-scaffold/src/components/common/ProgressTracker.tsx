import { useUser } from '../../context/UserContext';

export default function ProgressTracker() {
  const { reviewProgress } = useUser();

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <div className="text-center">
          <div className="text-2xl font-bold text-primary-600">{reviewProgress.total}</div>
          <div className="text-xs text-gray-500">of 10 Reviews</div>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="text-center">
          <div className="text-2xl font-bold text-green-600">{reviewProgress.included}</div>
          <div className="text-xs text-gray-500">Included (min 5)</div>
        </div>
        <div className="w-px h-10 bg-gray-200" />
        <div className="text-center">
          <div className="text-2xl font-bold text-red-500">{reviewProgress.excluded}</div>
          <div className="text-xs text-gray-500">Excluded (min 2)</div>
        </div>
      </div>
      <div className="w-48">
        <div className="flex justify-between text-xs text-gray-500 mb-1">
          <span>Progress</span>
          <span>{Math.min(reviewProgress.total, 10)}/10</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-primary-600 h-2.5 rounded-full transition-all duration-300"
            style={{ width: `${Math.min((reviewProgress.total / 10) * 100, 100)}%` }}
          />
        </div>
      </div>
    </div>
  );
}
