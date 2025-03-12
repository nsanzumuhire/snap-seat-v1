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
  Send,
  Clock,
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function TableOrder() {
  const { state, dispatch } = useTableOrder();
  const [tableNumber, setTableNumber] = useState("");
  const { toast } = useToast();

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

  const handleSubmitOrder = () => {
    if (!tableNumber) {
      toast({
        title: "Table number required",
        description: "Please enter your table number to proceed",
        variant: "destructive"
      });
      return;
    }

    dispatch({ type: "SET_TABLE", payload: tableNumber });
    toast({
      title: "Order submitted",
      description: "Your order has been sent to the kitchen",
    });
  };

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        {/* Table Number Input */}
        <div className="mb-6">
          <Input
            type="text"
            placeholder="Enter your table number"
            value={tableNumber}
            onChange={(e) => setTableNumber(e.target.value)}
            className="w-full"
          />
        </div>

        {/* Order Items */}
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
                        <div className="flex items-center gap-2 text-sm text-gray-500 mt-1">
                          <Clock className="h-4 w-4" />
                          <span>{item.prepTime} mins prep time</span>
                        </div>
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
      </div>

      {state.items.length > 0 ? (
        <div className="mt-6 space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="text-sm text-gray-500">
                  {state.items.reduce((total, item) => total + item.quantity, 0)} items
                </div>
              </div>
            </CardContent>
          </Card>

          <div className="grid gap-4">
            <Button
              className="w-full"
              onClick={handleSubmitOrder}
              disabled={!tableNumber}
            >
              <Send className="mr-2 h-4 w-4" />
              Submit Order
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
          </div>
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Your table order is empty. Add items from the menu to get started.
        </div>
      )}
    </div>
  );
}