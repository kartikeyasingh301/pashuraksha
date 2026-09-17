import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext.jsx';
import { SyncProvider } from './contexts/SyncContext.jsx';
import Login from './pages/Login.jsx';
import FarmerApp from './pages/farmer/FarmerApp.jsx';
import VetApp from './pages/vet/VetApp.jsx';
import ParaVetDashboard from './pages/paravet/ParaVetDashboard.jsx';
import GovtCommandCenter from './pages/govt/GovtCommandCenter.jsx';

function PrivateRoute({ children, role }) {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontSize:"14px",color:"#888"}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  if (role && user?.role !== role) return <Navigate to={user?.role === 'vet' ? '/vet' : '/farmer'} replace />;
  return children;
}

function RootRedirect() {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) return <div style={{display:"flex",alignItems:"center",justifyContent:"center",height:"100vh",fontSize:"14px",color:"#888"}}>Loading...</div>;
  if (!isAuthenticated) return <Navigate to='/login' replace />;
  return <Navigate to={user?.role === 'vet' ? '/vet' : '/farmer'} replace />;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <SyncProvider>
          <Routes>
            <Route path='/' element={<RootRedirect />} />
            <Route path='/login' element={<Login />} />
            <Route path='/farmer/*' element={<PrivateRoute role='farmer'><FarmerApp /></PrivateRoute>} />
            <Route path='/vet/*' element={<PrivateRoute role='vet'><VetApp /></PrivateRoute>} />
            <Route path='/paravet/*' element={<ParaVetDashboard />} />
            <Route path='/govt/*' element={<GovtCommandCenter />} />
            <Route path='*' element={<Navigate to='/' replace />} />
          </Routes>
        </SyncProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
