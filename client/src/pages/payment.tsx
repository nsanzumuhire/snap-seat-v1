import { useState } from "react";
import { motion } from "framer-motion";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Card, CardContent, CardHeader, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { QrCode, Split, Share2, Copy } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function Payment() {
  const { state } = useTableOrder();
  const [splitCount, setSplitCount] = useState(1);
  const [showQR, setShowQR] = useState(false);
  const { toast } = useToast();
  
  const perPersonAmount = (state.total / splitCount).toFixed(2);

  const handleShareBill = () => {
    // Mock share functionality
    toast({
      title: "Share Link Generated",
      description: "Payment link has been copied to clipboard",
    });
  };

  const handleGenerateQR = () => {
    setShowQR(true);
    toast({
      title: "QR Code Generated",
      description: "Scan to pay your portion of the bill",
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 bg-gray-50"
    >
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h1 className="text-3xl font-bold mb-8">Payment Details</h1>
          
          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Order Summary</h2>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {state.items.map((item) => (
                  <div key={item.id} className="flex justify-between">
                    <span>{item.name} × {item.quantity}</span>
                    <span>${(Number(item.price) * item.quantity).toFixed(2)}</span>
                  </div>
                ))}
                <div className="pt-4 border-t">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>${state.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="mb-8">
            <CardHeader>
              <h2 className="text-xl font-semibold">Split Bill</h2>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-4 mb-6">
                <Split className="h-5 w-5 text-gray-500" />
                <div className="flex-1">
                  <label className="block text-sm font-medium mb-2">
                    Number of people
                  </label>
                  <Input
                    type="number"
                    min="1"
                    max="20"
                    value={splitCount}
                    onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                  />
                </div>
              </div>
              
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between text-sm mb-2">
                  <span>Amount per person</span>
                  <span className="font-semibold">${perPersonAmount}</span>
                </div>
                <div className="text-xs text-gray-500">
                  Split equally among {splitCount} {splitCount === 1 ? 'person' : 'people'}
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="grid gap-4">
                <Button
                  onClick={handleGenerateQR}
                  className="w-full"
                  size="lg"
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Generate Payment QR
                </Button>

                <Button
                  onClick={handleShareBill}
                  variant="outline"
                  className="w-full"
                  size="lg"
                >
                  <Share2 className="mr-2 h-5 w-5" />
                  Share Bill
                </Button>
              </div>

              {showQR && (
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="mt-8 p-8 border rounded-lg flex flex-col items-center"
                >
                  <div className="w-48 h-48 bg-gray-100 rounded-lg flex items-center justify-center">
                    <QrCode className="w-32 h-32 text-gray-400" />
                  </div>
                  <p className="mt-4 text-sm text-gray-600">
                    Scan to pay ${perPersonAmount}
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2"
                    onClick={() => {
                      toast({
                        title: "Payment Link Copied",
                        description: "Share this link with others to split the bill",
                      });
                    }}
                  >
                    <Copy className="mr-2 h-4 w-4" />
                    Copy Payment Link
                  </Button>
                </motion.div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </motion.div>
  );
}
