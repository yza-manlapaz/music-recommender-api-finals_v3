import { Box, Typography } from "@mui/material";

function AppHeader() {
  return (
    <Box
      sx={{
        textAlign: "center",
        mb: 5,
      }}
    >
      <Typography
        variant="h3"
        sx={{
          color: "text.primary",
          fontWeight: 800,
          letterSpacing: "-1px",
          mb: 1.5,
        }}
      >
        Music Recommendation API
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          fontSize: "1.05rem",
          maxWidth: 600,
          mx: "auto",
          lineHeight: 1.7,
        }}
      >
        This is an application that recommends songs based on what you selected.
        Search and select up to 10 songs to get your recommendation.
      </Typography>
    </Box>
  );
}

export default AppHeader;