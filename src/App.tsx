import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import AuthPage from './components/pages/AuthPage/AuthPage';
import DashboardPage from './components/pages/DashboardPage/DashboardPage';
import MainLayout from './components/pages/Layout/MainLayout';
import ProtectedRoute from './config/ProtectedRoute';

const router = createBrowserRouter([
  {
    path: '/',
    element: <AuthPage />,
  },
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <MainLayout />,
        children: [
          {
            path: '/dashboard',
            element: <DashboardPage />,
          },
        ],
      },
    ],
  },
]);

function App() {
  return <RouterProvider router={router} />;
}

export default App;