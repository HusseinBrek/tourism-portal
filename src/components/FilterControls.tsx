import { utils, writeFile } from "xlsx";

interface FilterControlsProps {
  filterStatus: string;
  setFilterStatus: (value: string) => void;
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  filteredBookings: Booking[];
}

interface Booking {
  identifier: string;
  packagetitle: string;
  customername: string;
  startdate: string;
  price: number;
  paymentStatus?: string;
  email: string;
}

export default function FilterControls({
  filterStatus,
  setFilterStatus,
  searchQuery,
  setSearchQuery,
  filteredBookings,
}: FilterControlsProps) {
  const handleExportToExcel = () => {
    // تنفيذ التصدير إلى Excel
    const worksheetData = filteredBookings.map((booking, index) => ({
      "رقم الحجز": index + 1,
      "عنوان الباقة": booking.packagetitle,
      "اسم العميل": booking.customername,
      "اسم الباقة": booking.packagetitle,
      "تاريخ البدء": booking.startdate,
      السعر: booking.price,
      "حالة الدفع": booking.paymentStatus || "غير محدد",
    }));
    const worksheet = utils.json_to_sheet(worksheetData);
    const workbook = utils.book_new();
    utils.book_append_sheet(workbook, worksheet, "Sheet1");
    writeFile(workbook, "bookings.xlsx");
  };
  return (
    <div className="mb-4 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <label htmlFor="search-input" className="label">
          <span className="label-text">البحث</span>
        </label>
        <input
          id="search-input"
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="ابحث باسم العميل أو الباقة..."
          className="input input-bordered w-full"
        />
      </div>
      <div className="flex-1">
        <label htmlFor="payment-status" className="label">
          <span className="label-text">تصفية حسب حالة الدفع</span>
        </label>
        <select
          id="payment-status"
          name="payment-status"
          aria-label="تصفية حسب حالة الدفع"
          className="select select-bordered w-full"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="All">الكل</option>
          <option value="Success">ناجح</option>
          <option value="Pending">معلق</option>
          <option value="Undefined">غير محدد</option>
        </select>
      </div>
      <div className="flex items-end">
        <button
          type="button"
          className="btn btn-success btn-sm flex itemes-center gap-1"
          onClick={handleExportToExcel}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
          <span>تصدير إلى Excel</span>
        </button>
      </div>
    </div>
  );
}
