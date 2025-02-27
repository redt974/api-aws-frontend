import React from 'react';
import { createBrowserRouter, RouterProvider, Outlet } from 'react-router-dom';
import VM from './VM';
import Inscription from './auth/inscription';
import Connexion from './auth/connexion';
import ReinitialisationMotDePasse from './auth/reinitialisation';
import MotDePasseOublie from './auth/motdepasse_oublie';
import { AuthProvider } from './auth/authContext';
import ErrorBoundary from './Error/ErrorBoundary';
import Error from './Error/index';
import MiddlewareAuth from './auth/middleware';
import GoogleRedirect from './components/google/redirect';
import VmCreator from './Test';

// Layout principal qui inclut le middleware
const MainLayout = () => (
  <AuthProvider>
    <MiddlewareAuth />
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
          element: <VM />,
        },
        { path: '/signup', element: <Inscription /> },
        { path: '/signin', element: <Connexion /> },
        { path: '/forgot_mdp', element: <MotDePasseOublie /> },
        { path: '/reset_mdp', element: <ReinitialisationMotDePasse /> },
        { path: '/auth/google/redirect', element: <GoogleRedirect />},
        { path: '/test', element: <VmCreator />},
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
