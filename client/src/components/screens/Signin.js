import React, { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";
import { userContext } from "../../App";

export const Signin = () => {
  const { state, dispatch } = useContext(userContext);
  const navigate = useNavigate();
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const PostData = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828" });
      return;
    }
    fetch("/signin", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
        email,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828" });
        } else {
          localStorage.setItem("jwt", data.token);
          localStorage.setItem("user", JSON.stringify(data.user));
          dispatch({ type: "USER", payload: data.user });
          M.toast({ html: "Welcome!", classes: "#ce93d8" });
          navigate("/");
        }
      })
      .catch((err) => console.log(err));
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h3>Sign in</h3>
        <div className="row">
          <div className="input-field col s12">
            <input
              id="email"
              type="email"
              className="validate"
              value={email}
              onChange={(e) => {
                setemail(e.target.value);
              }}
            />
            <label for="email">Email</label>
          </div>
        </div>
        <div className="row">
          <div className="input-field col s12">
            <input
              id="password"
              type="password"
              className="validate"
              value={password}
              onChange={(e) => {
                setpassword(e.target.value);
              }}
            />
            <label for="password">Password</label>
          </div>
        </div>

        <button
          className="btn waves-effect waves-light  blue darken-4"
          type="submit"
          name="action"
          onClick={() => PostData()}
        >
          Login
          <i className="material-icons right">send</i>
        </button>
        <h6>
          <Link to="/signup">Don't have an account? Click here</Link>
        </h6>
      </div>
    </div>
  );
};
