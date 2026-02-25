import { ShieldCheck } from 'lucide-react';

interface ConsentModalProps {
  onConsent: (consent: boolean) => void;
}

export default function ConsentModal({ onConsent }: ConsentModalProps) {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-2xl w-full p-8">
        <div className="text-center mb-6">
          <ShieldCheck className="w-16 h-16 text-primary-600 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900">Research Participation Consent</h1>
          <p className="text-gray-500 mt-2">Please read the following before proceeding</p>
        </div>

        <div className="bg-gray-50 rounded-xl p-6 mb-6 text-sm text-gray-700 space-y-3">
          <p>
            <strong>ScholarScaffold</strong> is part of an IRB-approved research study examining how
            structured research literacy tools affect scholarly proposal quality.
          </p>
          <p>
            <strong>If you consent,</strong> the following data will be collected for research purposes:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Number of article reviews completed</li>
            <li>Inclusion/exclusion ratios</li>
            <li>Research design identification accuracy</li>
            <li>Draft versions and revision history</li>
            <li>Rubric score improvement over time</li>
            <li>Time-on-task metrics</li>
            <li>Revision engagement patterns</li>
          </ul>
          <p>
            <strong>Important:</strong> Your experience with ScholarScaffold will be <em>identical</em> regardless
            of your choice. No grading decisions are made within this system.
          </p>
          <p>
            Your data will be anonymized and used solely for research on educational tool effectiveness.
            You may withdraw consent at any time.
          </p>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => onConsent(true)}
            className="flex-1 bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            I Consent
          </button>
          <button
            onClick={() => onConsent(false)}
            className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
          >
            I Do Not Consent
          </button>
        </div>
      </div>
    </div>
  );
}
