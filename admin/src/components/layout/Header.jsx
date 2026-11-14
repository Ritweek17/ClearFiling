import React, { useState } from 'react';
import { Menu, LogOut, Shield, ExternalLink } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import Button from '../common/Button';
import ConfirmModal from '../common/ConfirmModal';

export const Header = ({ onToggleSidebar }) => {
  const { user, logout } = useAuth();
  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleConfirmLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
    } finally {
      setIsLoggingOut(false);
      setShowLogoutModal(false);
    }
  };

  return (
    <>
      <header className="h-16 bg-white border-b border-slate-200 px-4 sm:px-6 lg:px-8 flex items-center justify-between sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onToggleSidebar}
            className="p-2 -ml-2 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded-lg lg:hidden"
            aria-label="Open sidebar"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div>
            <span className="hidden sm:inline-block text-xs font-medium text-brand-600 bg-brand-50 px-2 py-0.5 rounded border border-brand-100">
              ClearFiling Enterprise
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3 sm:gap-4">
          {/* Quick link to public website */}
          <a
            href="https://www.clearfiling.co.in"
            target="_blank"
            rel="noopener noreferrer"
            className="hidden md:inline-flex items-center gap-1.5 text-xs text-slate-500 hover:text-slate-800 transition-colors py-1.5 px-2.5 rounded-md hover:bg-slate-50 border border-transparent hover:border-slate-200"
          >
            <span>Live Website</span>
            <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
          </a>

          <div className="h-4 w-px bg-slate-200 hidden md:block" />

          {/* User Profile Pill */}
          {user && (
            <div className="flex items-center gap-2 text-right">
              <span className="hidden sm:inline-block text-xs text-slate-500">
                Signed in as <strong className="text-slate-800">{user.email}</strong>
              </span>
            </div>
          )}

          {/* Logout Button */}
          <Button
            variant="outline"
            size="sm"
            icon={LogOut}
            onClick={() => setShowLogoutModal(true)}
            className="text-xs text-slate-600 hover:text-rose-600 hover:border-rose-300"
          >
            <span className="hidden sm:inline">Logout</span>
          </Button>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      <ConfirmModal
        isOpen={showLogoutModal}
        onClose={() => setShowLogoutModal(false)}
        onConfirm={handleConfirmLogout}
        isLoading={isLoggingOut}
        title="Sign Out of Console"
        message="Are you sure you want to end your current administrative session? You will be returned to the login screen."
        confirmText="Sign Out"
        confirmVariant="danger"
        type="warning"
      />
    </>
  );
};

export default Header;

