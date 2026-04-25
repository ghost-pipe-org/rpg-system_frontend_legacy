import { Routes, Route, useLocation } from 'react-router';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { PageTransition } from '../components/PageTransition';
import { routes } from './routes';

export function AppRouter() {
  const location = useLocation();

  return (
    <Routes location={location}>
      {routes.map((route) => {
        const Element = route.element;
        return (
          <Route
            key={route.path}
            path={route.path}
            element={
              route.requireAuth ? (
                <ProtectedRoute>
                  <PageTransition key={location.pathname}>
                    <Element />
                  </PageTransition>
                </ProtectedRoute>
              ) : (
                <PageTransition key={location.pathname}>
                  <Element />
                </PageTransition>
              )
            }
          />
        );
      })}
    </Routes>
  );
}
