interface PaginationControlsProps {
  currentPage: number;
  totalPages: number;
  bookingsPerPage: number;
  setCurrentPage: (page: number | ((prev: number) => number)) => void;
  setBookingsPerPage: (perPage: number) => void;
}

export default function PaginationControls({
  currentPage,
  totalPages,
  bookingsPerPage,
  setCurrentPage,
  setBookingsPerPage,
}: PaginationControlsProps) {
  const handlePerPageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBookingsPerPage(Number(e.target.value));
    setCurrentPage(1);
  };

  return (
    <div className="flex justify-center mt-4 gap-4 items-center">
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() => setCurrentPage((prev: number) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        السابق
      </button>
      <span>
        صفحة {currentPage} من {totalPages}
      </span>
      <button
        type="button"
        className="btn btn-outline btn-sm"
        onClick={() =>
          setCurrentPage((prev: number) => Math.min(prev + 1, totalPages))
        }
        disabled={currentPage === totalPages}
      >
        التالي
      </button>
      <div className="flex items-center gap-2">
        <label htmlFor="per-page" className="label">
          <span className="label-text">عرض لكل صفحة:</span>
        </label>
        <select
          id="per-page"
          value={bookingsPerPage}
          onChange={handlePerPageChange}
          className="select select-bordered select-sm"
        >
          <option value={10}>10</option>
          <option value={20}>20</option>
          <option value={50}>50</option>
        </select>
      </div>
    </div>
  );
}
