import React from 'react';
import { History, ShieldAlert, CheckCircle, Database, Lock, Info } from 'lucide-react';
import Alert from '../components/common/Alert';
import Badge from '../components/common/Badge';

const TRACKED_EVENTS = [
  { action: 'DOCUMENT_CREATED', entity: 'document', description: 'Recorded when a new PDF file and metadata record are created in the repository.' },
  { action: 'DOCUMENT_UPDATED', entity: 'document', description: 'Recorded when document title, description, or category assignment is modified.' },
  { action: 'DOCUMENT_PUBLISHED', entity: 'document', description: 'Recorded when a document is published and made accessible on public endpoints.' },
  { action: 'DOCUMENT_ARCHIVED', entity: 'document', description: 'Recorded when a document is archived and hidden from public searches.' },
  { action: 'DOCUMENT_DELETED', entity: 'document', description: 'Recorded when a document is removed and its PDF purged from storage.' },
  { action: 'DOCUMENT_FILE_REPLACED', entity: 'document', description: 'Recorded when a new PDF replacement replaces the existing asset.' },
  { action: 'CATEGORY_CREATED', entity: 'category', description: 'Recorded when a new document category is registered.' },
  { action: 'CATEGORY_UPDATED', entity: 'category', description: 'Recorded when category name, slug, or display order is updated.' },
  { action: 'CATEGORY_DELETED', entity: 'category', description: 'Recorded when an empty category is deleted.' },
];

export const ActivityLogsPage = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-2 border-b border-slate-200">
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Administrative Audit Trail
        </h1>
        <p className="text-sm text-slate-500 mt-1">
          Immutable audit logging of document lifecycle and administrative operations.
        </p>
      </div>

      {/* Backend Integration Status Notification */}
      <Alert
        type="info"
        title="Backend Integration Status: Storage Active"
        message="The ClearFiling backend actively logs every document and category mutation into the immutable ActivityLog MongoDB collection with admin ID, action type, IP address, user agent, and sanitized metadata. A dedicated administrative listing route (GET /api/admin/activity-logs) has not yet been exposed in the Express router and will be connected upon backend endpoint availability."
      />

      {/* Audit Policy & Architecture Card */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center mb-3">
            <CheckCircle className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Immutable Logging</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Logs are write-only and cannot be altered or overwritten by administrators or editors.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-brand-50 text-brand-600 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Automatic Sanitization</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Passwords, JWT tokens, cookies, and secret keys are automatically redacted prior to database persistence.
          </p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm">
          <div className="w-9 h-9 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center mb-3">
            <Database className="w-5 h-5" />
          </div>
          <h3 className="text-sm font-bold text-slate-900">Client-Owned Database</h3>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Audit entries reside exclusively in the client-owned MongoDB instance under client administrative governance.
          </p>
        </div>
      </div>

      {/* Tracked Action Schemas */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center gap-2">
          <History className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Monitored Audit Events
          </h2>
        </div>

        <div className="divide-y divide-slate-100">
          {TRACKED_EVENTS.map((event) => (
            <div key={event.action} className="p-4 sm:px-6 flex items-start justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-semibold text-slate-800">
                    {event.action}
                  </span>
                  <Badge status={event.entity} showDot={false} className="text-[10px] uppercase" />
                </div>
                <p className="text-xs text-slate-500">{event.description}</p>
              </div>

              <span className="text-[11px] font-medium text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100 whitespace-nowrap">
                Active in Backend
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ActivityLogsPage;

