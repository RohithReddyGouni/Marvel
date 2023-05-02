import { Link } from "react-router-dom";

const PageNotFound = () => {
  return (
    <div>
      <Link to="/" className="btn btn-primary">
        Go To Home
      </Link>
      <h1>Page not found</h1>
    </div>
  );
};

export default PageNotFound;
