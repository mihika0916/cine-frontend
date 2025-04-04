import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

function AddMoviePage() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const navigate = useNavigate();

  const handleSearch = async () => {
    if (!query.trim()) return;

    try {
      const res = await axios.get("https://api.themoviedb.org/3/search/movie", {
        params: {
          api_key: "6e936820df0eb326f400c2d3716a01b0",
          query: query,
        },
      });
      setResults(res.data.results);
    } catch (err) {
      console.error("TMDB API error:", err);
    }
  };

  const handleSelect = (movie) => {
    navigate("/add-review", { state: { movie } });
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>Search for a Movie</h2>

      <div style={{ display: "flex", gap: "10px", marginBottom: "2rem" }}>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Enter movie title"
          style={{
            flex: "1",
            padding: "10px",
            fontSize: "1rem",
            borderRadius: "4px",
            border: "1px solid #ccc",
          }}
        />
        <button
          onClick={handleSearch}
          style={{
            padding: "10px 16px",
            fontSize: "1rem",
            backgroundColor: "#2225c1",
            color: "white",
            border: "none",
            borderRadius: "4px",
            cursor: "pointer",
          }}
        >
          Search
        </button>
      </div>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          gap: "20px",
        }}
      >
        {results.map((movie) => (
          <MovieCard key={movie.id} movie={movie} onClick={handleSelect} />
        ))}
      </div>
    </div>
  );
}

export default AddMoviePage;
