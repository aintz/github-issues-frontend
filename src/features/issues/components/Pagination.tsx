type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onNext: () => void;
  onPrev: () => void;
  loading: boolean;
};

export default function Pagination({
  currentPage,
  totalPages,
  onNext,
  onPrev,
  loading,
}: PaginationProps) {
  const canPrev = currentPage > 1;
  const canNext = currentPage < totalPages;

  return (
    <div className="flex items-center justify-center gap-2 py-4">
      <button
        onClick={onPrev}
        disabled={!canPrev || loading}
        className="px-3 py-1 text-sm font-medium text-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        &lt; Previous
      </button>

      {loading || totalPages === 0 ? (
        <p className="text-sm">Page {currentPage}</p>
      ) : (
        <p className="text-sm">
          Page {currentPage} of {totalPages}
        </p>
      )}

      <button
        onClick={onNext}
        disabled={!canNext || loading}
        className="px-3 py-1 text-sm font-medium text-blue-500 hover:text-blue-600 disabled:cursor-not-allowed disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}
