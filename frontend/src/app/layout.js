import localFont from "next/font/local";
import { Work_Sans } from '@next/font/google';
import "./globals.css";
import Navbar from "@/components/Navbar";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

// Importing a Google Font
const workSans = Work_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '700'],
  variable: "--font-work-sans",
});


export const metadata = {
  title: "Room Booking & Management System",
  description: "Room Booking & Management System",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${workSans.variable} antialiased`}>
        <Navbar />
        {children}
      </body>
    </html>
  );
}
