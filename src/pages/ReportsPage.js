import React, { useEffect, useState } from "react";
import axios from "axios";

function ReportPage() {
  const [reportData, setReportData] = useState([]);
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedGenre, setSelectedGenre] = useState(null);
  const [genres, setGenres] = useState([]);
  const [editingRating, setEditingRating] = useState(null);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    fetchReport();
  }, [timeFilter, selectedGenre]);

  const fetchGenres = () => {
    axios
      .get("http://127.0.0.1:5000/genres")
      .then((res) => setGenres(res.data))
      .catch((err) => console.error("Error loading genres:", err));
  };

  const fetchReport = () => {
    if (selectedGenre) {
      axios
        .get("http://127.0.0.1:5000/report-by-genre-ps", {
          params: {
            genre_id: selectedGenre.id,
            range: timeFilter,
          },
        })
        .then((res) => setReportData(res.data))
        .catch((err) => console.error("Report error:", err));
    } else {
      axios
        .get("http://127.0.0.1:5000/report-all", {
          params: { range: timeFilter },
        })
        .then((res) => setReportData(res.data))
        .catch((err) => console.error("Report error:", err));
    }
  };

  const handleTimeChange = (range) => setTimeFilter(range);
  const handleGenreClick = (genre) =>
    setSelectedGenre((prev) => (prev?.id === genre.id ? null : genre));

  const handleEditClick = (rating, index) => {
    setEditingRating({ ...rating, index });
  };

  const handleEditSave = () => {
    const { id, score, review } = editingRating;
    if (!score || score < 1 || score > 10 || review.trim() === "") {
      alert("Please provide a valid score (1–10) and non-empty review.");
      return;
    }

    axios
      .put(`http://127.0.0.1:5000/rate/${id}`, { score, review })
      .then(() => {
        setEditingRating(null);
        fetchReport();
      })
      .catch((err) => console.error("Edit failed:", err));
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this rating?")) return;

    axios
      .delete(`http://127.0.0.1:5000/rate/${id}`)
      .then(() => fetchReport())
      .catch((err) => console.error("Delete failed:", err));
  };

  return (
    <div style={{ padding: "2rem" }}>
      <h2 style={{ marginBottom: "1rem" }}>
        {selectedGenre
          ? `Ratings for ${selectedGenre.name}`
          : "All Ratings Report"}
      </h2>

      <div style={{ marginBottom: "1rem" }}>
        <strong>Filter by Genre:</strong>
        <div
          style={{
            display: "flex",
            gap: "10px",
            flexWrap: "wrap",
            marginTop: "8px",
          }}
        >
          {genres.map((genre) => (
            <button
              key={genre.id}
              onClick={() => handleGenreClick(genre)}
              style={{
                padding: "6px 12px",
                borderRadius: "20px",
                border: "none",
                backgroundColor:
                  selectedGenre?.id === genre.id ? "#2225c1" : "#eee",
                color: selectedGenre?.id === genre.id ? "#fff" : "#000",
                cursor: "pointer",
              }}
            >
              {genre.name}
            </button>
          ))}
        </div>
      </div>

      <div style={{ marginBottom: "1.5rem" }}>
        <strong>Filter by Time:</strong>
        <div style={{ display: "flex", gap: "10px", marginTop: "0.5rem" }}>
          {["all", "week", "day"].map((range) => (
            <button
              key={range}
              onClick={() => handleTimeChange(range)}
              style={{
                padding: "8px 14px",
                backgroundColor: timeFilter === range ? "#2225c1" : "#eee",
                color: timeFilter === range ? "#fff" : "#000",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              {range === "all"
                ? "All Time"
                : range === "week"
                ? "Last Week"
                : "Last 24h"}
            </button>
          ))}
        </div>
      </div>

      {reportData.length > 0 ? (
        <ul style={{ paddingLeft: "1rem" }}>
          {reportData.map((r, i) => (
            <li
              key={i}
              style={{
                marginBottom: "0.75rem",
                padding: "0.5rem",
                border: "1px solid #ccc",
                borderRadius: "8px",
              }}
            >
              <strong>{r.movie_title}</strong> – <em>{r.score}/10</em>
              <br />
              {r.review || "No review"}
              <br />
              <span style={{ fontSize: "0.9rem", color: "gray" }}>
                Watched on {new Date(r.watched_at).toLocaleDateString()}
              </span>
              <div style={{ marginTop: "0.5rem" }}>
                <button
                  onClick={() => handleEditClick(r, i)}
                  style={{
                    marginRight: "10px",
                    backgroundColor: "#2225c1",
                    color: "#fff",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(r.id)}
                  style={{
                    backgroundColor: "#ff4d4f",
                    color: "#fff",
                    padding: "5px 10px",
                    border: "none",
                    borderRadius: "5px",
                    cursor: "pointer",
                  }}
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ marginTop: "1rem" }}>
          No movies found
          {selectedGenre ? ` for ${selectedGenre.name}` : ""} in this time
          range.
        </p>
      )}

      {editingRating && (
        <div
          style={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            backgroundColor: "#fff",
            padding: "2rem",
            boxShadow: "0 0 10px rgba(0,0,0,0.2)",
            borderRadius: "10px",
            zIndex: 999,
          }}
        >
          <h3>Edit Rating</h3>
          <label>
            Score (1–10):{" "}
            <input
              type="number"
              min="1"
              max="10"
              value={editingRating.score}
              onChange={(e) =>
                setEditingRating({
                  ...editingRating,
                  score: Number(e.target.value),
                })
              }
              style={{ padding: "6px", margin: "6px" }}
            />
          </label>
          <br />
          <label>
            Review:{" "}
            <textarea
              value={editingRating.review}
              onChange={(e) =>
                setEditingRating({
                  ...editingRating,
                  review: e.target.value,
                })
              }
              style={{ padding: "6px", width: "100%", height: "80px" }}
            />
          </label>
          <br />
          <div style={{ marginTop: "1rem" }}>
            <button
              onClick={handleEditSave}
              style={{
                backgroundColor: "#2225c1",
                color: "#fff",
                padding: "8px 14px",
                marginRight: "10px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditingRating(null)}
              style={{
                backgroundColor: "#ccc",
                padding: "8px 14px",
                border: "none",
                borderRadius: "5px",
                cursor: "pointer",
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default ReportPage;
