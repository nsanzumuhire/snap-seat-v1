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
  Minus,
  Plus
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import Separator from "@/components/ui/separator";

type TableOrderProps = {
  embedded?: boolean;
};

export default function TableOrder({ embedded = false }: TableOrderProps) {
  const { state, dispatch } = useTableOrder();
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
    toast({
      title: "Order submitted",
      description: "Your order has been sent to the kitchen",
    });
  };

  if (embedded) {
    return (
      <div className="bg-white">
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 md:ml-4"> {/* Right Column - Table Order */}

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
            {state.items.length > 0 ? (
              <div className="mt-6 space-y-4">
                <Card className="mt-1">
                  <CardContent className="p-2">
                    <div className="space-y-1">
                      <div className="flex justify-between text-xs">
                        <span>Total</span>
                        <span>${state.total.toFixed(2)}</span>
                      </div>
                      <div className="flex justify-between text-xs text-gray-500">
                        <span>Tax (10%)</span>
                        <span>${(state.total * 0.1).toFixed(2)}</span>
                      </div>
                      <Separator className="my-0.5" />
                      <div className="flex justify-between text-xs font-semibold">
                        <span>Order Total</span>
                        <span>${(state.total * 1.1).toFixed(2)}</span>
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="px-2 py-1.5 flex gap-1">
                    <Button
                      size="sm"
                      className="w-full text-xs py-0 h-6"
                      onClick={handleSubmitOrder}
                      disabled={state.items.length === 0}
                    >
                      <Send className="mr-1 h-3 w-3" />
                      Submit
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="w-full text-xs py-0 h-6"
                      onClick={() => dispatch({ type: "CLEAR_ORDER" })}
                    >
                      Clear
                    </Button>
                  </CardFooter>
                </Card>

              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Your table order is empty. Add items from the menu to get started.
              </div>
            )}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex flex-col h-full">

        {/* Order Items */}
        <div className="space-y-4">
          <AnimatePresence>
            {state.items.length > 0 ? (
              <div className="space-y-4">
                <div className="max-h-[400px] overflow-y-auto">
                  <table className="w-full text-sm">
                    <tbody>
                      {state.items.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-1.5">
                            <div className="font-medium text-xs">{item.name}</div>
                            <div className="text-xs text-muted-foreground">${typeof item.price === 'number' ? item.price.toFixed(2) : parseFloat(item.price).toFixed(2)}</div>
                          </td>
                          <td className="text-right whitespace-nowrap">
                            <div className="flex items-center justify-end gap-1">
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5"
                                onClick={() => handleQuantityChange(item.id, -1)}
                              >
                                <Minus className="h-2.5 w-2.5" />
                              </Button>
                              <span className="w-3 text-center text-xs">{item.quantity}</span>
                              <Button
                                size="icon"
                                variant="ghost"
                                className="h-5 w-5"
                                onClick={() => handleQuantityChange(item.id, 1)}
                              >
                                <Plus className="h-2.5 w-2.5" />
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Your table order is empty. Add items from the menu to get started.
              </div>
            )}
          </AnimatePresence>
        </div>
        {state.items.length > 0 ? (
          <Card className="mt-1">
            <CardContent className="p-2">
              <div className="space-y-1">
                <div className="flex justify-between text-xs">
                  <span>Total</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs text-gray-500">
                  <span>Tax (10%)</span>
                  <span>${(state.total * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-0.5" />
                <div className="flex justify-between text-xs font-semibold">
                  <span>Order Total</span>
                  <span>${(state.total * 1.1).toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="px-2 py-1.5 flex gap-1">
              <Button
                size="sm"
                className="w-full text-xs py-0 h-6"
                onClick={handleSubmitOrder}
                disabled={state.items.length === 0}
              >
                <Send className="mr-1 h-3 w-3" />
                Submit
              </Button>
              <Button
                size="sm"
                variant="outline"
                className="w-full text-xs py-0 h-6"
                onClick={() => dispatch({ type: "CLEAR_ORDER" })}
              >
                Clear
              </Button>
            </CardFooter>
          </Card>
        ) : (
          <div className="text-center py-8 text-gray-500">
            Your table order is empty. Add items from the menu to get started.
          </div>
        )}
      </div>
    );
  }
}