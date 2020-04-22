import React, { useState, useEffect } from "react";
import Button from "@material-ui/core/Button";
import axios from "axios";

function Login({
  userName,
  setUserName,
  setPassword,
  isLoggedIn,
  setIsLoggedIn,
  password,
  createBlog,
  setCreateBlog,
}) {
  const [tryLogin, setTryLogin] = useState(false);

  async function authUser() {
    const response = await axios({
      method: "post",
      url: "http://localhost:4000/users/login",
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        username: userName,
        password: password,
      },
    });
  }

  useEffect(() => {
    if (tryLogin) {
      authUser();
      setTryLogin(false);
      setPassword("");
      setIsLoggedIn(true);
    }
  }, [tryLogin]);

  if (!isLoggedIn) {
    return (
      <div>
        <input
          id="user-name"
          type="text"
          required
          placeholder="Username"
          onChange={(e) => {
            setUserName(e.target.value);
          }}
        ></input>
        <input
          id="password"
          type="password"
          required
          placeholder="password"
          onChange={(e) => setPassword(e.target.value)}
        ></input>
        <Button onClick={() => setTryLogin(true)} color="inherit">
          Login
        </Button>
      </div>
    );
  } else {
    return (
      <div>
        {`Welcome ${userName}`}
        <Button onClick={() => setCreateBlog(true)} color="inherit">
          Write a Blog
        </Button>
        <Button onClick={() => setIsLoggedIn(false)} color="inherit">
          LogOut
        </Button>
      </div>
    );
  }
}

export default Login;
