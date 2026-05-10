import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ConsentModal from '../components/common/ConsentModal';
import { useEffect, useState } from 'react';
import { saveConsentFlag } from '../services/api';
import { FullPageSpinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';
import { PLATFORM_VERSION } from '../config/pilotConfig';
import { CheckCircle } from 'lucide-react';

export default function ConsentPage() {
  const { user, updateConsentFlag } = useUser();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [showNoConfirm, setShowNoConfirm] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    if (user?.consentFlag !== null && user?.consentFlag !== undefined) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleConsent = async (consent: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      await saveConsentFlag(user.id, consent, PLATFORM_VERSION);
      updateConsentFlag(consent);
      showToast('Preference saved!', 'success');
    } catch {
      updateConsentFlag(consent);
      showToast('Preference saved locally.', 'warning');
    }
    setSaving(false);
    if (consent) {
      navigate('/dashboard', { replace: true });
    } else {
      setShowNoConfirm(true);
    }
  };

  if (saving) return <FullPageSpinner label="Saving your preference..." />;

  if (showNoConfirm) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-xl max-w-md w-full p-8 text-center">
          <CheckCircle className="w-14 h-14 text-green-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-900 mb-3">Your preference has been recorded.</h2>
          <p className="text-gray-600 text-sm mb-6">
            You still have full access to ScholarScaffold as a course tool. Your activity will not be included in the research dataset.
          </p>
          <button
            onClick={() => navigate('/dashboard', { replace: true })}
            className="w-full bg-primary-600 text-white py-3 rounded-xl font-semibold hover:bg-primary-700 transition-colors"
          >
            Continue to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return <ConsentModal onConsent={handleConsent} />;
}
