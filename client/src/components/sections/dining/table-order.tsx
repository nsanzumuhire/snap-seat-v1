import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link } from "wouter";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  QrCode,
  Split,
  Table as TableIcon,
} from "lucide-react";

export default function TableOrder() {
  const { state, dispatch } = useTableOrder();
  const [showQR, setShowQR] = useState(false);
  const [splitCount, setSplitCount] = useState(1);

  const handleQuantityChange = (id: number, change: number) => {
    const item = state.items.find(i => i.id === id);
    if (!item) return;

    const newQuantity = item.quantity + change;
    if (newQuantity < 1) {
      dispatch({ type: "REMOVE_ITEM", payload: id });
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity: newQuantity }
      });
    }
  };

  const perPersonAmount = (state.total / splitCount).toFixed(2);

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button className="fixed bottom-4 right-4 z-50" size="lg">
          <TableIcon className="mr-2 h-5 w-5" />
          Table Order ({state.items.length})
        </Button>
      </SheetTrigger>
      <SheetContent className="w-[400px] sm:w-[540px]">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <TableIcon className="h-5 w-5" />
            Your Table Order
          </SheetTitle>
        </SheetHeader>

        <div className="mt-8">
          <div className="space-y-4">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                >
                  <Card>
                    <CardContent className="p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <h3 className="font-semibold">{item.name}</h3>
                          <p className="text-sm text-gray-600">
                            ${Number(item.price).toFixed(2)} each
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <MinusCircle className="h-4 w-4" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <PlusCircle className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="destructive"
                            size="icon"
                            onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {state.items.length > 0 && (
            <Card className="mt-8">
              <CardHeader>
                <div className="flex justify-between items-center">
                  <h3 className="font-semibold">Split Bill</h3>
                  <div className="flex items-center gap-2">
                    <Split className="h-5 w-5" />
                    <Input
                      type="number"
                      min="1"
                      max="20"
                      value={splitCount}
                      onChange={(e) => setSplitCount(Math.max(1, parseInt(e.target.value) || 1))}
                      className="w-20"
                    />
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Total</span>
                    <span className="font-semibold">
                      ${state.total.toFixed(2)}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Per Person</span>
                    <span>${perPersonAmount}</span>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex-col gap-4">
                <Button
                  className="w-full"
                  onClick={() => setShowQR(true)}
                >
                  <QrCode className="mr-2 h-5 w-5" />
                  Generate Payment QR
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => dispatch({ type: "CLEAR_ORDER" })}
                >
                  Clear Order
                </Button>
                <Button
                  asChild
                  variant="default"
                  className="w-full"
                >
                  <Link href="/restaurants/1/payment">
                    Proceed to Payment
                  </Link>
                </Button>
              </CardFooter>
            </Card>
          )}

          {state.items.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              Your table order is empty. Add items from the menu to get started.
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}