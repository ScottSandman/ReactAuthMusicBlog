import React, { useState, useEffect } from "react";
import axios from "axios";

function Blogs() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
    async function getBlogs() {
      const request = await axios({
        method: "get",
        url: "http://localhost:4000/blogs",
        header: {
          "Content-Type": "application/json",
        },
      });
      setBlogs(request.data[0]);
    }
    getBlogs();
  }, []);
  return (
    <div>
      {blogs.map((blog) => (
        <div style={blogStyle}>
          <div>{blog.title}</div>
          <div>{blog.date.slice(0, 10)}</div>
          <div>{blog.post}</div>
          <div>{blog.username}</div>
        </div>
      ))}
    </div>
  );
}

const blogStyle = {
  margin: 20,
};

export default Blogs;
