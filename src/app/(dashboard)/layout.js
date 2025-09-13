import { Geist, Geist_Mono } from "next/font/google";
import { ToastContainer } from "react-toastify";
import "../../globals.css";
import { AuthProvider } from "@/context/AuthContext";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardNavbar from "@/components/DashbaordNavbar";
import Providers from "@/Providers";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "Roomora",
  description: "Roomora is a room booking platform.",
  icons: {
    icon: "/favicon.png",
  },
};

export default function DashboardLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased max-w-[1500px] mx-auto`}
      >
        <Providers>
          <AuthProvider>
            <ToastContainer />
            <div className="flex min-h-screen">
              <DashboardSidebar />
              <main className="flex-1 flex flex-col gap-4 p-4">
                <DashboardNavbar></DashboardNavbar>
                {children}
              </main>
            </div>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}