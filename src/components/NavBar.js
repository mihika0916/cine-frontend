// src/components/NavBar.js
import React from "react";
import { Link } from "react-router-dom";

function NavBar() {
  return (
    <nav style={{ background: "#eee", padding: "1rem" }}>
      <Link to="/report" style={{ marginRight: "1rem" }}>
        Report
      </Link>
      <Link to="/add-movie">Add Movie</Link>
    </nav>
  );
}

export default NavBar;
