import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ConsentModal from '../components/common/ConsentModal';
import { useEffect, useState } from 'react';
import { saveConsentFlag } from '../services/api';
import { FullPageSpinner } from '../components/common/Spinner';
import { useToast } from '../context/ToastContext';

export default function ConsentPage() {
  const { user, updateConsentFlag } = useUser();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
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
      await saveConsentFlag(user.id, consent);
      updateConsentFlag(consent);
      showToast('Preference saved!', 'success');
      navigate('/dashboard', { replace: true });
    } catch {
      updateConsentFlag(consent);
      showToast('Preference saved locally.', 'warning');
      navigate('/dashboard', { replace: true });
    } finally {
      setSaving(false);
    }
  };

  if (saving) {
    return <FullPageSpinner label="Saving your preference..." />;
  }

  return <ConsentModal onConsent={handleConsent} />;
}
