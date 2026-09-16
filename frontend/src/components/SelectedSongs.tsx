import {
    Avatar,
    Box,
    Button,
    Chip,
    List,
    ListItemText,
    Paper,
    Typography,
  } from "@mui/material";
  
  import type { Song } from "../api/musicApi";
  
  interface SelectedSongsProps {
    songs: Song[];
    onRemoveSong: (trackId: string) => void;
    onGetRecommendations: () => void;
    loading: boolean;
  }
  
  function SelectedSongs({
    songs,
    onRemoveSong,
    onGetRecommendations,
    loading,
  }: SelectedSongsProps) {
    if (songs.length === 0) {
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
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: 2,
            mb: 1,
          }}
        >
          <Typography
            variant="h6"
            sx={{
              fontWeight: 700,
              color: "white",
            }}
          >
            Your Playlist
          </Typography>
  
          <Chip
            label={`${songs.length}/10 songs`}
            size="small"
            sx={{
              bgcolor: "#303030",
              color: "#1ed760",
              fontWeight: 600,
            }}
          />
        </Box>
  
        <Typography
          sx={{
            color: "#a7a7a7",
            mb: 2,
          }}
        >
          Your recommendations will be based on these songs.
        </Typography>
  
        <List sx={{ p: 0 }}>
          {songs.map((song, index) => (
            <Box
              key={song.track_id}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                mb: 1,
                bgcolor: "#242424",
                borderRadius: 2,
              }}
            >
              <Typography
                sx={{
                  color: "#a7a7a7",
                  width: 20,
                  textAlign: "center",
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
                }}
              >
                ♪
              </Avatar>
  
              <ListItemText
                primary={song.track_name}
                secondary={`${song.artist_name} • ${song.genre} • Popularity: ${song.popularity}`}
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
  
              <Button
                color="error"
                size="small"
                onClick={() =>
                  onRemoveSong(song.track_id)
                }
                sx={{
                  textTransform: "none",
                  flexShrink: 0,
                }}
              >
                Remove
              </Button>
            </Box>
          ))}
        </List>
  
        <Button
          fullWidth
          variant="contained"
          onClick={onGetRecommendations}
          disabled={loading}
          sx={{
            mt: 2,
            py: 1.5,
            bgcolor: "#1ed760",
            color: "#000",
            fontWeight: 700,
            borderRadius: 3,
            textTransform: "none",
  
            "&:hover": {
              bgcolor: "#1fdf64",
            },
          }}
        >
          {loading
            ? "Finding Recommendations..."
            : "Get Recommendations"}
        </Button>
      </Paper>
    );
  }
  
  export default SelectedSongs;