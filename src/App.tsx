import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster } from './components/ui/sonner';
import { BuyerLayout } from './components/layout/BuyerLayout';
import { ProtectedRoute } from './components/layout/ProtectedRoute';
import { AuthPage } from './features/auth/pages/AuthPage';
import { RegisterPage } from './features/auth/pages/RegisterPage';
import { LandingPage } from './pages/LandingPage';
import { DashboardPage } from './features/dashboard/DashboardPage';
import { DemandesListPage } from './features/demandes/DemandesListPage';
import { CreateDemandePage } from './features/demandes/CreateDemandePage';
import { DemandeDetailPage } from './features/demandes/DemandeDetailPage';

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Toaster position="top-right" richColors closeButton />
      <BrowserRouter>
        <Routes>
          <Route path="/login"    element={<AuthPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedRoute />}>
            <Route element={<BuyerLayout />}>
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/demandes" element={<DemandesListPage />} />
              <Route path="/demandes/new" element={<CreateDemandePage />} />
              <Route path="/demandes/:id" element={<DemandeDetailPage />} />
            </Route>
          </Route>
          <Route path="/" element={<LandingPage />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </QueryClientProvider>
  );
}
