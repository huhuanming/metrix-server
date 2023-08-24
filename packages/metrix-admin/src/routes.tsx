import { Button, Result } from "antd";
import { Navigate } from 'react-router-dom';
import { Dashboard } from "./pages/Dashboard";
import { Layout } from "./components/Layout";
import { UploadPassword } from "./pages/UploadPassword";

export const routes = [
    {
      path: '/',
      element: <Layout />,
    //   errorElement: <ErrorPage />,
      children: [
        {
          path: '/',
          element: <Navigate to="dashboard" />,
        },
        {
          path: 'dashboard',
          element: <Dashboard />,
        },
        {
          path: 'upload-password',
          element: <UploadPassword />,
        },
        {
          path: '/*',
          element: (
              <Result
                status="404"
                title="404"
                subTitle="Sorry, the page you visited does not exist."
                extra={
                    <Button type="primary" href="/">Back Home</Button>
                }
              />
          ),
        },
      ],
    },
    // {
    //   path: '/login',
    //   element: <Login />,
    // },
  ];