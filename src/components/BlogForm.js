import React from "react";

function BlogForm() {
  return (
    <div>
      <input type="text" placeholder="Start Writing Bitch" id="title"></input>
      <br />
      <textarea cols="300" rows="10" id="post"></textarea>
    </div>
  );
}

export default BlogForm;
