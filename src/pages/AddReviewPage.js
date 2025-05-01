import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Box,
  Typography,
  Container,
  Card,
  CardMedia,
  CardContent,
  TextField,
  Button,
  Chip,
  Rating,
} from "@mui/material";

// Genre ID → Name mapping
const genreMap = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  99: "Documentary",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  36: "History",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Science Fiction",
  10770: "TV Movie",
  53: "Thriller",
  10752: "War",
  37: "Western",
};

function AddReviewPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const movie = location.state?.movie;

  const [score, setScore] = useState(0);
  const [review, setReview] = useState("");

  if (!movie) {
    return (
      <Container sx={{ paddingTop: "2rem" }}>
        <Typography variant="h5">No movie selected.</Typography>
        <Button onClick={() => navigate("/add-movie")} sx={{ mt: 2 }}>
          Back to Search
        </Button>
      </Container>
    );
  }

  const handleSubmit = async () => {
    if (!score) {
      alert("Please give a rating.");
      return;
    }

    try {
      // Add movie to DB
      await axios.post("https://cine-backend.onrender.com/add-movie", {
        tmdb_id: movie.id,
        title: movie.title,
        genre_ids: movie.genre_ids || [],
        release_year: movie.release_date?.slice(0, 4),
        poster_path: movie.poster_path || "",
      });

      // Add rating (scale to 10 if needed)
      await axios.post("https://cine-backend.onrender.com/rate", {
        tmdb_id: movie.id,
        score: score * 2, // optional: if you want to save it out of 10 in the DB
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
    <Container sx={{ paddingTop: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Add Review
      </Typography>

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: 4,
        }}
      >
        {/* Movie Poster & Meta */}
        <Card sx={{ width: 250 }}>
          <CardMedia
            component="img"
            image={
              movie.poster_path
                ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
                : "https://via.placeholder.com/300x450?text=No+Image"
            }
            alt={movie.title}
          />
          <CardContent>
            <Typography variant="h6">{movie.title}</Typography>
            <Typography variant="body2" color="text.secondary">
              {movie.release_date?.slice(0, 4) || "Unknown"}
            </Typography>
            <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {movie.genre_ids?.map((id) => (
                <Chip key={id} label={genreMap[id] || "Other"} size="small" />
              ))}
            </Box>
          </CardContent>
        </Card>

        {/* Rating and Review Input */}
        <Box sx={{ flex: 1 }}>
          <Typography>Rating (0–5 stars):</Typography>
          <Rating
            name="movie-rating"
            precision={0.5}
            value={score}
            onChange={(e, newValue) => setScore(newValue)}
          />

          <Typography sx={{ mt: 2 }}>Your Review:</Typography>
          <TextField
            multiline
            rows={4}
            fullWidth
            variant="outlined"
            value={review}
            onChange={(e) => setReview(e.target.value)}
            placeholder="What did you think of the movie?"
            sx={{ mt: 1 }}
          />

          <Button
            variant="contained"
            color="primary"
            sx={{ mt: 3 }}
            onClick={handleSubmit}
          >
            Submit Review
          </Button>
        </Box>
      </Box>
    </Container>
  );
}

export default AddReviewPage;
