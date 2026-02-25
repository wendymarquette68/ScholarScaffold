import { useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import ConsentModal from '../components/common/ConsentModal';
import { useEffect } from 'react';

export default function ConsentPage() {
  const { user, updateConsentFlag } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.consentFlag !== null && user?.consentFlag !== undefined) {
      navigate('/dashboard');
    }
  }, [user, navigate]);

  const handleConsent = (consent: boolean) => {
    updateConsentFlag(consent);
    navigate('/dashboard');
  };

  return <ConsentModal onConsent={handleConsent} />;
}
