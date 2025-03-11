import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function Header() {
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
            <Link href="/dining">
              <a className="text-gray-600 hover:text-gray-900">Dining</a>
            </Link>
            <Link href="/menu">
              <a className="text-gray-600 hover:text-gray-900">Menu</a>
            </Link>
            <Link href="/reviews">
              <a className="text-gray-600 hover:text-gray-900">Reviews</a>
            </Link>
          </nav>

          <div className="flex items-center space-x-4">
            <Button variant="outline">Sign In</Button>
            <Button>Get Started</Button>
          </div>
        </div>
      </div>
    </header>
  );
}