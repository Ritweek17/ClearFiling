import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  FileText,
  CheckCircle2,
  FileEdit,
  Archive,
  FolderKanban,
  Upload,
  ArrowRight,
  TrendingUp,
  RefreshCw,
  Clock,
} from 'lucide-react';
import documentApi from '../api/documentApi';
import categoryApi from '../api/categoryApi';
import Badge from '../components/common/Badge';
import Button from '../components/common/Button';
import Alert from '../components/common/Alert';
import { CardSkeleton, TableSkeleton } from '../components/common/LoadingSkeleton';

export const DashboardPage = () => {
  const [stats, setStats] = useState({
    totalDocs: 0,
    publishedDocs: 0,
    draftDocs: 0,
    archivedDocs: 0,
    totalCategories: 0,
  });
  const [recentDocs, setRecentDocs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Concurrently query backend endpoints for exact counts
      const [
        totalRes,
        publishedRes,
        draftRes,
        archivedRes,
        categoriesRes,
        recentDocsRes,
      ] = await Promise.all([
        documentApi.getDocuments({ limit: 1 }),
        documentApi.getDocuments({ status: 'published', limit: 1 }),
        documentApi.getDocuments({ status: 'draft', limit: 1 }),
        documentApi.getDocuments({ status: 'archived', limit: 1 }),
        categoryApi.getCategories(),
        documentApi.getDocuments({ limit: 5 }),
      ]);

      setStats({
        totalDocs: totalRes?.pagination?.total || 0,
        publishedDocs: publishedRes?.pagination?.total || 0,
        draftDocs: draftRes?.pagination?.total || 0,
        archivedDocs: archivedRes?.pagination?.total || 0,
        totalCategories: categoriesRes?.categories?.length || 0,
      });

      setCategories(categoriesRes?.categories || []);
      setRecentDocs(recentDocsRes?.documents || []);
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('en-IN', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Quick Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-2 border-b border-slate-200">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-900">
            Document Management Dashboard
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Real-time repository statistics and document publication controls.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            icon={RefreshCw}
            onClick={fetchDashboardData}
            isLoading={loading}
          >
            Refresh
          </Button>
          <Link to="/documents">
            <Button variant="primary" size="sm" icon={Upload}>
              Manage Documents
            </Button>
          </Link>
        </div>
      </div>

      {error && <Alert type="error" message={error} onClose={() => setError(null)} />}

      {/* Metric Cards Grid */}
      {loading ? (
        <CardSkeleton count={5} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {/* Total Documents */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Total Documents
              </span>
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <FileText className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{stats.totalDocs}</div>
            <p className="mt-1 text-xs text-slate-500">All repository files</p>
          </div>

          {/* Published */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-emerald-600 uppercase tracking-wider">
                Published
              </span>
              <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{stats.publishedDocs}</div>
            <p className="mt-1 text-xs text-slate-500">Live on public site</p>
          </div>

          {/* Drafts */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-600 uppercase tracking-wider">
                Drafts
              </span>
              <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                <FileEdit className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{stats.draftDocs}</div>
            <p className="mt-1 text-xs text-slate-500">Private / Pending review</p>
          </div>

          {/* Archived */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Archived
              </span>
              <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-600 flex items-center justify-center">
                <Archive className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{stats.archivedDocs}</div>
            <p className="mt-1 text-xs text-slate-500">Hidden historical files</p>
          </div>

          {/* Categories */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow transition-shadow">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-indigo-600 uppercase tracking-wider">
                Categories
              </span>
              <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center">
                <FolderKanban className="w-4 h-4" />
              </div>
            </div>
            <div className="mt-3 text-2xl font-bold text-slate-900">{stats.totalCategories}</div>
            <p className="mt-1 text-xs text-slate-500">Tax, GST & Legal categories</p>
          </div>
        </div>
      )}

      {/* Two Column Section: Recent Documents & Category Breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pt-2">
        {/* Recent Documents Table (2 cols) */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-4 sm:px-6 border-b border-slate-100 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Recently Updated Documents
              </h2>
            </div>
            <Link
              to="/documents"
              className="text-xs font-medium text-brand-600 hover:text-brand-800 flex items-center gap-1"
            >
              <span>View All</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {loading ? (
            <div className="p-6">
              <TableSkeleton rows={4} cols={4} />
            </div>
          ) : recentDocs.length === 0 ? (
            <div className="p-8 text-center text-sm text-slate-500">
              No documents created yet. Click "Manage Documents" to upload your first PDF.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm divide-y divide-slate-100">
                <thead className="bg-slate-50 text-[11px] font-semibold text-slate-500 uppercase tracking-wider">
                  <tr>
                    <th className="py-2.5 px-4">Title</th>
                    <th className="py-2.5 px-4">Category</th>
                    <th className="py-2.5 px-4">Status</th>
                    <th className="py-2.5 px-4 text-right">Updated</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {recentDocs.map((doc) => (
                    <tr key={doc._id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-900 truncate max-w-xs">
                        {doc.title}
                      </td>
                      <td className="py-3 px-4 text-xs text-slate-600">
                        {doc.category?.name || 'Uncategorized'}
                      </td>
                      <td className="py-3 px-4">
                        <Badge status={doc.status} />
                      </td>
                      <td className="py-3 px-4 text-right text-xs text-slate-500">
                        {formatDate(doc.updatedAt)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Category Breakdown Card (1 col) */}
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Category Distribution
              </h2>
              <Link to="/categories" className="text-xs text-brand-600 hover:underline">
                Manage
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {categories.length === 0 ? (
                <p className="text-xs text-slate-500 italic">No categories created yet.</p>
              ) : (
                categories.slice(0, 5).map((cat) => (
                  <div key={cat._id} className="flex items-center justify-between text-xs">
                    <span className="font-medium text-slate-800 truncate max-w-[170px]">
                      {cat.name}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-slate-100 font-semibold text-slate-700">
                      {cat.documentCount || 0} doc{(cat.documentCount === 1 ? '' : 's')}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100">
            <Link to="/documents">
              <Button variant="outline" size="sm" className="w-full justify-center text-xs">
                Browse Repository
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardPage;

