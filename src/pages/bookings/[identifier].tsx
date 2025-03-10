// src/pages/bookings/[identifier].tsx
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";
import { format } from "date-fns";
import { ar } from "date-fns/locale";
import Link from "next/link";
import { Agent } from "https";

interface Booking {
  identifier: string;
  packagetitle: string;
  customername: string;
  startdate: string;
  price: number;
  paymentStatus?: string;
  email: string;
}

export default function BookingDetails() {
  const router = useRouter();
  const { identifier } = router.query;
  const [booking, setBooking] = useState<Booking | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!identifier) return;

    const fetchBooking = async () => {
      try {
        const response = await axios.get(
          `https://local.dotcms.site:8443/api/content/render/false/query/+contentType:Booking +identifier:${identifier}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.NEXT_PUBLIC_DOTCMS_API_TOKEN}`,
            },
            httpsAgent: new Agent({ rejectUnauthorized: false }),
          }
        );

        const contentlets = response.data.contentlets;
        if (!contentlets || contentlets.length === 0) {
          setError("لم يتم العثور على الحجز");
          setLoading(false);
          return;
        }

        const bookingData = contentlets[0];
        setBooking({
          identifier: bookingData.identifier,
          packagetitle: bookingData.packagetitle,
          customername: bookingData.customername,
          startdate: bookingData.startdate.split(" ")[0],
          price: bookingData.price,
          paymentStatus: bookingData.paymentStatus,
          email: bookingData.email,
        });
        setLoading(false);
      } catch (err) {
        console.error("Failed to fetch booking:", err);
        setError("حدث خطأ أثناء جلب تفاصيل الحجز");
        setLoading(false);
      }
    };

    fetchBooking();
  }, [identifier]);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="alert alert-error">
          <span>{error || "لم يتم العثور على الحجز"}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">تفاصيل الحجز</h1>
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-2 border-gray-300 p-4 rounded-lg bg-red-500">
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-300 p-2">
              <label className="label">
                <span className="label-text font-bold">عنوان الباقة</span>
              </label>
              <p className="text-lg">{booking.packagetitle}</p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-300 p-2">
              <label className="label">
                <span className="label-text font-bold">اسم العميل</span>
              </label>
              <p className="text-lg">{booking.customername}</p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-300 p-2">
              <label className="label">
                <span className="label-text font-bold">البريد الإلكتروني</span>
              </label>
              <p className="text-lg">
                <a
                  href={`mailto:${booking.email}`}
                  className="text-blue-500 hover:underline"
                >
                  {booking.email}
                </a>
              </p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-300 p-2">
              <label className="label">
                <span className="label-text font-bold">تاريخ البدء</span>
              </label>
              <p className="text-lg">
                {format(new Date(booking.startdate), "dd MMMM yyyy", {
                  locale: ar,
                })}
              </p>
            </div>
            <div className="border-b-2 md:border-b-0 md:border-r-2 border-blue-300 p-2">
              <label className="label">
                <span className="label-text font-bold">السعر</span>
              </label>
              <p className="text-lg">{booking.price} ريال</p>
            </div>
            <div className="p-2">
              <label className="label">
                <span className="label-text font-bold">حالة الدفع</span>
              </label>
              <p className="text-lg">{booking.paymentStatus || "غير محدد"}</p>
            </div>
          </div>
          <div className="card-actions mt-4">
            <Link href="/bookings" className="btn btn-primary">
              العودة إلى الحجوزات
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
