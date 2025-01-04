import { Routes, Route } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Invoices from '../pages/Invoices';
import Upload from '../pages/Upload';

export function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Dashboard />} />
      <Route path="/invoices" element={<Invoices />} />
      <Route path="/upload" element={<Upload />} />
    </Routes>
  );
} 