"use client";
import { motion } from "framer-motion";
import { Bed, CalendarCheck, ClipboardList } from "lucide-react";

const steps = [
  {
    id: 1,
    title: "Browse Hotels",
    description:
      "Explore hotels, compare amenities, and pick the one that suits your needs.",
    icon: <Bed className="w-10 h-10 text-[#F7602C]" />,
  },
  {
    id: 2,
    title: "Select Dates & Rooms",
    description:
      "Choose your check-in and check-out dates and the number of rooms you want to book.",
    icon: <CalendarCheck className="w-10 h-10 text-[#F7602C]" />,
  },
  {
    id: 3,
    title: "Confirm Booking",
    description:
      "Submit your booking request with your selected dates and rooms. Your reservation will be held until payment.",
    icon: <ClipboardList className="w-10 h-10 text-[#F7602C]" />,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="max-w-[1500px] px-4 mx-auto text-center">
        <h2 className="text-4xl font-bold mb-4 text-[#F7602C]">
          How Roomora Works
        </h2>
        <p className="text-gray-600 mb-12">
          Book your perfect stay in just a few simple steps.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <motion.div
              key={step.id}
              className="bg-white p-6 rounded-2xl shadow hover:shadow-lg transition"
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              viewport={{ once: true }}
            >
              <div className="flex justify-center mb-4">{step.icon}</div>
              <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-600 text-sm">{step.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;