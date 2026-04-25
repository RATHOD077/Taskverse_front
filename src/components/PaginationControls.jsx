import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const PaginationControls = ({
  page = 1,
  limit = 10,
  total = 0,
  totalPages = 0,
  hasPrevPage,
  hasNextPage,
  onPageChange,
  label = 'items',
}) => {
  const safeTotalPages = totalPages || Math.max(1, Math.ceil((total || 0) / (limit || 10)));
  const canPrev = typeof hasPrevPage === 'boolean' ? hasPrevPage : page > 1;
  const canNext = typeof hasNextPage === 'boolean' ? hasNextPage : page < safeTotalPages;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = total === 0 ? 0 : Math.min(page * limit, total);

  if (safeTotalPages <= 1 && total <= limit) {
    return null;
  }

  return (
    <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/60 flex items-center justify-between gap-3">
      <p className="text-xs font-semibold text-slate-500">
        Showing {from} to {to} of {total} {label}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => canPrev && onPageChange(page - 1)}
          disabled={!canPrev}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          <ChevronLeft size={14} /> Prev
        </button>

        <span className="text-xs font-bold text-slate-600 px-2">
          {page} / {safeTotalPages}
        </span>

        <button
          type="button"
          onClick={() => canNext && onPageChange(page + 1)}
          disabled={!canNext}
          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-200 bg-white text-xs font-bold text-slate-600 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-slate-50"
        >
          Next <ChevronRight size={14} />
        </button>
      </div>
    </div>
  );
};

export default PaginationControls;
