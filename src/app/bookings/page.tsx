import BookingsTable from "@/components/BookingsTable";
import axios from "axios";
import { Agent } from "https";

interface Booking {
  identifier: string;
  packagetitle: string;
  customername: string;
  startdate: string;
  price: number;
  email: string;
  paymentStatus?: string;
}

interface GraphQLResponse {
  data: {
    BookingCollection: Booking[];
  };
}

async function fetchBookings(): Promise<Booking[]> {
  const query = `
    query FetchBookings {
      BookingCollection {
        identifier
        packagetitle
        customername
        startdate
        price
        email
        paymentStatus
      }
    }
  `;

  const response = await axios.post(
    process.env.DOTCMS_API_URL as string,
    { query },
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.DOTCMS_API_TOKEN}`,
      },
      httpsAgent: new Agent({ rejectUnauthorized: false }),
    }
  );

  if (response.status !== 200) {
    throw new Error(`Failed to fetch bookings: ${response.statusText}`);
  }

  const result: GraphQLResponse = response.data;
  if (!result.data?.BookingCollection) {
    throw new Error("No bookings found in response");
  }

  // تنسيق startdate عند الجلب
  return result.data.BookingCollection.map((booking) => ({
    ...booking,
    startdate: booking.startdate.split(" ")[0], // قطع الجزء الزمني
  }));
}

export default async function BookingsPage() {
  const bookings = await fetchBookings();

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-4xl font-bold text-center mb-10">إدارة الحجوزات</h1>
      {bookings.length === 0 ? (
        <p className="text-center">لا توجد حجوزات حاليًا</p>
      ) : (
        <BookingsTable initialBookings={bookings} />
      )}
    </div>
  );
}
