import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaArrowUp, FaArrowDown } from "react-icons/fa6";
import { MdArrowDropDown } from "react-icons/md";
import { Button } from "@mui/material";

const Faq = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);

  const faqs = [
    {
      question: "How do I book a hotel room on Roomora?",
      answer:
        "Simply browse hotels, select your check-in and check-out dates, choose the number of rooms, and confirm your booking through the booking form.",
    },
    {
      question: "Is payment required at the time of booking?",
      answer: "No, payment is not required right the time of booking but after booking you have to pay to confirm your booking.",
    },
    {
      question: "What does “Price per Night” mean?",
      answer:
        "It refers to the cost of staying in one room for one night (from check-in to the following day at checkout time).",
    },
    {
      question: "Can I book multiple rooms at once?",
      answer:
        "Yes, as long as enough rooms are available, you can book as many rooms as you need in a single booking.",
    },
    {
      question: "Can I cancel my booking?",
      answer:
        "Yes, you can cancel your booking from 'My Bookings' if it’s not paid. Once paid it cannot be cancelled.",
    },
    {
      question: "When do rooms become available again?",
      answer: "Rooms become available for others to book once the booking status was completed.",
    },
    {
      question: "How do I know how many rooms are still available?",
      answer:
        "On each hotel’s details page, you’ll see the “Available Rooms” count.",
    },
    {
      question: "Do I need an account to make a booking?",
      answer:
        "Yes, you must create an account and be logged in so we can track your bookings and reservations.",
    },
    {
      question: "Can I update my profile details?",
      answer:
        "Absolutely! You can manage your name, and profile picture from your profile page at any time.",
    },
  ];
  const visibleFaqs = showAll ? faqs : faqs.slice(0, 5);

  return (
    <div className="max-w-[1500px] mx-auto px-4">
      <motion.h1
        className="mb-10 text-center text-[#F7602C] text-3xl md:text-4xl font-bold"
        initial={{ opacity: 0, y: -40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: false, amount: 0.3 }}
        transition={{ duration: 0.6 }}
      >
        Frequently Asked Questions
      </motion.h1>

      <div className="space-y-4">
        {visibleFaqs.map((faq, index) => {
          const isActive = activeIndex === index;
          return (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: false }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              onClick={() => setActiveIndex(isActive ? -1 : index)}
              className={`cursor-pointer rounded-xl border-2 p-4 shadow-sm ${
                isActive
                  ? "bg-[#9C27B0]/10 border-[#9C27B0] shadow-md"
                  : "bg-white border-gray-200"
              }`}
            >
              <div className="flex justify-between items-center">
                <h3 className="text-sm md:text-base font-bold text-[#9C27B0]/80">
                  {faq.question}
                </h3>
                <motion.span
                  className="text-[#F7602C]"
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <MdArrowDropDown size={25} />
                </motion.span>
              </div>

              {isActive && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 text-[#373636] text-sm leading-relaxed"
                >
                  <hr className="mb-3 border-t-2 border-[#9C27B0]/30" />
                  {faq.answer}
                </motion.div>
              )}
            </motion.div>
          );
        })}
      </div>

      <div className="text-center mt-8">
        <Button
          onClick={() => setShowAll(!showAll)}
          className="text-white rounded-lg"
          color="secondary"
          variant="contained"
        >
          {showAll ? (
            <span className="flex gap-2 items-center">
              Show Less <FaArrowUp size={15} />
            </span>
          ) : (
            <span className="flex gap-2 items-center">
              Show All <FaArrowDown size={15} />
            </span>
          )}
        </Button>
      </div>
    </div>
  );
};

export default Faq;