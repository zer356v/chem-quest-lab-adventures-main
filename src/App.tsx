
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/hooks/useAuth";
import ProtectedRoute from "@/components/ProtectedRoute";
import MyLessons from "./pages/MyLessons";
import ProfilePage from "./pages/Profile";
import { lazy } from "react";


const Index= lazy(() => import('./pages/Index'));
const Auth= lazy(() => import('./pages/Auth'));
const ScienceLab= lazy(() => import('./pages/ScienceLab'));
const NotFound= lazy(() => import('./pages/NotFound'));
const PeriodicTable= lazy(() => import('./pages/PeriodicTable'));


export const preloadIndex= () => import('./pages/Index');
export const preloadAuth= () => import('./pages/Auth');
export const preloadScienceLab= () => import('./pages/ScienceLab');
export const preloadNotFound= () => import('./pages/NotFound');
export const preloadPeriodicTable= () => import('./pages/PeriodicTable');

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/auth" element={<Auth />} />
            <Route 
              path="/lab" 
              element={
                <ProtectedRoute>
                  <ScienceLab />
                </ProtectedRoute>
              }
               
            />
            <Route path="/lessons"
            element={
              <ProtectedRoute>
                  <MyLessons />
                </ProtectedRoute>
            }
            />
            <Route 
              path="/periodic-table" 
              element={
                <PeriodicTable />
              }
            />
            <Route path="/profile" 
              element={
                <ProtectedRoute>
                  <ProfilePage />
                </ProtectedRoute>
              } 
            />
            {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;
