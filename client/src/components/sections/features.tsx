import { motion } from "framer-motion";
import { 
  CreditCard, 
  CalendarDays, 
  Smartphone, 
  ChefHat,
  Clock,
  BarChart
} from "lucide-react";

const features = [
  {
    icon: <Smartphone className="h-6 w-6" />,
    title: "Digital Menu & Ordering",
    description: "QR code-based digital menus and seamless mobile ordering experience"
  },
  {
    icon: <CalendarDays className="h-6 w-6" />,
    title: "Table Reservations",
    description: "Smart booking system with automated confirmation and reminders"
  },
  {
    icon: <CreditCard className="h-6 w-6" />,
    title: "Integrated Payments",
    description: "Secure payment processing with multiple payment options"
  },
  {
    icon: <ChefHat className="h-6 w-6" />,
    title: "Kitchen Management",
    description: "Real-time order tracking and kitchen display system"
  },
  {
    icon: <Clock className="h-6 w-6" />,
    title: "Wait Time Management",
    description: "Accurate wait time predictions and virtual queue management"
  },
  {
    icon: <BarChart className="h-6 w-6" />,
    title: "Analytics & Insights",
    description: "Detailed reporting on sales, popular items, and customer behavior"
  }
];

export default function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Run Your Restaurant
          </h2>
          <p className="text-xl text-gray-600">
            Powerful features designed specifically for modern restaurants
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-orange-50 rounded-lg p-6"
            >
              <div className="bg-primary/10 rounded-full w-12 h-12 flex items-center justify-center mb-4">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
