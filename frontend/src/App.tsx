import { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";

import {
  getBatchRecommendations,
  searchSongs,
  type Recommendation,
  type Song,
} from "./api/musicApi";

function App() {
  const [query, setQuery] = useState("");
  const [songs, setSongs] = useState<Song[]>([]);
  const [recommendations, setRecommendations] = useState<
    Recommendation[]
  >([]);

  const [selectedSongs, setSelectedSongs] = useState<Song[]>([]);

  const [searchLoading, setSearchLoading] = useState(false);
  const [recommendLoading, setRecommendLoading] =
    useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      return;
    }

    try {
      setSearchLoading(true);

      const results = await searchSongs(query);

      setSongs(results);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSong = (song: Song) => {
    // prevent more than 10 songs
    if (selectedSongs.length >= 10) {
      return;
    }
  
    // prevent selecting the same song twice
    const alreadySelected = selectedSongs.some(
      (selected) => selected.track_id === song.track_id
    );
  
    if (alreadySelected) {
      return;
    }
  
    setSelectedSongs((current) => [
      ...current,
      song,
    ]);
  
    // hide search results after selection
    setSongs([]);
    setQuery("");
  
    // old recommendations are no longer based
    // on the current selection
    setRecommendations([]);
  };

  const handleRemoveSong = (trackId: string) => {
    setSelectedSongs((current) =>
      current.filter(
        (song) => song.track_id !== trackId
      )
    );
  
    setRecommendations([]);
  };

  const handleGetRecommendations = async () => {
    if (selectedSongs.length === 0) {
      return;
    }
  
    try {
      setRecommendLoading(true);
      setRecommendations([]);
  
      const trackIds = selectedSongs.map(
        (song) => song.track_id
      );
  
      const response = await getBatchRecommendations(
        trackIds
      );
  
      setRecommendations(
        response.recommendations
      );
    } catch (error) {
      console.error(
        "Batch recommendation request failed:",
        error
      );
    } finally {
      setRecommendLoading(false);
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "#0b0b0b",
        color: "#ffffff",
        py: 6,
      }}
    >
      <Container maxWidth="md">
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
            Search and select up to 10 songs to get a recommendation.
          </Typography>
        </Box>

        {/* <Box
          sx={{
            display: "flex",
            gap: 2,
          }}
        >
          <TextField
            fullWidth
            label="Search songs or artists"
            value={query}
            onChange={(event) =>
              setQuery(event.target.value)
            }
          />

          <Button
            variant="contained"
            onClick={handleSearch}
            disabled={searchLoading}
          >
            {searchLoading ? "Searching..." : "Search"}
          </Button>
        </Box> */}
        <Paper
          elevation={0}
          sx={{
            bgcolor: "#181818",
            borderRadius: 4,
            p: 3,
            border: "1px solid #282828",
          }}
        >
          <Typography
            variant="h6"
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Find your music
          </Typography>

          <Box
            sx={{
              display: "flex",
              gap: 2,
            }}
          >
            <TextField
              fullWidth
              placeholder="Search songs or artists..."
              value={query}
              onChange={(event) =>
                setQuery(event.target.value)
              }
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "#242424",
                  color: "white",
                  borderRadius: 3,

                  "& fieldset": {
                    borderColor: "#3a3a3a",
                  },

                  "&:hover fieldset": {
                    borderColor: "#666",
                  },

                  "&.Mui-focused fieldset": {
                    borderColor: "#1ed760",
                  },
                },

                "& input::placeholder": {
                  color: "#a7a7a7",
                  opacity: 1,
                },
              }}
            />

            <Button
              variant="contained"
              onClick={handleSearch}
              disabled={searchLoading}
              sx={{
                px: 4,
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
              {searchLoading ? "Searching..." : "Search"}
            </Button>
          </Box>
        </Paper>

        {songs.length > 0 && (
          <>
            <Typography
              variant="h5"
              sx={{ mt: 4, mb: 1 }}
            >
              Search Results
            </Typography>

            <List>
              {songs.map((song) => (
                <ListItemButton
                  key={song.track_id}
                  onClick={() =>
                    handleSelectSong(song)
                  }
                  selected={selectedSongs.some(
                    (selected) =>
                      selected.track_id === song.track_id
                  )}
                >
                  <ListItemText
                    primary={song.track_name}
                    secondary={
                      `${song.artist_name} • ` +
                      `${song.genre} • ` +
                      `Popularity: ${song.popularity}`
                    }
                  />
                </ListItemButton>
              ))}
            </List>
          </>
        )}

        {selectedSongs.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />

            <Typography variant="h5">
              Selected Songs ({selectedSongs.length}/10)
            </Typography>

            <Typography
              color="text.secondary"
              sx={{ mb: 2 }}
            >
              Select up to 10 songs, then generate your
              recommendations.
            </Typography>

            <List>
              {selectedSongs.map((song, index) => (
                <Box
                  key={song.track_id}
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 2,
                  }}
                >
                  <ListItemText
                    primary={`${index + 1}. ${song.track_name}`}
                    secondary={
                      `${song.artist_name} • ` +
                      `${song.genre} • ` +
                      `Popularity: ${song.popularity}`
                    }
                  />

                  <Button
                    color="error"
                    onClick={() =>
                      handleRemoveSong(song.track_id)
                    }
                  >
                    Remove
                  </Button>
                </Box>
              ))}
            </List>

            <Button
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleGetRecommendations}
              disabled={recommendLoading}
            >
              {recommendLoading
                ? "Finding Recommendations..."
                : "Get Recommendations"}
            </Button>
          </>
        )}

        {/* {recommendLoading && (
          <Typography sx={{ mt: 4 }}>
            Finding recommendations...
          </Typography>
        )} */}

        {recommendations.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />

              <Typography variant="h5">
                Recommended Songs
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Based on {selectedSongs.length} selected{" "}
                {selectedSongs.length === 1 ? "song" : "songs"}.
              </Typography>

              <List>
                {recommendations.map(
                  (recommendation, index) => (
                    <ListItemButton
                      key={recommendation.track_id}
                    >
                      <ListItemText
                        primary={
                          `${index + 1}. ` +
                          recommendation.track_name
                        }
                        secondary={
                          `${recommendation.artist_name} • ` +
                          `${recommendation.genre} • ` +
                          `Popularity: ${recommendation.popularity}`
                        }
                      />
                    </ListItemButton>
                  )
                )}
              </List>
            </>
          )}
        </Container>
    </Box>
  );
}

export default App;