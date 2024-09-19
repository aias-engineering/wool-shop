import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import App from './app/App.tsx'
import store from './lib/store.ts'
import './index.css'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import Admin from './admin/Admin.tsx'
import Products from './admin/features/products/Products.tsx'

const router = createBrowserRouter([
  { path: '/', element: <App></App> },
  { path: '/admin', element: <Admin></Admin> },
  { path: '/admin/product', element: <Products></Products> }
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router={router}>
      </RouterProvider>
    </Provider>
  </StrictMode>,
)
