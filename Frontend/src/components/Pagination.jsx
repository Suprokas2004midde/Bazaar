import React from "react";
import { ChevronLeft, ChevronRight, ChevronDown } from "lucide-react";

const Pagination = ({
  currentPage = 1,
  totalPages = 1,
  onPageChange,
  itemsPerPage = 10,
  onItemsPerPageChange,
  itemsPerPageOptions = [8, 10, 12],
}) => {
  if (totalPages <= 0) return null;

  // Helper to generate visible page numbers with ellipsis
  const getPageNumbers = () => {
    const pages = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible + 2) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      pages.push(1);

      let start = Math.max(2, currentPage - 1);
      let end = Math.min(totalPages - 1, currentPage + 1);

      if (currentPage <= 3) {
        start = 2;
        end = 4;
      } else if (currentPage >= totalPages - 2) {
        start = totalPages - 3;
        end = totalPages - 1;
      }

      if (start > 2) {
        pages.push("...");
      }

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (end < totalPages - 1) {
        pages.push("...");
      }

      pages.push(totalPages);
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="w-full flex justify-center mt-8">
      <div className="inline-flex items-center justify-between gap-3 sm:gap-5 px-4 py-2 rounded-full bg-[var(--bg-card)] border border-[var(--border-color)] shadow-xs transition-all flex-wrap sm:flex-nowrap">
        {/* Previous Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage === 1}
          className="p-1.5 rounded-full hover:bg-[var(--bg-subtle)] text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="Previous Page"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1.5">
          {pageNumbers.map((page, index) => {
            if (page === "...") {
              return (
                <span
                  key={`ellipsis-${index}`}
                  className="px-1.5 text-xs font-semibold text-[var(--text-muted)] select-none"
                >
                  ...
                </span>
              );
            }

            const isActive = page === currentPage;

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                className={`w-7 h-7 sm:w-8 sm:h-8 rounded-full text-xs sm:text-sm font-semibold flex items-center justify-center transition-all cursor-pointer ${
                  isActive
                    ? "bg-indigo-500/15 text-indigo-600 dark:bg-indigo-500/30 dark:text-indigo-300 border border-indigo-500/40 shadow-xs font-bold"
                    : "text-[var(--text-main)] hover:bg-[var(--bg-subtle)]"
                }`}
              >
                {page}
              </button>
            );
          })}
        </div>

        {/* Next Button */}
        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage === totalPages}
          className="p-1.5 rounded-full hover:bg-[var(--bg-subtle)] text-[var(--text-main)] disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer transition-colors"
          title="Next Page"
        >
          <ChevronRight className="w-4 h-4" />
        </button>

        {/* Items Per Page Select */}
        {onItemsPerPageChange && (
          <div className="relative flex items-center ml-2 border-l border-[var(--border-color)]/60 pl-3">
            <select
              value={itemsPerPage}
              onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
              className="appearance-none bg-[var(--bg-subtle)] text-[var(--text-main)] border border-[var(--border-color)] rounded-full pl-3 pr-7 py-1 text-xs font-medium focus:outline-none focus:ring-1 focus:ring-[var(--primary-accent)] cursor-pointer"
            >
              {itemsPerPageOptions.map((option) => (
                <option key={option} value={option}>
                  {option} / page
                </option>
              ))}
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-[var(--text-muted)] absolute right-2 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
};

export default Pagination;
