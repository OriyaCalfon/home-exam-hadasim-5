import { StrictMode } from 'react'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { createRoot } from 'react-dom/client'
import SupplierPage from './components/supplier/SupplierPage'
import ManagerPage from './components/manager/ManagerPage'
import RegisterForm from './components/supplier/RegisterForm'
import LoginForm from './components/supplier/LoginForm'
import OrderForm from './components/manager/OrderForm'
import ViewOrdersForManager from './components/manager/ViewOrdersForManager'
import ViewOrdersForSupplier from './components/supplier/ViewOrdersForSupplier'
import AppLayout from './ui/AppLayout'
import HomePage from './ui/HomePage'
import './index.css'


const routesArray = createBrowserRouter([
  {
    element: <AppLayout />,
    children: [
      {
        path: '/',
        element: <HomePage />,
        errorElement: <div>error page</div>
      },
      {
        path: '/supplier',
        element: <SupplierPage />,
        errorElement: <div>error page</div>
      },
      {
        path: '/manager',
        element: <ManagerPage />,
        errorElement: <div>error page</div>
      },
      {
        path: '/ViewOrdersForSupplier',
        element: <ViewOrdersForSupplier/>,
        errorElement: <div>error page</div>
      },
      {
        path: '/register',
        element: <RegisterForm />,
        errorElement: <div>error page</div>
      },
      {
        path: '/login',
        element: <LoginForm />,
        errorElement: <div>error page</div>
      },
      {
        path: '/orderForm',
        element: <OrderForm />,
        errorElement: <div>error page</div>
      },
      {
        path: '/viewOrdersForManager',
        element: <ViewOrdersForManager />,
        errorElement: <div>error page</div>
      }
    ]
  }
])



createRoot(document.getElementById('root')).render(
  <StrictMode>
    <RouterProvider router={routesArray} />
  </StrictMode>,
)
