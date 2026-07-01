import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Phone, Calendar } from 'lucide-react';
import Button from '../ui/Button';
import { COMPANY_INFO } from '../../data/companyInfo';

const CTAButtons = ({ className = '', showCall = true, buttonSize = 'sm', onConsultationClick }) => {
  const navigate = useNavigate();

  const handleCall = () => {
    window.location.href = COMPANY_INFO.contact.mobile.href;
  };

  const handleConsultation = () => {
    if (onConsultationClick) {
      onConsultationClick();
    }
    navigate('/contact');
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      {showCall && (
        <Button
          variant="secondary"
          size={buttonSize}
          icon={Phone}
          onClick={handleCall}
          aria-label="Call ClearFiling"
          className="font-medium text-slate-700 hover:text-brand-primary"
        >
          Call Now
        </Button>
      )}
      
      <Button
        variant="primary"
        size={buttonSize}
        icon={Calendar}
        iconPosition="right"
        onClick={handleConsultation}
        aria-label="Get Free Consultation"
        className="font-semibold tracking-wide"
      >
        Get Free Consultation
      </Button>
    </div>
  );
};

export default CTAButtons;
