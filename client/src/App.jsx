import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { SyncProvider } from './contexts/SyncContext.jsx';
import Login from './pages/Login.jsx';
import FarmerDashboard from './pages/farmer/Dashboard.jsx';
import ReportForm from './pages/farmer/ReportForm.jsx';
import Advisory from './pages/farmer/Advisory.jsx';
import VetDashboard from './pages/vet/Dashboard.jsx';
import CriticalAlerts from './pages/vet/CriticalAlerts.jsx';
import EmergingClusters from './pages/vet/EmergingClusters.jsx';
import ResponseQueue from './pages/vet/ResponseQueue.jsx';
import MapView from './pages/vet/MapView.jsx';
import VaccinationGap from './pages/vet/VaccinationGap.jsx';
import ZoonoticAlerts from './pages/vet/ZoonoticAlerts.jsx';
import LabStatus from './pages/vet/LabStatus.jsx';

function PrivateRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className='full-loading'>Loading...</div>;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (role && user?.role !== role) {
    return <Navigate to={user?.role === 'vet' ? '/vet' : '/farmer'} replace />;
  }
  return children;
}

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div className='full-loading'>Loading...</div>;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  return <Navigate to={user?.role === 'vet' ? '/vet' : '/farmer'} replace />;
}

function AppRoutes() {
  return (
    <Routes>
      <Route path='/' element={<RootRedirect />} />
      <Route path='/login' element={<Login />} />
      <Route path='/farmer' element={<PrivateRoute role='farmer'><FarmerDashboard /></PrivateRoute>} />
      <Route path='/farmer/report' element={<PrivateRoute role='farmer'><ReportForm /></PrivateRoute>} />
      <Route path='/farmer/advisory' element={<PrivateRoute role='farmer'><Advisory /></PrivateRoute>} />
      <Route path='/vet' element={<PrivateRoute role='vet'><VetDashboard /></PrivateRoute>} />
      <Route path='/vet/alerts' element={<PrivateRoute role='vet'><CriticalAlerts /></PrivateRoute>} />
      <Route path='/vet/clusters' element={<PrivateRoute role='vet'><EmergingClusters /></PrivateRoute>} />
      <Route path='/vet/queue' element={<PrivateRoute role='vet'><ResponseQueue /></PrivateRoute>} />
      <Route path='/vet/map' element={<PrivateRoute role='vet'><MapView /></PrivateRoute>} />
      <Route path='/vet/vaccination' element={<PrivateRoute role='vet'><VaccinationGap /></PrivateRoute>} />
      <Route path='/vet/zoonotic' element={<PrivateRoute role='vet'><ZoonoticAlerts /></PrivateRoute>} />
      <Route path='/vet/lab' element={<PrivateRoute role='vet'><LabStatus /></PrivateRoute>} />
      <Route path='*' element={<Navigate to='/' replace />} />
    </Routes>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SyncProvider>
          <AppRoutes />
        </SyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
