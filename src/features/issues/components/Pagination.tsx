type PaginationProps = {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onNext: () => void;
  onPrev: () => void;
};

export default function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  onNext,
  onPrev,
}: PaginationProps) {
  return (
    <div className="flex items-center justify-center space-x-1 py-4">
      <button
        onClick={onPrev}
        disabled={currentPage === 1}
        className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-50"
      >
        &lt; Previous
      </button>

      <button
        onClick={onNext}
        disabled={currentPage === totalPages}
        className="px-3 py-1 text-sm font-medium text-gray-500 hover:text-blue-600 disabled:opacity-50"
      >
        Next &gt;
      </button>
    </div>
  );
}
