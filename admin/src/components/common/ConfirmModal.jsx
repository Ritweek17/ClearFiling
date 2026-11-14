import React from 'react';
import Modal from './Modal';
import Button from './Button';
import { AlertTriangle, Trash2, Archive, Check } from 'lucide-react';

export const ConfirmModal = ({
  isOpen,
  onClose,
  onConfirm,
  title = 'Confirm Action',
  message = 'Are you sure you want to proceed?',
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  confirmVariant = 'danger',
  isLoading = false,
  type = 'danger', // 'danger' | 'warning' | 'info'
}) => {
  const iconConfig = {
    danger: { icon: Trash2, color: 'text-rose-600', bg: 'bg-rose-50' },
    warning: { icon: AlertTriangle, color: 'text-amber-600', bg: 'bg-amber-50' },
    info: { icon: Check, color: 'text-brand-600', bg: 'bg-brand-50' },
  }[type] || { icon: AlertTriangle, color: 'text-slate-600', bg: 'bg-slate-50' };

  const Icon = iconConfig.icon;

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md" showClose={!isLoading}>
      <div className="flex items-start gap-4">
        <div className={`p-3 rounded-full flex-shrink-0 ${iconConfig.bg}`}>
          <Icon className={`w-6 h-6 ${iconConfig.color}`} />
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-slate-900">{title}</h3>
          <p className="mt-2 text-sm text-slate-600 leading-relaxed">{message}</p>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
        <Button variant="outline" size="sm" onClick={onClose} disabled={isLoading}>
          {cancelText}
        </Button>
        <Button
          variant={confirmVariant}
          size="sm"
          onClick={onConfirm}
          isLoading={isLoading}
        >
          {confirmText}
        </Button>
      </div>
    </Modal>
  );
};

export default ConfirmModal;

