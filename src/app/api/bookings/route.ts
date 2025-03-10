import type { NextRequest } from "next/server";
import { NextResponse } from "next/server";
import axios from "axios";
import { Agent } from "https";
import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAILTRAP_HOST,
  port: Number(process.env.MAILTRAP_PORT),
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export async function POST(request: NextRequest) {
  try {
    const {
      packageTitle,
      customerName,
      startDate,
      price,
      paymentStatus,
      email,
    } = await request.json();

    const body = {
      stInode: "714d52997661885a116ad9162edee41b",
      packagetitle: packageTitle,
      customername: customerName,
      startdate: startDate,
      price: price,
      email: email,
      paymentStatus: paymentStatus || "Pending",
      languageId: 1,
      host: "5d3ddd0d4019e98a79df13671b0772d1",
    };

    console.log("Sending to DotCMS:", body);

    const response = await axios.post(
      "https://local.dotcms.site:8443/api/content/publish/1",
      body,
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.DOTCMS_API_TOKEN}`,
        },
        httpsAgent: new Agent({ rejectUnauthorized: false }),
      }
    );

    if (response.status === 200) {
      console.log("Attempting to send email to:", email);
      const mailOptions = {
        from: "test@tourism-portal.com",
        to: email,
        subject: "تأكيد حجز باقتك السياحية",
        text: `مرحبًا ${customerName}،\n\nتم حجز باقتك "${packageTitle}" بنجاح!\nالتاريخ: ${startDate}\nالسعر: ${price} ريال\nحالة الدفع: ${paymentStatus}\n\nشكرًا لاختيارك بوابة السياحة!`,
      };

      try {
        await transporter.sendMail(mailOptions);
        console.log("Email sent successfully to:", email);
      } catch (mailError) {
        console.error("Failed to send email:", mailError);
        throw mailError;
      }
    }

    console.log("Booking created successfully with status:", response.status);
    return NextResponse.json({ message: "Booking created successfully" });
  } catch (error) {
    console.error("API Route Error:", error);
    return NextResponse.json(
      {
        error: "Internal Server Error",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 }
    );
  }
}
