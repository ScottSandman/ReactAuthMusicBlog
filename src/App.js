import React, { useState } from "react";
import "./App.css";
import Nav from "./components/Nav";
import MainContent from "./components/MainContent";

function App() {
  const [userName, setUserName] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [password, setPassword] = useState("");
  const [createBlog, setCreateBlog] = useState(false);

  console.log(password, userName);
  return (
    <div className="App">
      <Nav
        setUserName={setUserName}
        setIsLoggedIn={setIsLoggedIn}
        setPassword={setPassword}
        userName={userName}
        password={password}
        isLoggedIn={isLoggedIn}
        createBlog={createBlog}
        setCreateBlog={setCreateBlog}
      />
      <MainContent
        isLoggedIn={isLoggedIn}
        userName={userName}
        createBlog={createBlog}
      />
    </div>
  );
}

export default App;
