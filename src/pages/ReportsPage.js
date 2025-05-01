// --- src/pages/ReportPage.js ---
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Container,
  Typography,
  Chip,
  Button,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Box,
} from "@mui/material";

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
    const url = selectedGenre
      ? "http://127.0.0.1:5000/report-by-genre-ps"
      : "http://127.0.0.1:5000/report-all";

    const params = selectedGenre
      ? { genre_id: selectedGenre.id, range: timeFilter }
      : { range: timeFilter };

    axios
      .get(url, { params })
      .then((res) => setReportData(res.data))
      .catch((err) => console.error("Report error:", err));
  };

  const handleEditClick = (rating, index) => {
    setEditingRating({ ...rating, index });
  };

  const handleEditSave = () => {
    const { id, score, review } = editingRating;
    if (!score || score < 1 || score > 10 || review.trim() === "") {
      alert("Please provide a valid score (1–10) and review.");
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

  const handleGenreClick = (genre) =>
    setSelectedGenre((prev) => (prev?.id === genre.id ? null : genre));

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h5" gutterBottom>
        {selectedGenre
          ? `Ratings for ${selectedGenre.name}`
          : "All Ratings Report"}
      </Typography>

      {/* Genre Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Filter by Genre:
      </Typography>
      <Stack
        direction="row"
        spacing={1}
        flexWrap="wrap"
        useFlexGap
        sx={{ mb: 3, rowGap: 3, columnGap: 1 }}
      >
        {genres.map((genre) => (
          <Chip
            key={genre.id}
            label={genre.name}
            clickable
            color={selectedGenre?.id === genre.id ? "primary" : "default"}
            onClick={() => handleGenreClick(genre)}
          />
        ))}
      </Stack>

      {/* Time Filter */}
      <Typography variant="subtitle1" gutterBottom>
        Filter by Time:
      </Typography>
      <Stack direction="row" spacing={1} sx={{ mb: 4 }}>
        {["all", "week", "day"].map((range) => (
          <Chip
            key={range}
            label={
              range === "all"
                ? "All Time"
                : range === "week"
                ? "Last Week"
                : "Last 24h"
            }
            clickable
            color={timeFilter === range ? "primary" : "default"}
            onClick={() => setTimeFilter(range)}
          />
        ))}
      </Stack>

      {/* Ratings */}
      {reportData.length > 0 ? (
        <Grid container spacing={3}>
          {reportData.map((r, i) => (
            <Grid item xs={12} key={i}>
              <Card sx={{ display: "flex", minHeight: 180 }}>
                <CardMedia
                  component="img"
                  image={
                    r.poster_path
                      ? `https://image.tmdb.org/t/p/w300${r.poster_path}`
                      : "https://via.placeholder.com/300x450?text=No+Image"
                  }
                  alt={r.movie_title}
                  sx={{ width: 120, borderRadius: "4px 0 0 4px" }}
                />
                <CardContent sx={{ flex: 1 }}>
                  <Typography variant="h6">{r.movie_title}</Typography>
                  <Typography variant="body1">
                    <strong>{r.score}/10</strong> —{" "}
                    {r.review || "No review provided"}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    Watched on {new Date(r.watched_at).toLocaleDateString()}
                  </Typography>

                  <Box sx={{ mt: 1 }}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleEditClick(r, i)}
                      sx={{ mr: 1 }}
                    >
                      Edit
                    </Button>
                    <Button
                      size="small"
                      color="error"
                      variant="outlined"
                      onClick={() => handleDelete(r.id)}
                    >
                      Delete
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      ) : (
        <Typography sx={{ mt: 3 }}>
          No ratings found for this filter.
        </Typography>
      )}

      {/* Edit Modal */}
      <Dialog open={!!editingRating} onClose={() => setEditingRating(null)}>
        <DialogTitle>Edit Rating</DialogTitle>
        <DialogContent>
          <TextField
            type="number"
            label="Score (1–10)"
            fullWidth
            value={editingRating?.score || ""}
            onChange={(e) =>
              setEditingRating({
                ...editingRating,
                score: Number(e.target.value),
              })
            }
            sx={{ mb: 2 }}
          />
          <TextField
            label="Review"
            fullWidth
            multiline
            rows={4}
            value={editingRating?.review || ""}
            onChange={(e) =>
              setEditingRating({ ...editingRating, review: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditingRating(null)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}

export default ReportPage;
