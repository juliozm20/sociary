import "./App.css";
import Navbar from "./components/Navbar";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { Home } from "./components/screens/Home";
import { Signin } from "./components/screens/Signin";
import { Profile } from "./components/screens/Profile";
import { Signup } from "./components/screens/Signup";
import { Createpost } from "./components/screens/Createpost";
import { createContext, useContext, useEffect, useReducer } from "react";
import { UserProfile } from "./components/screens/UserProfile";
import { initialState, reducer } from "./reducers/userReducer";
import { SubscribedUserPosts } from "./components/screens/SubscribedUserPosts";

export const userContext = createContext();
const Routing = () => {
  const navigate = useNavigate();
  const { state, dispatch } = useContext(userContext);
  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      dispatch({ type: "USER", payload: user });
    } else {
      navigate("/signin");
    }
  }, []);
  return (
    <Routes>
      <Route exact path="/" element={<Home />} />
      {/* <Home />
        </Route> */}
      <Route path="/signin" element={<Signin />} />
      {/* <Signin />
        </Route> */}
      <Route path="/signup" element={<Signup />} />
      {/* <Signup />
        </Route> */}
      <Route exact path="/profile" element={<Profile />} />
      {/* <Profile />
        </Route> */}
      <Route path="/create" element={<Createpost />} />

      <Route path="/profile/:userid" element={<UserProfile />} />

      <Route path="/myfollowerspost" element={<SubscribedUserPosts />} />
    </Routes>
  );
};
function App() {
  const [state, dispatch] = useReducer(reducer, initialState);
  return (
    <userContext.Provider value={{ state, dispatch }}>
      <BrowserRouter>
        <Navbar />
        <Routing />
      </BrowserRouter>
    </userContext.Provider>
  );
}

export default App;
