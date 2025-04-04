import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

function AddReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;
  console.log("Movie received:", movie);

  const [score, setScore] = useState("");
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <div style={{ padding: "2rem" }}>
        <h2>No movie selected.</h2>
        <button onClick={() => navigate("/add-movie")}>Back to Search</button>
      </div>
    );
  }

  const handleSubmit = async () => {
    if (!score) {
      alert("Please enter a score.");
      return;
    }

    if (!movie.genre_ids || movie.genre_ids.length === 0) {
      const proceed = window.confirm(
        "This movie has no genre information from TMDB. Do you want to continue?"
      );
      if (!proceed) return;
    }

    try {
      // Save movie
      await axios.post("http://127.0.0.1:5000/add-movie", {
        tmdb_id: movie.id,
        title: movie.title,
        genre_ids: movie.genre_ids || [],
        release_year: movie.release_date?.slice(0, 4),
        poster_path: movie.poster_path || "",
      });

      // Save rating
      await axios.post("http://127.0.0.1:5000/rate", {
        tmdb_id: movie.id,
        score: parseInt(score),
        review,
      });

      alert("Review submitted!");
      navigate("/");
    } catch (err) {
      console.error("Error submitting review:", err);
      alert("Something went wrong.");
    }
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Add Review</h2>

      <div style={{ display: "flex", gap: "2rem", alignItems: "flex-start" }}>
        <img
          src={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
          style={{ width: "200px", borderRadius: "10px" }}
        />

        <div style={{ flex: 1 }}>
          <h3>
            {movie.title} ({movie.release_date?.slice(0, 4) || "Unknown"})
          </h3>

          <label>Rating (1–10):</label>
          <br />
          <input
            type="number"
            value={score}
            min={1}
            max={10}
            onChange={(e) => setScore(e.target.value)}
            style={{
              width: "80px",
              padding: "8px",
              fontSize: "1rem",
              marginTop: "4px",
            }}
          />

          <br />
          <br />
          <label>Review:</label>
          <br />
          <textarea
            rows="4"
            cols="50"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            style={{
              padding: "10px",
              fontSize: "1rem",
              borderRadius: "6px",
              border: "1px solid #ccc",
              resize: "vertical",
            }}
          />
          <br />
          <br />

          <button
            onClick={handleSubmit}
            style={{
              padding: "10px 20px",
              backgroundColor: "#2225c1",
              color: "#fff",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
              fontSize: "1rem",
            }}
          >
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
}
export default AddReviewPage;
