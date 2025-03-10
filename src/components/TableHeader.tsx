interface TableHeaderProps {
  sortField: keyof Booking | null;
  sortDirection: "asc" | "desc";
  setSortField: (field: keyof Booking | null) => void;
  setSortDirection: (direction: "asc" | "desc") => void;
}

export default function TableHeader({
  sortField,
  sortDirection,
  setSortField,
  setSortDirection,
}: TableHeaderProps) {
  const handleSort = (field: keyof Booking) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  return (
    <thead className="bg-base-200">
      <tr>
        <th className="border border-base-300 px-4 py-2">الرقم</th>
        <th className="border border-base-300 px-4 py-2">عنوان الباقة</th>
        <th className="border border-base-300 px-4 py-2">اسم العميل</th>
        <th className="border border-base-300 px-4 py-2">الايميل</th>
        <th
          className="border border-base-300 px-4 py-2 cursor-pointer hover:bg-base-300"
          onClick={() => handleSort("startdate")}
        >
          تاريخ البدء{" "}
          {sortField === "startdate" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}{" "}
        </th>
        <th
          className="border border-base-300 px-4 py-2 cursor-pointer hover:bg-base-300"
          onClick={() => handleSort("price")}
        >
          السعر{" "}
          {sortField === "price" && (
            <span>{sortDirection === "asc" ? "↑" : "↓"}</span>
          )}
        </th>
        <th className="border border-base-300 px-4 py-2">حالة الدفع</th>
        <th className="border border-base-300 px-4 py-2">الإجراءات</th>
      </tr>
    </thead>
  );
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
