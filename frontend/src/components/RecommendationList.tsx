import {
    Avatar,
    Box,
    Chip,
    List,
    ListItemText,
    Paper,
    Typography,
  } from "@mui/material";
  
  import type { Recommendation } from "../api/musicApi";
  
  interface RecommendationListProps {
    recommendations: Recommendation[];
    selectedCount: number;
  }
  
  function RecommendationList({
    recommendations,
    selectedCount,
  }: RecommendationListProps) {
    if (recommendations.length === 0) {
      return null;
    }
  
    return (
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          bgcolor: "#181818",
          border: "1px solid #282828",
          borderRadius: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "white",
              mb: 1,
            }}
          >
            Recommended for You
          </Typography>
  
          <Typography sx={{ color: "#a7a7a7" }}>
            Based on {selectedCount} selected{" "}
            {selectedCount === 1 ? "song" : "songs"}.
          </Typography>
        </Box>
  
        <List sx={{ p: 0 }}>
          {recommendations.map((recommendation, index) => (
            <Box
              key={recommendation.track_id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                mb: 1,
                bgcolor: "#242424",
                borderRadius: 2,
                transition: "background-color 0.2s",
  
                "&:hover": {
                  bgcolor: "#303030",
                },
              }}
            >
              <Typography
                sx={{
                  width: 24,
                  textAlign: "center",
                  color: "#a7a7a7",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>
  
              <Avatar
                sx={{
                  bgcolor: "#303030",
                  color: "#1ed760",
                  width: 44,
                  height: 44,
                  flexShrink: 0,
                }}
              >
                ♪
              </Avatar>
  
              <ListItemText
                primary={recommendation.track_name}
                secondary={recommendation.artist_name}
                slotProps={{
                  primary: {
                    sx: {
                      color: "white",
                      fontWeight: 600,
                    },
                  },
                  secondary: {
                    sx: {
                      color: "#a7a7a7",
                    },
                  },
                }}
                sx={{ minWidth: 0 }}
              />
  
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  flexShrink: 0,
                }}
              >
                <Chip
                  label={recommendation.genre}
                  size="small"
                  sx={{
                    bgcolor: "#303030",
                    color: "#d0d0d0",
                    display: {
                      xs: "none",
                      sm: "inline-flex",
                    },
                  }}
                />
  
                <Typography
                  variant="caption"
                  sx={{
                    color: "#a7a7a7",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  Popularity {recommendation.popularity}
                </Typography>
              </Box>
            </Box>
          ))}
        </List>
      </Paper>
    );
  }
  
  export default RecommendationList;