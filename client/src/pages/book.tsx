import { motion } from "framer-motion";
import { Card } from "@/components/ui/card";
import BookingSection from "@/components/sections/dining/booking-section";

export default function Book() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Make a Reservation</h1>
        <Card className="p-6">
          <BookingSection />
        </Card>
      </div>
    </motion.div>
  );
}
