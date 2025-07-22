import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/login';
import Dashboard from './pages/dashboard';

export default function AppRoute() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  );
}
