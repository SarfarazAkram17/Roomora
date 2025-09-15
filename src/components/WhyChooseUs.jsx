"use client";
import { motion } from "framer-motion";
import { ShieldCheck, Clock, Wallet, Hotel } from "lucide-react";

const reasons = [
  {
    id: 1,
    title: "Trusted & Secure",
    description:
      "We ensure reliable bookings with secure systems and transparent processes.",
    icon: <ShieldCheck className="w-10 h-10 text-[#F7602C]" />,
  },
  {
    id: 2,
    title: "Easy & Fast Booking",
    description:
      "Book your stay in just a few clicks with a simple, user-friendly experience.",
    icon: <Clock className="w-10 h-10 text-[#F7602C]" />,
  },
  {
    id: 3,
    title: "Best Value",
    description:
      "Enjoy competitive pricing and clear cost breakdowns with no hidden charges.",
    icon: <Wallet className="w-10 h-10 text-[#F7602C]" />,
  },
  {
    id: 4,
    title: "Wide Selection",
    description:
      "From luxury hotels to budget stays, find the perfect option for your needs.",
    icon: <Hotel className="w-10 h-10 text-[#F7602C]" />,
  },
];

const WhyChooseUs = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1500px] px-4 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-[#F7602C]">
          Why Choose Roomora
        </h2>
        <p className="text-gray-600 mb-12">
          We make hotel booking simple, secure, and stress-free.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {reasons.map((reason, index) => (
            <motion.div
              key={reason.id}
              className="bg-gray-50 p-6 rounded-2xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">{reason.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{reason.title}</h3>
              <p className="text-gray-600 text-sm">{reason.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyChooseUs;