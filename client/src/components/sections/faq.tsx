import { motion } from "framer-motion";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "How much does Snap Seat cost?",
    answer: "We offer flexible pricing based on your restaurant's size and needs. Get in touch for a custom quote."
  },
  {
    question: "Do I need special hardware?",
    answer: "No special hardware required! Snap Seat works on any device with a web browser. We can recommend optional hardware for optimal experience."
  },
  {
    question: "How long does it take to get started?",
    answer: "Most restaurants are up and running within 48 hours of signing up. Our team helps with the entire setup process."
  },
  {
    question: "Can I integrate with my existing POS?",
    answer: "Yes! Snap Seat integrates with most major POS systems. We'll help you set up the integration during onboarding."
  },
  {
    question: "What support do you provide?",
    answer: "We offer 24/7 customer support via phone, email, and chat. You'll also get a dedicated account manager."
  }
];

export default function FAQ() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Frequently Asked Questions
          </h2>
          <p className="text-xl text-gray-600">
            Everything you need to know about Snap Seat
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
        >
          <Accordion type="single" collapsible className="w-full">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger className="text-left">
                  {faq.question}
                </AccordionTrigger>
                <AccordionContent>
                  {faq.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
