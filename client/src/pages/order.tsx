import { motion } from "framer-motion";

export default function Order() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Place Your Order</h1>
        <p className="text-xl text-gray-600 mb-8">
          Order ahead and skip the wait
        </p>
        
        {/* Placeholder for ordering system */}
        <div className="p-6 bg-white rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
          <p className="text-gray-600">
            Our ordering system is under development. Check back soon!
          </p>
        </div>
      </div>
    </motion.div>
  );
}
