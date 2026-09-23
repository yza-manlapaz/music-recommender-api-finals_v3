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
          bgcolor: "background.paper",
          border: "1px solid",
          borderColor: "divider",
          borderRadius: 4,
        }}
      >
        <Typography
          variant="h6"
          sx={{
            fontWeight: 700,
            color: "text.primary",
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
                  color: "text.primary",
  
                  "&:hover": {
                    bgcolor: "#action.hover",
                  },
  
                  "&.Mui-selected": {
                    bgcolor: "action.selected",
                  },
  
                  "&.Mui-selected:hover": {
                    bgcolor: "action.selected",
                  },
                }}
              >
                <Avatar
                  sx={{
                    bgcolor: "action.hover",
                    color: "primary.main",
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
                            color: "text.primary",
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
                    label={song.genre}
                    size="small"
                    sx={{
                      bgcolor: "action.hover",
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