import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Container,
  Typography,
  Card,
  CardContent,
  Chip,
  Stack,
  Rating,
  CardMedia,
} from "@mui/material";

const YourStatsPage = () => {
  const [stats, setStats] = useState(null);
  const [range, setRange] = useState("all");

  useEffect(() => {
    axios
      .get(`http://127.0.0.1:5000/user-stats?range=${range}`)
      .then((res) => setStats(res.data))
      .catch((err) => console.error("Stats fetch error:", err));
  }, [range]);

  return (
    <Container sx={{ py: 4 }} maxWidth={false}>
      <Typography variant="h4" gutterBottom fontWeight="bold">
        🎉 Your CineRank Wrapped
      </Typography>

      <Stack direction="row" spacing={1} mb={4}>
        {["month", "year", "all"].map((r) => (
          <Chip
            key={r}
            label={
              r === "month"
                ? "Last Month"
                : r === "year"
                ? "This Year"
                : "All Time"
            }
            color={range === r ? "primary" : "default"}
            onClick={() => setRange(r)}
            clickable
          />
        ))}
      </Stack>

      {stats && (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
              lg: "repeat(4, 1fr)",
            },
            gap: 3,
          }}
        >
          <Card>
            <CardContent>
              <Typography variant="h6">🧠 Most Watched Genre</Typography>
              <Typography variant="h4">
                {stats.most_watched_genre || "N/A"}
              </Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">🎞️ You've Binged</Typography>
              <Typography variant="h4">{stats.total_movies}</Typography>
              <Typography variant="body2">movies watched</Typography>
            </CardContent>
          </Card>

          <Card sx={{ gridColumn: { xs: "span 1", sm: "span 2" } }}>
            <CardContent>
              <Typography variant="h6">📈 Avg Rating</Typography>
              <Box display="flex" alignItems="center" gap={1}>
                <Rating
                  value={stats.avg_rating / 2}
                  precision={0.1}
                  readOnly
                  size="large"
                />
                <Typography variant="h5" fontWeight="bold">
                  {stats.avg_rating}/10
                </Typography>
              </Box>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">💬 Your Go-To Word</Typography>
              <Typography variant="h4" fontStyle="italic">
                "{stats.most_used_word || "N/A"}"
              </Typography>
              <Typography variant="body2">Most used word in reviews</Typography>
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <Typography variant="h6">🕰️ Longest Movie Drought</Typography>
              <Typography variant="h4">
                {stats.longest_gap_days || 0} days
              </Typography>
              <Typography variant="body2">
                Between two movies you watched
              </Typography>
            </CardContent>
          </Card>

          <Card sx={{ gridColumn: "1 / -1" }}>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                🏆 Your Screen-Time Soulmate
                {stats.favourite_movies?.length > 1 ? "s" : ""}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexWrap: "wrap",
                  gap: 2,
                  justifyContent: "flex-start",
                  mt: 2,
                }}
              >
                {stats.favourite_movies?.map((movie, i) => (
                  <Card key={i} sx={{ width: 200 }}>
                    <CardMedia
                      component="img"
                      image={
                        movie.poster_path
                          ? `https://image.tmdb.org/t/p/w200${movie.poster_path}`
                          : "https://via.placeholder.com/200x300?text=No+Image"
                      }
                      alt={movie.title}
                      sx={{ height: 300, objectFit: "cover" }}
                    />
                    <CardContent>
                      <Typography variant="subtitle1">{movie.title}</Typography>
                      <Rating
                        value={movie.score / 2}
                        precision={0.1}
                        readOnly
                        size="small"
                      />
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ mb: 0.5 }}
                      >
                        {movie.score}/10 — {movie.review || "No review"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Watched on{" "}
                        {new Date(movie.watched_at).toLocaleDateString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            </CardContent>
          </Card>
        </Box>
      )}
    </Container>
  );
};

export default YourStatsPage;
