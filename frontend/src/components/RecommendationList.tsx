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
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
        }}
      >
        <Box sx={{ mb: 3 }}>
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "text.primary",
              mb: 1,
            }}
          >
            Recommended for You
          </Typography>
  
          <Typography 
            sx={{
              color: "text.secondary"
              }}
            >
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
                bgcolor: "action.hover",
                borderRadius: 2,
                transition: "background-color 0.2s",
  
                "&:hover": {
                  bgcolor: "action.selected",
                },
              }}
            >
              <Typography
                sx={{
                  width: 24,
                  textAlign: "center",
                  color: "text.secondary",
                  flexShrink: 0,
                }}
              >
                {index + 1}
              </Typography>
  
              <Avatar
                sx={{
                  bgcolor: "background.paper",
                  color: "primary.main",
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
                      color: "text.priamry",
                      fontWeight: 600,
                    },
                  },
                  secondary: {
                    sx: {
                      color: "text.secondary",
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
                    bgcolor: "background.paper",
                    color: "text.secondary",
                    display: {
                      xs: "none",
                      sm: "inline-flex",
                    },
                  }}
                />
  
                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
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