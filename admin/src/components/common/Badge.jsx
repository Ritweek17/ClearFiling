import React from 'react';

const STATUS_STYLES = {
  // Document Lifecycle
  published: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  draft: 'bg-amber-50 text-amber-700 border-amber-200',
  archived: 'bg-slate-100 text-slate-700 border-slate-200',

  // Active State
  active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  inactive: 'bg-slate-100 text-slate-600 border-slate-200',

  // Roles
  super_admin: 'bg-indigo-50 text-indigo-700 border-indigo-200',
  admin: 'bg-blue-50 text-blue-700 border-blue-200',
  editor: 'bg-teal-50 text-teal-700 border-teal-200',
};

const DOT_COLORS = {
  published: 'bg-emerald-500',
  draft: 'bg-amber-500',
  archived: 'bg-slate-400',
  active: 'bg-emerald-500',
  inactive: 'bg-slate-400',
  super_admin: 'bg-indigo-500',
  admin: 'bg-blue-500',
  editor: 'bg-teal-500',
};

export const Badge = ({ status = 'draft', label, showDot = true, className = '' }) => {
  const normalized = status.toLowerCase();
  const style = STATUS_STYLES[normalized] || 'bg-slate-100 text-slate-700 border-slate-200';
  const dotColor = DOT_COLORS[normalized] || 'bg-slate-400';
  const displayLabel = label || status.replace('_', ' ');

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize ${style} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full ${dotColor}`} />}
      {displayLabel}
    </span>
  );
};

export default Badge;

