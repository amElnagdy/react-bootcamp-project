import React from "react";
import { Link } from "react-router-dom";

const Header = (props) => (
  <header className="App-header">
    <ul className="container">
      <li key="home">
        <Link to="/">My Site</Link>
      </li>
      {props.isAuthinticated ? (
        <>
          <li>
            <Link to="/new/">New Post</Link>
          </li>
          <li>
            <button
              className="linkLike"
              onClick={(e) => {
                e.preventDefault();
                props.onLogout();
              }}
            >
              LogOut
            </button>
          </li>
        </>
      ) : (
        <li>
          <Link to="/login/">Login</Link>
        </li>
      )}
    </ul>
  </header>
);

export default Header;
