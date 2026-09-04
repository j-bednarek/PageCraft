import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

export default function ProtectedRoute({ children }) {
    const { user, isAuthLoading } = useAuth();

    if (isAuthLoading) return null;

    if (!user) return <Navigate to="/" replace />;

    return children;
}
