import React, { useContext, useEffect, useState } from "react";
import { userContext } from "../../App";
import { useParams } from "react-router-dom";

export const UserProfile = () => {
  const [Prof, setProf] = useState({});
  const [userfollower, setFollower] = useState([]);
  const { state, dispatch } = useContext(userContext);
  const [Profile, setProfile] = useState();
  const [userProfile, setUserProfile] = useState("");
  const [userEmail, setUserEmail] = useState("");
  const { userid } = useParams();
  const [posts, setposts] = useState([]);
  const [showFollow, setShowFollow] = useState(
    state ? !state.following.includes(userid) : true
  );
  const [userPic, setUserpic] = useState("");

  useEffect(() => {
    fetch(`/user/${userid}`, {
      headers: {
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
    })
      .then((res) => res.json())
      .then((result) => {
        setUserProfile(result.user.name);
        setUserEmail(result.user.email);
        setProfile(result.posts.length);
        setposts(result.posts);
        setProf(result);
        setFollower(result.user.follower);
        setUserpic(result.user.pic);
      });
  }, []);

  const followUser = () => {
    fetch("/follow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProf((prevState) => {
          // console.log(setProf);
          console.log(Prof.user);
          return {
            user: {
              ...prevState.user,
              followers: [...prevState.user.followers, data._id],
            },
          };
        });
        setShowFollow(false);
      });
  };

  const unfollowUser = () => {
    fetch("/unfollow", {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + localStorage.getItem("jwt"),
      },
      body: JSON.stringify({
        followId: userid,
      }),
    })
      .then((res) => res.json())
      .then((data) => {
        dispatch({
          type: "UPDATE",
          payload: { following: data.following, followers: data.followers },
        });
        localStorage.setItem("user", JSON.stringify(data));
        setProf((prevState) => {
          const newFollower = prevState.user.followers.filter(
            (item) => item !== data._id
          );
          return {
            user: {
              ...prevState,
              users: {
                ...prevState.user,
                followers: newFollower,
              },
            },
          };
        });
        setShowFollow(true);
        window.location.reload();
      });
  };

  return (
    <>
      {posts ? (
        <div style={{ maxWidth: "550px", margin: "0px auto" }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-around",
              margin: "18px 0",
              borderBottom: "1px solid grey",
              padding: "1rem 0",
            }}
          >
            <div>
              <img
                alt="profile"
                style={{
                  width: "160px",
                  height: "160px",
                  borderRadius: "80px",
                }}
                src={userPic}
              />
            </div>
            <div>
              <h4>{userProfile}</h4>
              <h5>{userEmail}</h5>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-around",
                  width: "108%",
                }}
              >
                <h6>{Profile} posts</h6>
                <h6>
                  {Prof.user === undefined
                    ? "loading"
                    : Prof.user.followers === undefined
                    ? "loading"
                    : Prof.user.followers.length}
                  &nbsp;followers
                </h6>
                <h6>
                  {Prof.user === undefined
                    ? "loading"
                    : Prof.user.following === undefined
                    ? "loading"
                    : Prof.user.following.length}
                  &nbsp;following
                </h6>
              </div>
              {!JSON.parse(localStorage.getItem("user")).following.includes(
                userid
              ) && showFollow ? (
                <button
                  className="btn waves-effect waves-light  blue darken-4"
                  type="submit"
                  name="action"
                  onClick={() => followUser()}
                >
                  Follow
                </button>
              ) : (
                <button
                  className="btn waves-effect waves-light  red lighten-2"
                  type="submit"
                  name="action"
                  onClick={() => unfollowUser()}
                >
                  Unfollow
                </button>
              )}
            </div>
          </div>
          <div className="gallery">
            {posts.map((item) => {
              return (
                <img
                  key={item._id}
                  className="item"
                  alt="gallery"
                  src={item.photo}
                />
              );
            })}
          </div>
        </div>
      ) : (
        "Loading..."
      )}
    </>
  );
};
