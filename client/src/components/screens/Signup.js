import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import M from "materialize-css";

export const Signup = () => {
  const navigate = useNavigate();
  const [name, setname] = useState("");
  const [email, setemail] = useState("");
  const [password, setpassword] = useState("");
  const [url, seturl] = useState(undefined);
  const [image, setImage] = useState("");

  useEffect(() => {
    if (url) {
      uploadFields();
    }
  }, [url]);

  const uploadPic = () => {
    const data = new FormData();
    data.append("file", image);
    data.append("upload_preset", "socialnetwork");
    data.append("cloud_name", "ddaxl3sag");
    fetch("https://api.cloudinary.com/v1_1/ddaxl3sag/image/upload", {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((data) => {
        seturl(data.url);
      })
      .catch((err) => console.log(err));
  };

  const uploadFields = () => {
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      M.toast({ html: "Invalid email", classes: "#c62828" });
      return;
    }
    fetch("/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        password: password,
        email: email,
        pic: url,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        if (data.error) {
          M.toast({ html: data.error, classes: "#c62828" });
        } else {
          M.toast({ html: data.message, classes: "#ce93d8" });
          navigate("/signin");
        }
      })
      .catch((err) => console.log(err));
  };

  const PostData = () => {
    if (image) {
      uploadPic();
    } else {
      uploadFields();
    }
  };

  return (
    <div className="mycard">
      <div className="card auth-card">
        <h3>Sign up</h3>
        <div className="row">
          <div className="input-field col s12">
            <input
              id="name"
              type="text"
              className="validate"
              value={name}
              onChange={(e) => {
                setname(e.target.value);
              }}
            />
            <label for="name">Username</label>
          </div>
        </div>
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
        <div class="file-field input-field">
          <div className="btn waves-effect waves-light  blue darken-4">
            <span>Upload Photo</span>
            <input
              type="file"
              onChange={(e) => {
                setImage(e.target.files[0]);
              }}
            />
          </div>
          <div className="file-path-wrapper">
            <input className="file-path validate" type="text" />
          </div>
        </div>

        <button
          className="btn waves-effect waves-light  blue darken-4"
          type="submit"
          name="action"
          onClick={() => PostData()}
        >
          Sign Up
          <i className="material-icons right">send</i>
        </button>
        <h6>
          <Link to="/signin">Already have an account?</Link>
        </h6>
      </div>
    </div>
  );
};
