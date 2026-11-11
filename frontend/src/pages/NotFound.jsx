import { Link } from 'react-router-dom';
import { EmptyState } from '../components/States.jsx';

export default function NotFound() {
  return (
    <div className="page">
      <div className="container">
        <EmptyState
          headingLevel={1}
          icon="compass-outline"
          title="Wrong turn"
          action={
            <Link to="/" className="btn btn--primary">
              Back to home
            </Link>
          }
        >
          The page you are looking for does not exist.
        </EmptyState>
      </div>
    </div>
  );
}
