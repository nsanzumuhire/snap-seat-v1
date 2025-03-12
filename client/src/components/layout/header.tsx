import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { useTableOrder } from "@/lib/tableOrderContext";
import { Table } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import TableOrder from "@/components/sections/dining/table-order";

export default function Header() {
  const { state } = useTableOrder();
  const itemCount = state.items.length;

  return (
    <header className="border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Link href="/">
              <a className="text-2xl font-bold text-primary">SnapSeat</a>
            </Link>
          </div>

          <nav className="hidden md:flex space-x-8">
            <Link href="/restaurants">
              <a className="text-gray-600 hover:text-gray-900">Find Restaurants</a>
            </Link>
            <Link href="/menu">
              <a className="text-gray-600 hover:text-gray-900">Popular Menus</a>
            </Link>
            <Link href="/reviews">
              <a className="text-gray-600 hover:text-gray-900">Reviews</a>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            {itemCount > 0 && (
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="relative">
                    <Table className="h-5 w-5" />
                    <span className="absolute -top-2 -right-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                      {itemCount}
                    </span>
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Your Table Order</SheetTitle>
                  </SheetHeader>
                  <TableOrder />
                </SheetContent>
              </Sheet>
            )}
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}