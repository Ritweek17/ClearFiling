import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, FileText, FolderOpen, ArrowDownToLine, Clock, HelpCircle } from 'lucide-react';
import SectionContainer from '../ui/SectionContainer';
import SectionHeading from '../ui/SectionHeading';
import Card from '../ui/Card';
import MaxWidthContainer from '../ui/MaxWidthContainer';
import Button from '../ui/Button';

// Reusable static configuration / empty arrays for future Admin Panel upload integration
const draftedDocuments = [];
const publicDocuments = [];

/**
 * Reusable DocumentCard Component for future uploads
 */
const DocumentCard = ({ doc, index }) => (
  <motion.div
    initial={{ opacity: 0, y: 16 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.35, delay: index * 0.05 }}
  >
    <Card
      isHoverable
      className="bg-white border border-slate-200/60 rounded-2xl p-5 flex flex-col justify-between h-full hover:shadow-md transition-all duration-300 group"
    >
      <div className="space-y-3">
        <div className="w-10 h-10 rounded-xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary flex-shrink-0">
          <FileText className="w-5 h-5" />
        </div>
        <div>
          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest block">
            {doc.fileSize || 'PDF'}
          </span>
          <h4 className="text-sm font-bold font-heading text-brand-secondary mt-0.5 group-hover:text-brand-primary transition-colors line-clamp-1">
            {doc.name}
          </h4>
        </div>
        <p className="text-xs text-slate-500 font-sans leading-relaxed line-clamp-2">
          {doc.description}
        </p>
      </div>
      <div className="pt-4 mt-4 border-t border-slate-100 flex items-center justify-between">
        <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
          <Clock className="w-3 h-3" />
          {doc.updatedAt || 'Recent'}
        </span>
        <a
          href={doc.fileUrl || '#'}
          download
          className="p-2 rounded-lg bg-slate-50 text-slate-500 hover:bg-brand-primary hover:text-white transition-all outline-none"
          title={`Download ${doc.name}`}
        >
          <ArrowDownToLine className="w-4 h-4" />
        </a>
      </div>
    </Card>
  </motion.div>
);

const DocumentationSection = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('drafted'); // 'drafted' | 'public'

  // Filter logic ready for future uploads integration
  const filteredDrafted = draftedDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredPublic = publicDocuments.filter(
    (doc) =>
      doc.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const currentList = activeTab === 'drafted' ? filteredDrafted : filteredPublic;

  return (
    <SectionContainer
      id="documentation"
      bgType="white"
      animate={false}
      className="py-20 md:py-28 bg-white border-t border-slate-100 relative overflow-hidden"
    >
      {/* Ambient background blur */}
      <div className="absolute top-1/4 right-0 w-[400px] h-[400px] bg-radial-gradient from-brand-accent/3 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      <MaxWidthContainer size="lg" className="space-y-12 px-4 md:px-8">
        {/* Section Header */}
        <SectionHeading
          badge="RESOURCES & DRAFTS"
          title="Documentation"
          description="Search and access important business documents, templates and public resources."
          align="center"
          className="mx-auto"
        />

        {/* Reusable Search Bar & Tab Controls Wrapper */}
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Search Bar */}
          <div className="relative flex items-center bg-slate-50 border border-slate-200/80 focus-within:border-brand-primary focus-within:ring-4 focus-within:ring-brand-primary/10 focus-within:bg-white rounded-2xl shadow-sm transition-all duration-300">
            <Search className="w-4 h-4 text-slate-400 ml-4 flex-shrink-0" />
            <input
              type="text"
              placeholder="Search documents..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-transparent border-none outline-none text-slate-800 placeholder-slate-400 px-3.5 py-3.5 text-sm font-sans"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="mr-4 text-xs text-slate-400 hover:text-slate-600 font-semibold uppercase tracking-wider outline-none"
              >
                Clear
              </button>
            )}
          </div>

          {/* Reusable Tabs Navigation */}
          <div className="flex border-b border-slate-100 justify-center gap-6">
            <button
              onClick={() => setActiveTab('drafted')}
              className={`pb-3.5 text-sm font-bold tracking-wide border-b-2 transition-all outline-none relative
                ${activeTab === 'drafted'
                  ? 'border-brand-primary text-brand-primary font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              Drafted Documents
            </button>
            <button
              onClick={() => setActiveTab('public')}
              className={`pb-3.5 text-sm font-bold tracking-wide border-b-2 transition-all outline-none relative
                ${activeTab === 'public'
                  ? 'border-brand-primary text-brand-primary font-extrabold'
                  : 'border-transparent text-slate-400 hover:text-slate-600'
                }`}
            >
              Public Documents
            </button>
          </div>
        </div>

        {/* Tab Contents Grid */}
        <div className="max-w-4xl mx-auto">
          <AnimatePresence mode="wait">
            {currentList.length > 0 ? (
              <motion.div
                key={`${activeTab}-list`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6"
              >
                {currentList.map((doc, idx) => (
                  <DocumentCard key={doc.id || idx} doc={doc} index={idx} />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key={`${activeTab}-coming-soon`}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.2 }}
                className="w-full flex justify-center"
              >
                <Card className="max-w-md w-full bg-slate-50/50 border border-slate-200/50 rounded-2xl p-8 flex flex-col items-center text-center">
                  <div className="w-16 h-16 rounded-2xl bg-brand-primary/5 border border-brand-primary/10 flex items-center justify-center text-brand-primary mb-5 shadow-inner">
                    <FolderOpen className="w-7 h-7 text-brand-primary" />
                  </div>
                  <h3 className="text-lg font-bold font-heading text-brand-secondary">
                    Coming Soon
                  </h3>
                  <p className="text-xs text-slate-500 font-sans leading-relaxed mt-2.5 max-w-sm">
                    {activeTab === 'drafted'
                      ? 'Drafted documents will be available here soon. Once uploaded by our team, you will be able to search and download them from this section.'
                      : 'Public documents and business resources will be available here soon. Please check back later.'}
                  </p>
                </Card>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </MaxWidthContainer>
    </SectionContainer>
  );
};

export default DocumentationSection;
