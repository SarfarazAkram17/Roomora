import { Geist, Geist_Mono } from "next/font/google";
import "../../globals.css";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { ToastContainer } from "react-toastify";
import { AuthProvider } from "@/context/AuthContext";
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

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
        >
        <Providers>
          <AuthProvider>
          <ToastContainer />
          <Navbar />
          {children}
          <Footer />
        </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}