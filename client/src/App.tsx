import { Route, Switch } from 'wouter';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import SpaceDetails from "@/pages/SpaceDetails";
import MemoryDetails from "@/pages/MemoryDetails";
import NotFound from "@/pages/not-found";
import { AuthProvider } from '@/contexts/AuthContext';
import ProtectedRoute from "@/components/ProtectedRoute";
import Login from './pages/Login';

function Router() {
  return (
    <Switch>
      <Route path="/" component={Landing} />
      <Route path="/login" component={Login} />
      <Route path="/home">
        <ProtectedRoute>
          <Home />
        </ProtectedRoute>
      </Route>
      <Route path="/space/:id">
        <ProtectedRoute>
          <SpaceDetails />
        </ProtectedRoute>
      </Route>
      <Route path="/memory/:id">
        <ProtectedRoute>
          <MemoryDetails />
        </ProtectedRoute>
      </Route>
      {/* Catch all route for 404s */}
      <Route>
        <NotFound />
      </Route>
    </Switch>
  );
}

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <Router />
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  );
}

export default App;