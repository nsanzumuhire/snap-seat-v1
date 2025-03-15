import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { CheckCircle, ChevronLeft, Home } from "lucide-react";

export default function Confirmation() {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen flex items-center justify-center bg-gray-50 px-4"
        >
            <div className="max-w-md w-full text-center">
                <div className="mb-8">
                    <div className="flex justify-center mb-6">
                        <div className="h-24 w-24 rounded-full bg-green-100 flex items-center justify-center">
                            <CheckCircle className="h-12 w-12 text-green-600" />
                        </div>
                    </div>

                    <h1 className="text-3xl font-bold mb-2">Order Confirmed!</h1>
                    <p className="text-gray-600">
                        Thank you for your order. We'll start preparing your food right away.
                    </p>
                </div>

                <div className="space-y-4">
                    <Button asChild className="w-full">
                        <Link href="/restaurants">
                            <Home className="mr-2 h-4 w-4" />
                            Return to Home
                        </Link>
                    </Button>

                    <Button variant="outline" asChild className="w-full">
                        <Link href="/orders">
                            <ChevronLeft className="mr-2 h-4 w-4" />
                            View Orders
                        </Link>
                    </Button>
                </div>
            </div>
        </motion.div>
    );
} 