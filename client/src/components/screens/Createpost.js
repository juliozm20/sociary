import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import M from "materialize-css";

export const Createpost = () => {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [image, setimage] = useState("");
  const [url, seturl] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (url) {
      fetch("/createpost", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + localStorage.getItem("jwt"),
        },
        body: JSON.stringify({
          title,
          body,
          pic: url,
        }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (data.error) {
            M.toast({ html: data.error, classes: "#c62828" });
          } else {
            M.toast({ html: "Posted successfully!", classes: "#ce93d8" });
            navigate("/");
          }
        })
        .catch((err) => console.log(err));
    }
  }, [body, navigate, title, url]);

  const postDetails = () => {
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

  return (
    <div
      className="card input-filed"
      style={{
        margin: "10px auto",
        maxWidth: "500px",
        padding: "20px",
        textAlign: "center",
      }}
    >
      <div className="row">
        <div className="input-field col s12">
          <input
            id="title"
            type="text"
            className="validate"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <label for="title">Title</label>
        </div>
      </div>
      <div className="row">
        <div className="input-field col s12">
          <input
            id="description"
            type="text"
            className="validate"
            value={body}
            onChange={(e) => setBody(e.target.value)}
          />
          <label for="description">Description</label>
        </div>
      </div>
      <div class="file-field input-field">
        <div className="btn waves-effect waves-light  blue darken-4">
          <span>Upload Photo</span>
          <input
            type="file"
            onChange={(e) => {
              setimage(e.target.files[0]);
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
        onClick={() => postDetails()}
      >
        Post
      </button>
    </div>
  );
};
