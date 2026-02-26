import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ConsentModal from '../components/common/ConsentModal';
import { useEffect, useState } from 'react';
import { saveConsentFlag } from '../services/api';

export default function ConsentPage() {
  const { user, updateConsentFlag } = useUser();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (user?.consentFlag !== null && user?.consentFlag !== undefined) {
      navigate('/dashboard', { replace: true });
    }
  }, [user, navigate]);

  const handleConsent = async (consent: boolean) => {
    if (!user) return;
    setSaving(true);
    try {
      await saveConsentFlag(user.id, consent);
      updateConsentFlag(consent);
      navigate('/dashboard', { replace: true });
    } catch {
      updateConsentFlag(consent);
      navigate('/dashboard', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-gray-500">Saving your preference...</p>
      </div>
    );
  }

  return <ConsentModal onConsent={handleConsent} />;
}
