import React from 'react';
import { AlertCircle, CheckCircle2, Info, AlertTriangle, X } from 'lucide-react';

const ALERT_CONFIG = {
  error: {
    container: 'bg-rose-50 border-rose-200 text-rose-800',
    icon: AlertCircle,
    iconColor: 'text-rose-500',
  },
  success: {
    container: 'bg-emerald-50 border-emerald-200 text-emerald-800',
    icon: CheckCircle2,
    iconColor: 'text-emerald-500',
  },
  warning: {
    container: 'bg-amber-50 border-amber-200 text-amber-800',
    icon: AlertTriangle,
    iconColor: 'text-amber-500',
  },
  info: {
    container: 'bg-blue-50 border-blue-200 text-blue-800',
    icon: Info,
    iconColor: 'text-blue-500',
  },
};

export const Alert = ({
  type = 'info',
  title,
  message,
  children,
  onClose,
  className = '',
}) => {
  const config = ALERT_CONFIG[type] || ALERT_CONFIG.info;
  const IconComponent = config.icon;

  return (
    <div
      role="alert"
      className={`flex items-start gap-3 p-4 rounded-lg border ${config.container} ${className}`}
    >
      <IconComponent className={`w-5 h-5 flex-shrink-0 mt-0.5 ${config.iconColor}`} />
      <div className="flex-1 text-sm">
        {title && <h4 className="font-semibold mb-0.5">{title}</h4>}
        {message && <p>{message}</p>}
        {children}
      </div>
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          className="text-slate-400 hover:text-slate-600 transition-colors p-0.5 rounded"
          aria-label="Dismiss alert"
        >
          <X className="w-4 h-4" />
        </button>
      )}
    </div>
  );
};

export default Alert;

