import { motion } from "framer-motion";
import { WaitlistForm } from "@/components/ui/waitlist-form";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { Search, Star } from "lucide-react";

export default function Hero() {
  return (
    <section className="relative min-h-screen">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-orange-50 to-white pointer-events-none" />

      {/* Hero content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-20">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl sm:text-6xl font-bold tracking-tight text-gray-900 mb-6">
              Discover Your Next
              <br />
              <span className="text-primary">Perfect Meal</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              From fine dining to casual spots, find and book the perfect table with SnapSeat.
              Digital ordering, table management, and instant reservations at your fingertips.
            </p>

            <div className="flex gap-4 mb-12">
              <Button asChild size="lg" className="text-lg px-8">
                <Link href="/restaurants">Find a Table</Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="text-lg px-8">
                <Link href="/menu">Browse Menus</Link>
              </Button>
            </div>

            <div className="flex items-center gap-8">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="text-lg font-medium">4.8/5 rating</span>
              </div>
              <div className="text-lg">
                <span className="font-medium">500+</span> restaurants
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              <img
                src="https://images.unsplash.com/photo-1504674900247-0877df9cc836"
                alt="Elegant plated dish"
                className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300"
              />
              <img
                src="https://images.unsplash.com/photo-1559339352-11d035aa65de"
                alt="Restaurant interior"
                className="w-full rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300 mt-8"
              />
            </div>
          </motion.div>
        </div>
      </div>

      {/* Waitlist section */}
      <div className="relative bg-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join the Revolution in Restaurant Management
            </h2>
            <p className="text-xl text-gray-600">
              Be among the first to transform your restaurant with our digital solutions
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-md mx-auto"
          >
            <Card className="p-6">
              <WaitlistForm />
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}