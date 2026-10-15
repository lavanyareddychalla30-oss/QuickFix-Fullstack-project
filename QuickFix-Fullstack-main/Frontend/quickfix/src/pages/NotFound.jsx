import { Link } from 'react-router-dom';
export default function NotFound() {
  return (
    <div className="card soon">
      <h1 style={{ fontSize: 40, color: 'var(--color-primary)' }}>404</h1>
      <p style={{ margin: '8px 0 16px', color: 'var(--color-text-secondary)' }}>That page doesn't exist or your role can't open it.</p>
      <Link to="/dashboard" className="btn btn-primary">Back to dashboard</Link>
    </div>
  );
}
