import { Box, Typography } from "@mui/material";

function AppHeader() {
  return (
    <Box sx={{ mb: 5 }}>
      <Typography
        variant="h3"
        sx={{
          fontWeight: 800,
          letterSpacing: "-1px",
          mb: 1,
        }}
      >
        Music Recommender
      </Typography>

      <Typography
        sx={{
          color: "#a7a7a7",
          fontSize: "1.05rem",
          maxWidth: 600,
        }}
      >
        Discover songs based on the music you already enjoy.
        Search and select up to 10 songs to get started.
      </Typography>
    </Box>
  );
}

export default AppHeader;