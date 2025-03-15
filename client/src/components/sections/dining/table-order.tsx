import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Link, useLocation } from "wouter";
import {
  MinusCircle,
  PlusCircle,
  Trash2,
  Clock,
  ShoppingBag,
  ChevronLeft,
  Receipt,
  Utensils,
  DollarSign
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

type TableOrderProps = {
  embedded?: boolean;
};

export default function TableOrder({ embedded = false }: TableOrderProps) {
  const { state, dispatch } = useTableOrder();
  const { toast } = useToast();
  const [, navigate] = useLocation();

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

  const handleCheckout = () => {
    navigate("/checkout");
  };

  const totalItems = state.items.reduce((sum, item) => sum + item.quantity, 0);

  if (embedded) {
    return (
      <Card className="bg-white shadow-sm border-gray-100">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="h-5 w-5 text-primary" />
              <h2 className="font-semibold text-lg">Your Order</h2>
            </div>
            {totalItems > 0 && (
              <Badge variant="secondary" className="rounded-full">
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </div>
        </CardHeader>

        <div className="px-4">
          <div className="space-y-2">
            <AnimatePresence>
              {state.items.map((item) => (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  className="group"
                >
                  <div className="flex items-center gap-3 py-2 border-b border-gray-100">
                    <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                      {item.imageUrl ? (
                        <img
                          src={item.imageUrl}
                          alt={item.name}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <Utensils className="h-4 w-4 text-gray-400" />
                      )}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-center">
                        <div className="min-w-0 pr-2 flex-1">
                          <h3 className="font-medium text-sm truncate">{item.name}</h3>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <span>${Number(item.price).toFixed(2)}</span>
                            {item.prepTime > 0 && (
                              <>
                                <span>•</span>
                                <Clock className="h-3 w-3" />
                                <span>{item.prepTime}m</span>
                              </>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center flex-shrink-0">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.id, -1)}
                          >
                            <MinusCircle className="h-3 w-3" />
                          </Button>
                          <span className="w-5 text-center text-xs font-medium">{item.quantity}</span>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0"
                            onClick={() => handleQuantityChange(item.id, 1)}
                          >
                            <PlusCircle className="h-3 w-3" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-6 w-6 p-0 text-red-500"
                            onClick={() => dispatch({ type: "REMOVE_ITEM", payload: item.id })}
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>

          {state.items.length > 0 ? (
            <div className="py-4 space-y-4">
              <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Subtotal</span>
                  <span>${state.total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Tax (10%)</span>
                  <span>${(state.total * 0.1).toFixed(2)}</span>
                </div>
                <Separator className="my-2" />
                <div className="flex justify-between font-medium">
                  <span>Total</span>
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-lg">{(state.total * 1.1).toFixed(2)}</span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-6 gap-2">
                <Button
                  size="sm"
                  className="col-span-4"
                  onClick={handleCheckout}
                >
                  <ShoppingBag className="mr-2 h-4 w-4" />
                  Checkout
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="col-span-2"
                  onClick={() => dispatch({ type: "CLEAR_ORDER" })}
                >
                  Clear
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <ShoppingBag className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-gray-500 mb-4">Your order is empty</p>
              <Button variant="outline" size="sm" asChild>
                <Link href="/menu">Browse Menu</Link>
              </Button>
            </div>
          )}
        </div>
      </Card>
    );
  } else {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          size="sm"
          className="rounded-full shadow-lg"
          onClick={handleCheckout}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />
          <span className="mr-1">Order</span>
          {totalItems > 0 && (
            <Badge variant="secondary" className="rounded-full">
              {totalItems}
            </Badge>
          )}
        </Button>
      </div>
    );
  }
}