import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/contexts/AuthContext";
import Header from "@/components/header";
import Footer from "@/components/footer";
import Home from "@/pages/home";
import Brand from "@/pages/brand";
import Brands from "@/pages/brands";
import Promotion from "@/pages/promotion";
import Promotions from "@/pages/promotions";
import Search from "@/pages/search";
import Admin from "@/pages/admin";
import AdminLogin from "@/pages/admin-login";
import NotFound from "@/pages/not-found";

function Router() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/marcas" component={Brands} />
          <Route path="/marcas/:slug" component={Brand} />
          <Route path="/promociones" component={Promotions} />
          <Route path="/promociones/:slug" component={Promotion} />
          <Route path="/promotion/:slug" component={Promotion} />
          <Route path="/buscar" component={Search} />
          <Route path="/admin" component={Admin} />
          <Route path="/admin/login" component={AdminLogin} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Footer />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
