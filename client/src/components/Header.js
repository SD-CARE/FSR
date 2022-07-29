import React, { useContext } from "react";
import { Link } from "react-router-dom";
import { Context } from "../Context";

function Header() {
  // call the authenticated user data fro context
  const { authenticatedUser } = useContext(Context);

  return (
    <header>
      <div className="wrap header--flex">
        <Link to="/">
          <h3 className="header--logo">
            SD CARE<p className="header-fsr">FIELD SUPERVISION REPORT </p>
          </h3>
        </Link>
        <nav>
          <ul className="header--signedout">
            {authenticatedUser ? (
              <>
                <span>Hi, {authenticatedUser.firstName}!</span>
                <li>
                  <Link to="/signout">Sign Out</Link>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/signup">Sign Up</Link>
                </li>
                <li className="header--signedin">
                  <Link to="/signin">Sign In</Link>
                </li>
              </>
            )}
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
