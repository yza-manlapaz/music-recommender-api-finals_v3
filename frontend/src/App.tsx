import { useState } from "react";
import {
  Box,
  Button,
  Container,
  Divider,
  List,
  ListItemButton,
  ListItemText,
  TextField,
  Typography,
} from "@mui/material";

import {
  getRecommendations,
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

  const [selectedSong, setSelectedSong] = useState<Song | null>(
    null
  );

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
      setRecommendations([]);
      setSelectedSong(null);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setSearchLoading(false);
    }
  };

  const handleSelectSong = async (song: Song) => {
    try {
      setSelectedSong(song);

      //hide search results after a song is selected
      setSongs([]);
      setQuery("");
      
      setRecommendLoading(true);
      setRecommendations([]);

      const results = await getRecommendations(
        song.track_id
      );

      setRecommendations(results);
    } catch (error) {
      console.error(
        "Recommendation request failed:",
        error
      );
    } finally {
      setRecommendLoading(false);
    }
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ mt: 6, mb: 6 }}>
        <Typography variant="h3" gutterBottom>
          Music Recommender
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mb: 3 }}
        >
          Search for a song or artist, then select a song
          to get recommendations.
        </Typography>

        <Box
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
        </Box>

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
                  selected={
                    selectedSong?.track_id ===
                    song.track_id
                  }
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

        {recommendLoading && (
          <Typography sx={{ mt: 4 }}>
            Finding recommendations...
          </Typography>
        )}

        {selectedSong &&
          recommendations.length > 0 && (
            <>
              <Divider sx={{ my: 4 }} />

              <Typography variant="h5">
                Recommended Songs
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mb: 2 }}
              >
                Based on {selectedSong.track_name} by{" "}
                {selectedSong.artist_name}
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
      </Box>
    </Container>
  );
}

export default App;