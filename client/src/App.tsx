import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TableOrderProvider } from "@/lib/tableOrderContext";
import NotFound from "@/pages/not-found";
import Home from "@/pages/home";
import Restaurants from "@/pages/restaurants";
import Menu from "@/pages/menu";
import Book from "@/pages/book";
import Reviews from "@/pages/reviews";
import Dining from "@/pages/dining";
import Payment from "@/pages/payment";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/restaurants" component={Restaurants} />
      <Route path="/restaurants/:id/menu" component={Dining} />
      <Route path="/restaurants/:id/book" component={Book} />
      <Route path="/restaurants/:id/payment" component={Payment} />
      <Route path="/menu" component={Menu} />
      <Route path="/reviews" component={Reviews} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TableOrderProvider>
        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-grow">
            <Router />
          </main>
          <Footer />
        </div>
        <Toaster />
      </TableOrderProvider>
    </QueryClientProvider>
  );
}

export default App;