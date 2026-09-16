import {
    Avatar,
    Box,
    Chip,
    List,
    ListItemButton,
    ListItemText,
    Paper,
    Typography,
  } from "@mui/material";
  
  import type { Song } from "../api/musicApi";
  
  interface SearchResultsProps {
    songs: Song[];
    selectedSongs: Song[];
    onSelectSong: (song: Song) => void;
  }
  
  function SearchResults({
    songs,
    selectedSongs,
    onSelectSong,
  }: SearchResultsProps) {
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
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "white",
            mb: 2,
          }}
        >
          Search Results
        </Typography>
  
        <List sx={{ p: 0 }}>
          {songs.map((song) => {
            const isSelected = selectedSongs.some(
              (selected) =>
                selected.track_id === song.track_id
            );
  
            return (
              <ListItemButton
                key={song.track_id}
                onClick={() => onSelectSong(song)}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  mb: 1,
                  gap: 2,
                  color: "white",
  
                  "&:hover": {
                    bgcolor: "#282828",
                  },
  
                  "&.Mui-selected": {
                    bgcolor: "#23432e",
                  },
  
                  "&.Mui-selected:hover": {
                    bgcolor: "#2b5238",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "#303030",
                    color: "#1ed760",
                    width: 44,
                    height: 44,
                    fontSize: 22,
                  }}
                >
                  ♪
                </Avatar>
  
                <ListItemText 
                    primary={song.track_name}
                    secondary={song.artist_name}
                    slotProps={{
                        primary: {
                        sx: {
                            fontWeight: 600,
                            color: "white",
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
                    label={song.genre}
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
                    Popularity {song.popularity}
                  </Typography>
                </Box>
              </ListItemButton>
            );
          })}
        </List>
      </Paper>
    );
  }
  
  export default SearchResults;