import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../lib/context.js';
import { Spinner } from './States.jsx';

export default function RequireAuth({ children }) {
  const { user, ready } = useAuth();
  const location = useLocation();
  if (!ready) {
    return (
      <div className="page page--center">
        <Spinner label="Checking your session" />
      </div>
    );
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location }} />;
  return children;
}
