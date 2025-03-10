"use client";

import Link from "next/link";
import { usePathname } from "next/navigation"; // استبدال useRouter بـ usePathname

export default function Navbar() {
  const pathname = usePathname(); // الحصول على المسار الحالي

  return (
    <div className="navbar bg-base-100 shadow-lg sticky top-0 z-50">
      <div className="navbar-start">
        <div className="dropdown">
          <label tabIndex={0} className="btn btn-ghost lg:hidden">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </label>
          <ul
            tabIndex={0}
            className="menu menu-sm dropdown-content mt-3 z-[1] p-2 shadow bg-base-100 rounded-box w-52"
          >
            <li>
              <Link href="/" className={pathname === "/" ? "active" : ""}>
                الرئيسية
              </Link>
            </li>
            <li>
              <Link
                href="/bookings"
                className={pathname === "/bookings" ? "active" : ""}
              >
                الحجوزات
              </Link>
            </li>
            <li>
              <Link
                href="/contact"
                className={pathname === "/contact" ? "active" : ""}
              >
                اتصل بنا
              </Link>
            </li>
          </ul>
        </div>
        <Link href="/" className="btn btn-ghost normal-case text-xl">
          بوابة السياحة
        </Link>
      </div>
      <div className="navbar-center hidden lg:flex">
        <ul className="menu menu-horizontal px-1">
          <li>
            <Link href="/" className={pathname === "/" ? "active" : ""}>
              الرئيسية
            </Link>
          </li>
          <li>
            <Link
              href="/bookings"
              className={pathname === "/bookings" ? "active" : ""}
            >
              الحجوزات
            </Link>
          </li>
          <li>
            <Link
              href="/contact"
              className={pathname === "/contact" ? "active" : ""}
            >
              اتصل بنا
            </Link>
          </li>
        </ul>
      </div>
      <div className="navbar-end">
        <Link href="/bookings" className="btn btn-primary">
          استعرض الحجوزات
        </Link>
      </div>
    </div>
  );
}
