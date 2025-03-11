import { motion } from "framer-motion";

export default function Menu() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="py-12 px-4 sm:px-6 lg:px-8"
    >
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold mb-8">Our Menu</h1>
        <p className="text-xl text-gray-600 mb-8">
          Browse our digital menu and explore our delicious offerings
        </p>
        
        {/* Placeholder for menu items */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-6 bg-white rounded-lg shadow">
            <h3 className="text-lg font-semibold mb-2">Coming Soon</h3>
            <p className="text-gray-600">
              Our menu system is under development. Check back soon!
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
