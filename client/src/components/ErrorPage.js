import React from "react";
import { Link } from "react-router-dom";

let ErrorPage = () => {
  return (
    <div>
      <Link to="/" className="btn btn-primary">
        Go To Home
      </Link>
      <h1>404 Error, Page Not Found</h1>
    </div>
  );
};

export default ErrorPage;
