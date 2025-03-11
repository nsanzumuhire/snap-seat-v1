import { motion } from "framer-motion";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import { Card } from "@/components/ui/card";

export default function Hero() {
  return (
    <section className="min-h-screen py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-orange-50 to-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 mb-6">
              Streamline Your Restaurant Operations with Snap Seat
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Digital ordering, table management, and reservations - all in one platform.
              Join hundreds of restaurants revolutionizing their guest experience.
            </p>
            
            <div className="flex gap-4 mb-8">
              <img
                src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4"
                alt="Modern restaurant interior"
                className="w-1/2 rounded-lg shadow-lg"
              />
              <img
                src="https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c"
                alt="Mobile ordering interface"
                className="w-1/2 rounded-lg shadow-lg"
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Card className="p-6">
              <h2 className="text-2xl font-semibold mb-6 text-center">Join the Waitlist</h2>
              <WaitlistForm />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
