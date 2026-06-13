import { Link } from 'react-router-dom';
import './page-not-found.css';

function PageNotFound(): JSX.Element {
  return (
    <>
      <h1 className="not-found page-title">404</h1>
      <p className="not-found page-subtitle">Page not found</p>
      <Link to="/"><p className="not-found page-link">Go to main page</p></Link>
    </>
  );
}

export { PageNotFound };
