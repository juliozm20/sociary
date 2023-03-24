import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { userContext } from "../App";

const Navbar = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(userContext);
  const renderList = () => {
    if (state) {
      return [
        <>
          <li>
            <Link to="/profile">Profile</Link>
          </li>
          <li>
            <Link to="/create">Create Post</Link>
          </li>
          <li>
            <Link to="/myfollowerspost">My Following Posts</Link>
          </li>
          <li>
            {/* <button
              className="btn waves-effect waves-light  blue darken-4"
              type="submit"
              name="action"
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                navigate("/signin");
              }}
            >
              Logout
              <i className="material-icons">send</i>
            </button> */}
            <Link
              onClick={() => {
                localStorage.clear();
                dispatch({ type: "CLEAR" });
                // navigate("/signin");
              }}
              to={"/signin"}
            >
              Logout
            </Link>
          </li>
        </>,
      ];
    } else {
      return [
        <>
          <li>
            <Link to="/signin">Sign in</Link>
          </li>
          <li>
            <Link to="/signup">Sign Up</Link>
          </li>
        </>,
      ];
    }
  };
  return (
    <nav>
      <div className="nav-wrapper">
        <Link to={state ? "/" : "/signin"} className="brand-logo">
          Sociary
        </Link>
        <ul id="nav-mobile" className="right hide-on-med-and-down">
          {renderList()}
        </ul>
      </div>
    </nav>
  );
};
export default Navbar;
