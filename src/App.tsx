
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { InvoiceProvider } from "./contexts/InvoiceContext";
import Welcome from "./pages/Welcome";
import InvoiceForm from "./pages/InvoiceForm";
import TemplateSelection from "./pages/TemplateSelection";
import InvoicePreview from "./pages/InvoicePreview";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <InvoiceProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Welcome />} />
            <Route path="/criar-fatura" element={<InvoiceForm />} />
            <Route path="/escolher-modelo" element={<TemplateSelection />} />
            <Route path="/visualizar" element={<InvoicePreview />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </InvoiceProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
