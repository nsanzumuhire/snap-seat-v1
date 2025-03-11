import { motion } from "framer-motion";
import Hero from "@/components/sections/hero";
import Features from "@/components/sections/features";
import HowItWorks from "@/components/sections/how-it-works";
import FAQ from "@/components/sections/faq";

export default function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <main className="min-h-screen">
        <Hero />
        <Features />
        <HowItWorks />
        <FAQ />
      </main>
    </motion.div>
  );
}
