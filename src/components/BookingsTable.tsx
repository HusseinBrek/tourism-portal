"use client";

import { useState } from "react";
import FilterControls from "./FilterControls";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import PaginationControls from "./PaginationControls";

interface Booking {
  identifier: string;
  packagetitle: string;
  customername: string;
  startdate: string;
  price: number;
  paymentStatus?: string;
  email: string;
}

interface BookingsTableProps {
  initialBookings: Booking[];
}

export default function BookingsTable({ initialBookings }: BookingsTableProps) {
  const [bookings, setBookings] = useState(
    initialBookings.map((booking) => ({
      ...booking,
      startdate: booking.startdate.split(" ")[0],
    }))
  );
  const [filterStatus, setFilterStatus] = useState<string>("All");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sortField, setSortField] = useState<keyof Booking | null>(null);
  const [sortDirection, setSortDirection] = useState<"asc" | "desc">("asc");
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [bookingsPerPage, setBookingsPerPage] = useState<number>(10);
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null);

  const filteredBookings = bookings
    .filter((booking) => {
      const matchesStatus =
        filterStatus === "All" ||
        (filterStatus === "Undefined" && !booking.paymentStatus) ||
        booking.paymentStatus === filterStatus;
      const matchesSearch =
        !searchQuery ||
        (booking.packagetitle?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        ) ||
        (booking.customername?.toLowerCase() || "").includes(
          searchQuery.toLowerCase()
        );
      return matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      if (!sortField) return 0;
      const aValue = a[sortField];
      const bValue = b[sortField];
      if (typeof aValue === "number" && typeof bValue === "number") {
        return sortDirection === "asc" ? aValue - bValue : bValue - aValue;
      }
      return sortDirection === "asc"
        ? String(aValue || "").localeCompare(String(bValue || ""))
        : String(bValue || "").localeCompare(String(aValue || ""));
    });

  const totalPages = Math.ceil(filteredBookings.length / bookingsPerPage);
  const paginatedBookings = filteredBookings.slice(
    (currentPage - 1) * bookingsPerPage,
    currentPage * bookingsPerPage
  );

  return (
    <div className="overflow-x-auto">
      <FilterControls
        filterStatus={filterStatus}
        setFilterStatus={setFilterStatus}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        filteredBookings={filteredBookings}
      />
      <table className="table w-full border-collapse border border-base-300 shadow-lg">
        <TableHeader
          sortField={sortField}
          sortDirection={sortDirection}
          setSortField={setSortField}
          setSortDirection={setSortDirection}
        />
        <tbody>
          {paginatedBookings.map((booking, index) => (
            <TableRow
              key={booking.identifier}
              booking={booking}
              index={(currentPage - 1) * bookingsPerPage + index + 1}
              editingBooking={editingBooking}
              setEditingBooking={setEditingBooking}
              setBookings={setBookings}
              bookings={bookings}
              currentPage={currentPage}
              bookingsPerPage={bookingsPerPage}
            />
          ))}
        </tbody>
      </table>
      {filteredBookings.length > 0 && (
        <PaginationControls
          currentPage={currentPage}
          totalPages={totalPages}
          bookingsPerPage={bookingsPerPage}
          setCurrentPage={setCurrentPage}
          setBookingsPerPage={setBookingsPerPage}
        />
      )}
    </div>
  );
}
