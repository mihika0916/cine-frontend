import React from "react";

function HomePage() {
  return (
    <div className="container" style={{ padding: "2rem", maxWidth: "700px" }}>
      <h2 style={{ color: "#2225c1", marginBottom: "1rem" }}>
        Welcome to CineRank 🎬
      </h2>
      <p style={{ fontSize: "1.1rem", lineHeight: "1.6" }}>
        CineRank is a lightweight movie-tracking and review web app that lets
        you:
      </p>
      <ul
        style={{ paddingLeft: "1.2rem", marginTop: "1rem", fontSize: "1rem" }}
      >
        <li>Search and add movies from TMDB</li>
        <li>Submit personal ratings and reviews</li>
        <li>Filter reports by date range and genre</li>
        <li>Visualize your movie-watching history</li>
      </ul>
      <p style={{ marginTop: "1.5rem", fontSize: "1.1rem" }}>
        Built with <strong>React + Flask + SQLite</strong>, the app uses both
        ORM and prepared statements to interact with the database.
      </p>
    </div>
  );
}

export default HomePage;
