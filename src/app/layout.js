import { Geist } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const metadata = {
  title: "APRA | Association for Ponnappa Nadar Nagar Residents Amenity, Nagercoil",
  description: "Official portal for Association for Ponnappa Nadar Nagar Residents Amenity (Regd. No. 25/2023), Nagercoil - 629 004.",
  icons: {
    icon: [
      { url: "/images/logo.jpg" },
      { url: "/favicon.ico" }
    ],
    shortcut: ["/images/logo.jpg"],
    apple: [
      { url: "/images/logo.jpg" }
    ],
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      data-scroll-behavior="smooth"
      className={`${geistSans.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
