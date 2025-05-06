import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Box, AppBar, Toolbar, Typography, Button } from "@mui/material";

function NavBar() {
  const location = useLocation();

  const navItems = [
    { label: "🎬 All Watched", path: "/report" },
    { label: "📊 Your Stats", path: "/your-stats" },
    { label: "➕ Add Movie", path: "/add-movie" },
  ];

  return (
    <AppBar position="static" color="default" elevation={1}>
      <Toolbar>
        <Typography
          variant="h6"
          sx={{ flexGrow: 1, fontWeight: "bold", color: "#2225c1" }}
        >
          CineRank
        </Typography>
        {navItems.map((item) => (
          <Button
            key={item.path}
            component={Link}
            to={item.path}
            color={location.pathname === item.path ? "primary" : "inherit"}
            sx={{
              textTransform: "none",
              fontWeight: location.pathname === item.path ? "bold" : "normal",
              mx: 1,
            }}
          >
            {item.label}
          </Button>
        ))}
      </Toolbar>
    </AppBar>
  );
}

export default NavBar;
