import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { Provider } from 'react-redux'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import App from './App.tsx'
import store from './lib/store.ts'
import './index.css'
import CreateProducts from './features/create-product'

const router = createBrowserRouter([
  { path: '/', element: <App></App> },
  { path: '/createProduct', element: <CreateProducts></CreateProducts>}
])

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <RouterProvider router ={router}></RouterProvider>
    </Provider>
  </StrictMode>)
