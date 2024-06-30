import type { Metadata } from "next";
import { graphik } from "@/lib/fonts";
import { Toaster } from "@/components/ui/toaster";
import "./globals.css";

export const metadata: Metadata = {
  title: "Employee Management System",
  description:
    "This is the application for the Employee Management System who manages all the employees of the company.",
  icons: {
    icon: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={graphik.className}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
