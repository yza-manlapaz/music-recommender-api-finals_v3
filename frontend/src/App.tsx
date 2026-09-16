import { useState } from "react";

import AppHeader from "./components/AppHeader";
import SearchBar from "./components/SearchBar";
import SearchResults from "./components/SearchResults";
import SelectedSongs from "./components/SelectedSongs";
import RecommendationList from "./components/RecommendationList";

import {
  Box,
  Container,
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
        <AppHeader />

        <SearchBar
          query={query}
          onQueryChange={setQuery}
          onSearch={handleSearch}
          loading={searchLoading}
        />

        <SearchResults
          songs={songs}
          selectedSongs={selectedSongs}
          onSelectSong={handleSelectSong}
        />

        <SelectedSongs
          songs={selectedSongs}
          onRemoveSong={handleRemoveSong}
          onGetRecommendations={handleGetRecommendations}
          loading={recommendLoading}
        />

        <RecommendationList
          recommendations={recommendations}
          selectedCount={selectedSongs.length}
        />
    </Container>
  </Box>
);
}

export default App;