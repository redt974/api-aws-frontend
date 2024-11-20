import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import VM from './VM';
import Inscription from './auth/inscription';
import Connexion from './auth/connexion';
import ReinitialisationMotDePasse from './auth/reinitialisation';
import MotDePasseOublie from './auth/motdepasse_oublie';
import { AuthProvider } from './auth/authContext';
import ProtectedRoute from './auth/protectedRoutes';
import ErrorBoundary from './Error/ErrorBoundary';
import Error from './Error/index';

const MainLayout = () => (
  <AuthProvider>
    <Outlet />
  </AuthProvider>
);

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element: <MainLayout />,
      errorElement: (
        <AuthProvider>
          <Error />
        </AuthProvider>
      ),
      children: [
        {
          path: '/',
          element: (
            <ProtectedRoute>
              <VM />
            </ProtectedRoute>
          ),
        },
        { path: '/signup', element: <Inscription /> },
        { path: '/signin', element: <Connexion /> },
        { path: '/forgot_mdp', element: <MotDePasseOublie /> },
        { path: '/reset_mdp', element: <ReinitialisationMotDePasse /> },
      ],
    },
  ]);

  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  );
}

export default App;
