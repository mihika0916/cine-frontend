import React from "react";
import {
  Card,
  CardActionArea,
  CardMedia,
  CardContent,
  Typography,
  Chip,
  Stack,
  Box,
} from "@mui/material";

const GENRE_MAP = {
  28: "Action",
  12: "Adventure",
  16: "Animation",
  35: "Comedy",
  80: "Crime",
  18: "Drama",
  10751: "Family",
  14: "Fantasy",
  27: "Horror",
  10402: "Music",
  9648: "Mystery",
  10749: "Romance",
  878: "Sci-Fi",
  53: "Thriller",
  10752: "War",
};

function MovieCard({ movie, onClick }) {
  return (
    <Card
      sx={{
        width: 200, // wider card
        height: 420,
        display: "flex",
        flexDirection: "column",
        borderRadius: 2,
        boxShadow: 3,
        cursor: "pointer",
        transition: "transform 0.2s",
        "&:hover": {
          transform: "scale(1.03)",
        },
      }}
      onClick={() => onClick(movie)}
    >
      <CardActionArea sx={{ height: "100%" }}>
        <CardMedia
          component="img"
          image={
            movie.poster_path
              ? `https://image.tmdb.org/t/p/w300${movie.poster_path}`
              : "https://via.placeholder.com/300x450?text=No+Image"
          }
          alt={movie.title}
          sx={{
            height: 270,
            objectFit: "cover",
            backgroundColor: "#f0f0f0",
          }}
        />

        <CardContent sx={{ flexGrow: 1 }}>
          <Typography
            variant="subtitle1"
            fontWeight="bold"
            sx={{
              overflow: "hidden",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              minHeight: "3rem", // ensure height for title area
            }}
          >
            {movie.title}
          </Typography>

          <Typography variant="body2" color="text.secondary" mb={1}>
            {movie.release_date?.slice(0, 4) || "Unknown"}
          </Typography>

          <Box mt="auto" pb={1}>
            {movie.genre_ids && (
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {movie.genre_ids
                  .slice(0, 2)
                  .map((id) =>
                    GENRE_MAP[id] ? (
                      <Chip
                        key={id}
                        label={GENRE_MAP[id]}
                        size="small"
                        sx={{ fontSize: "0.7rem" }}
                      />
                    ) : null
                  )}
              </Stack>
            )}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}

export default MovieCard;
