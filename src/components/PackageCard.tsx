"use client";

import axios from "axios";
import { useState } from "react";

interface Package {
  title: string;
  price: number;
  description: string;
}

async function createBooking(
  packageTitle: string,
  customerName: string,
  startDate: string,
  price: number,
  cardNumber: string,
  cvc: string,
  expiryDate: string,
  email: string
) {
  // محاكاة الدفع الوهمي
  if (!isValidPayment(cardNumber, cvc, expiryDate)) {
    throw new Error("بيانات الدفع غير صالحة");
  }

  const response = await axios.post("/api/bookings", {
    packageTitle,
    customerName,
    startDate,
    price,
    paymentStatus: "Success",
    email,
  });

  if (response.status !== 200) {
    throw new Error(response.data.error || "Failed to create booking");
  }

  return response.data.message;
}

// دالة وهمية للتحقق من رقم البطاقة (محاكاة)
function isValidPayment(
  cardNumber: string,
  cvc: string,
  expiryDate: string
): boolean {
  // نموذج وهمي: البطاقة صحيحة إذا كانت تطابق هذه القيم
  const isValidCard = cardNumber === "1234-5678-9012-3456";
  const isValidCVC = cvc === "123";
  const isValidExpiryDate = expiryDate === "12/25";
  return isValidCard && isValidCVC && isValidExpiryDate;
}

export default function PackageCard({ title, price, description }: Package) {
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [name, setName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [cardNumber, setCardNumber] = useState("");
  const [cvc, setCVC] = useState("");
  const [expiryDate, setExpiryDate] = useState("");
  const [email, setEmail] = useState("");
  const [isPaymentSuccess, setIsPaymentSuccess] = useState(false);
  const [isBookingSuccess, setIsBookingSuccess] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage("");
    try {
      // محاكاة الدفع أولاً
      setIsPaymentSuccess(true);
      await new Promise((resolve) => setTimeout(resolve, 1000)); // تأخير وهمي لمحاكاة الدفع
      await createBooking(
        title,
        name,
        startDate,
        price,
        cardNumber,
        cvc,
        expiryDate,
        email
      );
      setIsBookingSuccess(true);
      setIsEmailSent(true);
      setTimeout(() => {
        setIsBookingOpen(false);
        setIsPaymentSuccess(false);
        setIsBookingSuccess(false);
        setName("");
        setStartDate("");
        setCardNumber("");
        setCVC("");
        setExpiryDate("");
        setEmail("");
      }, 2000);
    } catch (error) {
      setErrorMessage(
        error instanceof Error ? error.message : "حدث خطأ غير معروف أثناء الحجز"
      );
    }
  };
  return (
    <div className="card w-96 bg-base-100 shadow-xl">
      <div className="card-body">
        <h2 className="card-title">{title}</h2>
        <p>{description}</p>
        <p className="text-lg font-bold">{price} ريال</p>
        <div className="card-actions justify-end">
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => setIsBookingOpen(!isBookingOpen)}
          >
            {isBookingOpen ? "إغلاق" : "احجز الآن"}
          </button>
        </div>
        {isBookingOpen && (
          <form className="mt-4" onSubmit={handleSubmit}>
            <h3 className="text-xl font-semibold">نموذج الحجز</h3>
            {isPaymentSuccess && (
              <div className="alert alert-info mt-2">
                تمت معالجة الدفع بنجاح
              </div>
            )}
            {isBookingSuccess && (
              <div className="alert alert-success mt-2">تم الحجز بنجاح!</div>
            )}{" "}
            {isEmailSent && (
              <div className="alert alert-success mt-2">
                تم إرسال تأكيد الحجز إلى {email}!
              </div>
            )}
            {errorMessage && (
              <div className="alert alert-error mt-2">{errorMessage}</div>
            )}
            <div className="form-control">
              <label htmlFor="name-input" className="label">
                <span className="label-text">الاسم</span>
              </label>
              <input
                id="name-input"
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="email-input" className="label">
                <span className="label-text">البريد الإلكتروني</span>
              </label>
              <input
                id="email-input"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input input-bordered"
                placeholder="example@example.com"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="date-input" className="label">
                <span className="label-text">تاريخ البدء</span>
              </label>
              <input
                id="date-input"
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="input input-bordered"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="card-input" className="label">
                <span className="label-text">
                  رقم البطاقة (استخدم 1234-5678-9012-3456)
                </span>
              </label>
              <input
                id="card-input"
                type="text"
                value={cardNumber}
                onChange={(e) => setCardNumber(e.target.value)}
                className="input input-bordered"
                placeholder="1234-5678-9012-3456"
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="cvc-input" className="label">
                <span className="label-text">CVC (استخدم 123)</span>
              </label>
              <input
                id="cvc-input"
                type="text"
                value={cvc}
                onChange={(e) => setCVC(e.target.value)}
                className="input input-bordered"
                placeholder="123"
                maxLength={3}
                required
              />
            </div>
            <div className="form-control">
              <label htmlFor="expiry-input" className="label">
                <span className="label-text">
                  تاريخ الانتهاء (استخدم 12/25)
                </span>
              </label>
              <input
                id="expiry-input"
                type="text"
                value={expiryDate}
                onChange={(e) => setExpiryDate(e.target.value)}
                className="input input-bordered"
                placeholder="12/25"
                required
              />
            </div>
            <button type="submit" className="btn btn-success mt-4">
              تأكيد الحجز والدفع
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
