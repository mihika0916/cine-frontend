import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import MovieCard from "../components/MovieCard";

import {
  Container,
  Typography,
  TextField,
  Button,
  Grid,
  Box,
} from "@mui/material";

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
    <Container maxWidth="lg" sx={{ paddingTop: "2rem" }}>
      <Typography variant="h5" gutterBottom>
        Search for a Movie
      </Typography>

      <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
        <TextField
          label="Enter movie title"
          fullWidth
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          variant="outlined"
        />
        <Button
          variant="contained"
          color="primary"
          onClick={handleSearch}
          sx={{ minWidth: "100px" }}
        >
          Search
        </Button>
      </Box>

      <Grid container spacing={3} justifyContent="flex-start">
        {results.map((movie) => (
          <Grid item key={movie.id}>
            <MovieCard movie={movie} onClick={handleSelect} />
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}

export default AddMoviePage;
