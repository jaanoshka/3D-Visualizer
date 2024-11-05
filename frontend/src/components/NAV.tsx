import * as React from "react";

function Nav1(): JSX.Element {
  return (
    <nav className="nav">
      <a href="/" className="site-title">
        HOME
      </a>
      <ul>
        <li>
          <a href="/CreateNew">Create New</a>
        </li>
        <li>
          <a href="/OpenModel">Open Model</a>
        </li>
        <li>
          <a href="/CreateUser">Create User</a>
        </li>
        <li>
          <a href="/ImageDisplay">View</a>
        </li>
        <li>
          <a href="/View2">View 2</a>
        </li>
        <li>
          <a href="/View3">View 3</a>
        </li>
      </ul>
    </nav>
  );
}

export default Nav1;
