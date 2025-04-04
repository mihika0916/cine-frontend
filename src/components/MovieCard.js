// --- src/components/MovieCard.js ---
import React from "react";

function MovieCard({ movie, onClick }) {
  return (
    <div
      onClick={() => onClick(movie)}
      style={{
        width: "180px",
        cursor: "pointer",
        background: "#fff",
        borderRadius: "8px",
        boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
        overflow: "hidden",
        transition: "transform 0.2s",
      }}
    >
      <img
        src={
          movie.poster_path
            ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
            : "https://via.placeholder.com/300x450?text=No+Image"
        }
        alt={movie.title}
        style={{ width: "100%", height: "270px", objectFit: "cover" }}
      />
      <div style={{ padding: "10px" }}>
        <h4 style={{ fontSize: "1rem", margin: "0 0 4px 0" }}>{movie.title}</h4>
        <p style={{ fontSize: "0.85rem", color: "#666", margin: 0 }}>
          {movie.release_date?.slice(0, 4) || "Unknown"}
        </p>
      </div>
    </div>
  );
}

export default MovieCard;
