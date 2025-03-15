import { useState } from "react";
import { motion } from "framer-motion";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import {
    ChevronLeft,
    CreditCard,
    Clock,
    Shield,
    DollarSign,
    ShoppingBag,
    MapPin,
    Phone
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Label } from "@/components/ui/label";

export default function Checkout() {
    const { state } = useTableOrder();
    const { toast } = useToast();
    const [, navigate] = useLocation();
    const [loading, setLoading] = useState(false);

    const handlePayment = async () => {
        setLoading(true);
        // Simulate payment processing
        await new Promise(resolve => setTimeout(resolve, 2000));

        toast({
            title: "Payment successful",
            description: "Your order has been confirmed",
        });

        setLoading(false);
        navigate("/confirmation");
    };

    const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
        >
            <div className="max-w-4xl mx-auto">
                <div className="mb-8">
                    <Button
                        variant="ghost"
                        className="mb-4"
                        onClick={() => navigate(-1)}
                    >
                        <ChevronLeft className="h-4 w-4 mr-2" />
                        Back
                    </Button>

                    <h1 className="text-3xl font-bold">Checkout</h1>
                    <p className="text-gray-600 mt-2">Complete your order</p>
                </div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Order Summary */}
                    <Card className="lg:col-span-2">
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <ShoppingBag className="h-5 w-5" />
                                Order Summary
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {state.items.map((item) => (
                                    <div key={item.id} className="flex items-center gap-4 py-2 border-b border-gray-100">
                                        <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                            <ShoppingBag className="h-6 w-6 text-gray-400" />
                                        </div>
                                        <div className="flex-1">
                                            <div className="flex justify-between">
                                                <div>
                                                    <h3 className="font-medium">{item.name}</h3>
                                                    <div className="flex items-center gap-2 text-sm text-gray-500">
                                                        <span>Qty: {item.quantity}</span>
                                                        {item.prepTime > 0 && (
                                                            <>
                                                                <span>•</span>
                                                                <Clock className="h-4 w-4" />
                                                                <span>{item.prepTime} mins</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                                <span className="font-medium">
                                                    ${(Number(item.price) * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>

                    {/* Payment Details */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <CreditCard className="h-5 w-5" />
                                Payment Details
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-4">
                                <div>
                                    <Label>Card Number</Label>
                                    <Input placeholder="1234 5678 9012 3456" />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <Label>Expiry Date</Label>
                                        <Input placeholder="MM/YY" />
                                    </div>
                                    <div>
                                        <Label>CVV</Label>
                                        <Input placeholder="123" />
                                    </div>
                                </div>
                            </div>

                            <Separator />

                            <div className="space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Subtotal</span>
                                    <span>${state.total.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Tax (10%)</span>
                                    <span>${(state.total * 0.1).toFixed(2)}</span>
                                </div>
                                <Separator />
                                <div className="flex justify-between font-medium">
                                    <span>Total</span>
                                    <div className="flex items-center gap-1">
                                        <DollarSign className="h-4 w-4" />
                                        <span className="text-lg">{(state.total * 1.1).toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>

                            <Button
                                className="w-full"
                                size="lg"
                                onClick={handlePayment}
                                disabled={loading}
                            >
                                {loading ? (
                                    "Processing..."
                                ) : (
                                    <>
                                        Pay ${(state.total * 1.1).toFixed(2)}
                                    </>
                                )}
                            </Button>

                            <div className="flex items-center gap-2 text-sm text-gray-500 justify-center">
                                <Shield className="h-4 w-4" />
                                <span>Secure payment processing</span>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </motion.div>
    );
} 