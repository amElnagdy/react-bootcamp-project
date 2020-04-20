import React from "react";
import { Link } from "react-router-dom";

const NotFound = (props) => {
  return (
    <article className="not-found container">
      <h1>404!</h1>
      <p>Content Not Found!</p>
      <Link to="/">Return to Home</Link>
    </article>
  );
};

export default NotFound;
