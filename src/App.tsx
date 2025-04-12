
import { ThemeProvider } from "@/components/ThemeProvider";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import Layout from "./components/Layout";
import Index from "./pages/Index";
import ChatbotPage from "./pages/ChatbotPage";
import DoctorsPage from "./pages/DoctorsPage";
import SymptomIdentifierPage from "./pages/SymptomIdentifierPage";
import MedicineTimetablePage from "./pages/MedicineTimetablePage";
import BloodTestPage from "./pages/BloodTestPage";
import XRayAnalysisPage from "./pages/XRayAnalysisPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <ThemeProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Layout>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/chatbot" element={<ChatbotPage />} />
              <Route path="/doctors" element={<DoctorsPage />} />
              <Route path="/symptom-identifier" element={<SymptomIdentifierPage />} />
              <Route path="/medicine-timetable" element={<MedicineTimetablePage />} />
              <Route path="/blood-test" element={<BloodTestPage />} />
              <Route path="/xray-analysis" element={<XRayAnalysisPage />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Layout>
        </BrowserRouter>
      </TooltipProvider>
    </ThemeProvider>
  </QueryClientProvider>
);

export default App;
