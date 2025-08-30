import './styles/motion.css';
import './index.css';
import React, { Suspense, lazy } from 'react';
import { createRoot } from 'react-dom/client';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import App from './modules/App';
import ErrorBoundary from './components/ErrorBoundary';
const Prices = lazy(()=> import('./modules/pages/Prices'));
const Appointment = lazy(()=> import('./modules/pages/Appointment'));
const Admin = lazy(()=> import('./modules/admin/Admin'));
const UploadPage = lazy(()=> import('./modules/upload/UploadPage').then(m=>({ default: m.UploadPage })));

const router = createBrowserRouter([
  { path: '/', element: <App /> },
  { path: '/prices', element: <Prices /> },
  { path: '/appointment', element: <Appointment /> },
  { path: '/upload', element: <UploadPage /> },
  { path: '/admin/*', element: <Admin /> },
]);

createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ErrorBoundary>
      <Suspense fallback={<div className='p-6'>Loading…</div>}>
        <RouterProvider router={router} />
      </Suspense>
    </ErrorBoundary>
  </React.StrictMode>
);
