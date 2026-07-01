import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Phone, MessageSquare, X } from 'lucide-react';
import { FOOTER_CONTACT } from '../../data/footerConfig';

const FloatingCTAs = () => {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div className="fixed bottom-6 right-5 z-50 flex flex-col items-end gap-3" aria-label="Quick contact options">
      <AnimatePresence>
        {isExpanded && (
          <>
            {/* WhatsApp */}
            <motion.a
              key="whatsapp"
              href={FOOTER_CONTACT.whatsapp.href}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              aria-label="Contact ClearFiling via WhatsApp"
              className="flex items-center gap-2.5 bg-brand-success text-white px-4 py-2.5 rounded-full shadow-lg shadow-brand-success/30 text-xs font-bold hover:bg-brand-success/90 transition-colors"
            >
              <MessageSquare className="w-4 h-4" aria-hidden="true" />
              <span>WhatsApp Us</span>
            </motion.a>

            {/* Call */}
            <motion.a
              key="call"
              href={FOOTER_CONTACT.mobile.href}
              initial={{ opacity: 0, scale: 0.5, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.5, y: 10 }}
              transition={{ duration: 0.2 }}
              aria-label={`Call ClearFiling: ${FOOTER_CONTACT.mobile.display}`}
              className="flex items-center gap-2.5 bg-brand-primary text-white px-4 py-2.5 rounded-full shadow-lg shadow-brand-primary/30 text-xs font-bold hover:bg-brand-primary/90 transition-colors"
            >
              <Phone className="w-4 h-4" aria-hidden="true" />
              <span>Call Now</span>
            </motion.a>
          </>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <motion.button
        onClick={() => setIsExpanded((v) => !v)}
        aria-label={isExpanded ? 'Close contact options' : 'Open contact options'}
        aria-expanded={isExpanded}
        whileTap={{ scale: 0.92 }}
        className={`w-12 h-12 rounded-full flex items-center justify-center shadow-xl transition-colors duration-200
          ${isExpanded
            ? 'bg-slate-700 text-white shadow-slate-900/30'
            : 'bg-brand-primary text-white shadow-brand-primary/30'
          }`}
      >
        {isExpanded
          ? <X className="w-5 h-5" aria-hidden="true" />
          : <MessageSquare className="w-5 h-5" aria-hidden="true" />
        }
      </motion.button>
    </div>
  );
};

export default FloatingCTAs;
