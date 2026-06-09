import { Link } from 'react-router-dom';

function PageNotFound(): JSX.Element {
  return (
    <>
      <h1>Page not found ((</h1>
      <Link to="/">Go to main page</Link>
    </>
  );
}

export { PageNotFound };
