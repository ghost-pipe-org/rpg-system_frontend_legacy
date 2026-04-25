import { BrowserRouter as Router } from 'react-router';
import { AuthProvider } from './context/AuthContext';
import { AppRouter } from './routes';
import { DocumentTitle } from './components/DocumentTitle';
import { Toaster } from "@/components/ui/sonner";
function App() {
  return (
    <AuthProvider>
      <Router>
        <DocumentTitle />
        <Toaster className="text-foreground" />
        <AppRouter />
      </Router>
    </AuthProvider>
  );
}

export default App