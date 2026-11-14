import React from 'react';

export const TableSkeleton = ({ rows = 5, cols = 5 }) => {
  return (
    <div className="w-full bg-white rounded-xl border border-slate-200 overflow-hidden animate-pulse">
      <div className="h-12 bg-slate-100 border-b border-slate-200" />
      <div className="divide-y divide-slate-100">
        {Array.from({ length: rows }).map((_, rIdx) => (
          <div key={rIdx} className="p-4 flex items-center justify-between gap-4">
            {Array.from({ length: cols }).map((_, cIdx) => (
              <div
                key={cIdx}
                className="h-4 bg-slate-200 rounded"
                style={{ width: `${Math.max(40, 100 - cIdx * 15)}px` }}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export const CardSkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
      {Array.from({ length: count }).map((_, idx) => (
        <div key={idx} className="p-5 bg-white rounded-xl border border-slate-200">
          <div className="w-8 h-8 rounded-lg bg-slate-200 mb-3" />
          <div className="w-20 h-3 bg-slate-200 rounded mb-2" />
          <div className="w-14 h-6 bg-slate-300 rounded" />
        </div>
      ))}
    </div>
  );
};

export default { TableSkeleton, CardSkeleton };

