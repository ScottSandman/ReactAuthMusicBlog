import React from "react";
import Blogs from "./Blogs";
import BlogForm from "./BlogForm";

function MainContent({ createBlog, isLoggedIn, userName }) {
  if (!createBlog) {
    return (
      <div>
        <Blogs />
      </div>
    );
  } else {
    return (
      <div>
        <BlogForm />
      </div>
    );
  }
}

export default MainContent;
