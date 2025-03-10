import { format } from "date-fns";
import { ar } from "date-fns/locale";
import axios from "axios";
import { Agent } from "https";
import Link from "next/link";

interface Booking {
  identifier: string;
  packagetitle: string;
  customername: string;
  startdate: string;
  price: number;
  paymentStatus?: string;
  email: string;
}

interface TableRowProps {
  booking: Booking;
  index: number;
  editingBooking: Booking | null;
  setEditingBooking: (booking: Booking | null) => void;
  setBookings: (bookings: Booking[]) => void;
  bookings: Booking[];
  currentPage: number;
  bookingsPerPage: number;
}

export default function TableRow({
  booking,
  index,
  editingBooking,
  setEditingBooking,
  setBookings,
  bookings,
  currentPage,
  bookingsPerPage,
}: TableRowProps) {
  // دالة حذف الحجز
  const handleDelete = async (identifier: string) => {
    // العثور على الحجز المراد حذفه للحصول على اسم العميل
    const bookingToDelete = bookings.find(
      (booking) => booking.identifier === identifier
    );
    const customerName = bookingToDelete?.customername || "غير معروف";
    // إضافة رسالة تأكيد قبل الحذف
    const confirmed = window.confirm(
      `هل أنت متأكد من حذف الحجز للعميل ${customerName}؟`
    );
    if (!confirmed) return;
    try {
      await axios.post(
        "https://local.dotcms.site:8443/api/v1/workflow/actions/default/fire/DELETE",
        {
          contentlet: {
            identifier: identifier,
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOTCMS_API_TOKEN}`,
          },
          httpsAgent: new Agent({ rejectUnauthorized: false }),
        }
      );
      setBookings(
        bookings.filter((booking) => booking.identifier !== identifier)
      );
      alert("تم حذف الحجز بنجاح");
    } catch (error) {
      console.error("Failed to delete booking:", error);
      alert("حدث خطأ أثناء حذف الحجز");
    }
  };

  // دالة تعديل الحجز
  const handleEdit = (booking: Booking) => {
    setEditingBooking({
      ...booking,
      packagetitle: booking.packagetitle || "",
      customername: booking.customername || "",
      email: booking.email || "",
      startdate: booking.startdate || "",
      price: booking.price || 0,
      paymentStatus: booking.paymentStatus || "Pending",
    });
  };

  const handleSaveEdit = async () => {
    if (!editingBooking) return;

    try {
      const response = await axios.post(
        "https://local.dotcms.site:8443/api/content/publish/1",
        {
          identifier: editingBooking.identifier,
          stInode: "714d52997661885a116ad9162edee41b",
          packagetitle: editingBooking.packagetitle,
          customername: editingBooking.customername,
          startdate: editingBooking.startdate,
          price: editingBooking.price,
          email: editingBooking.email,
          paymentStatus: editingBooking.paymentStatus,
          languageId: 1,
          host: "5d3ddd0d4019e98a79df13671b0772d1",
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOTCMS_API_TOKEN}`,
          },
          httpsAgent: new Agent({ rejectUnauthorized: false }),
        }
      );

      if (response.status === 200) {
        setBookings(
          bookings.map((booking) =>
            booking.identifier === editingBooking.identifier
              ? editingBooking
              : booking
          )
        );
        setEditingBooking(null);
        alert("تم تعديل الحجز بنجاح");
      }
    } catch (error) {
      console.error("Failed to update booking:", error);
      alert("حدث خطأ أثناء تعديل الحجز");
    }
  };

  return (
    <tr key={booking.identifier} className="hover:bg-base-100">
      <td className="border border-base-300 px-4 py-2">
        {(currentPage - 1) * bookingsPerPage + index + 1}{" "}
        {/* حساب الرقم التسلسلي */}
      </td>
      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <input
            type="text"
            value={editingBooking.packagetitle}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                packagetitle: e.target.value,
              })
            }
            className="input input-bordered w-full"
            placeholder="عنوان الباقة"
          />
        ) : (
          booking.packagetitle
        )}
      </td>
      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <input
            type="text"
            value={editingBooking.customername}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                customername: e.target.value,
              })
            }
            className="input input-bordered w-full"
            placeholder="اسم العميل"
          />
        ) : (
          booking.customername
        )}
      </td>
      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <input
            type="email"
            value={editingBooking.email}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                email: e.target.value,
              })
            }
            className="input input-bordered w-full"
            placeholder="الايميل"
          />
        ) : (
          <a
            href={`mailto:${booking.email}`}
            className="text-blue-500 hover:underline"
          >
            {booking.email}
          </a>
        )}
      </td>
      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <input
            type="date"
            value={editingBooking.startdate}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                startdate: e.target.value,
              })
            }
            className="input input-bordered w-full"
            placeholder="تاريخ البدء"
          />
        ) : (
          format(new Date(booking.startdate), "dd MMMM yyyy", {
            locale: ar,
          })
        )}
      </td>
      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <input
            type="number"
            value={editingBooking.price}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                price: Number(e.target.value),
              })
            }
            className="input input-bordered w-full"
            placeholder="السعر"
          />
        ) : (
          `${booking.price} ريال`
        )}
      </td>

      <td className="border border-base-300 px-4 py-2">
        {editingBooking?.identifier === booking.identifier ? (
          <select
            value={editingBooking.paymentStatus || "Pending"}
            onChange={(e) =>
              setEditingBooking({
                ...editingBooking,
                paymentStatus: e.target.value,
              })
            }
            className="select select-bordered w-full"
            aria-label="حالة الدفع"
          >
            <option value="Success">ناجح</option>
            <option value="Pending">معلق</option>
          </select>
        ) : (
          <span
            className={`badge flex items-center gap-1 ${
              booking.paymentStatus === "Success"
                ? "badge-success"
                : booking.paymentStatus === "Pending"
                ? "badge-warning"
                : "badge-error"
            }`}
          >
            {booking.paymentStatus === "Success" && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Success Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            {booking.paymentStatus === "Pending" && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Pending Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M12 8v4l3 3"
                />
              </svg>
            )}
            {!booking.paymentStatus && (
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <title>Error Icon</title>
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
            {booking.paymentStatus || "غير محدد"}
          </span>
        )}
      </td>
      <td>
        {editingBooking?.identifier === booking.identifier ? (
          <button
            type="button"
            className="btn btn-success btn-sm mr-2 flex items-center gap-1"
            onClick={handleSaveEdit}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Save Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 13l4 4L19 7"
              />
            </svg>
            حفظ
          </button>
        ) : (
          <button
            type="button"
            className="btn btn-primary btn-sm mr-2 flex items-center gap-1"
            onClick={() => handleEdit(booking)}
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <title>Edit Icon</title>
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            تعديل
          </button>
        )}
        <button
          type="button"
          className="btn btn-error btn-sm flex items-center gap-1"
          onClick={() => handleDelete(booking.identifier)}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <title>Delete Icon</title>
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5-4h4M4 7h16"
            />
          </svg>
          حذف
        </button>
        <Link
          href={`/bookings/${booking.identifier}`}
          className="btn btn-info btn-sm flex items-center gap-1"
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
              d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
            />
          </svg>
          عرض التفاصيل
        </Link>
      </td>
    </tr>
  );
}
