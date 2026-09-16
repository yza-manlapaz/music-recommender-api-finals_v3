import axios from "axios";

const API_BASE_URL = "http://127.0.0.1:8000/api";

export interface Song {
  track_id: string;
  track_name: string;
  artist_name: string;
  genre: string;
  popularity: number;
}

interface SearchResponse {
  query: string;
  results: Song[];
}

export async function searchSongs(query: string): Promise<Song[]> {
  const response = await axios.get<SearchResponse>(
    `${API_BASE_URL}/search/`,
    {
      params: {
        q: query,
      },
    }
  );

  return response.data.results;
}

export interface Recommendation extends Song {
    audio_distance: number;
    final_score: number;
}

interface RecommendationResponse {
  query_track_id: string;
  recommendations: Recommendation[];
}

export async function getRecommendations(
  trackId: string
): Promise<Recommendation[]> {
  const response = await axios.get<RecommendationResponse>(
    `${API_BASE_URL}/recommend/${trackId}/`
  );

  return response.data.recommendations;
}

export interface BatchRecommendationResponse {
  selected_tracks: Song[];
  recommendations: Recommendation[];
}

export async function getBatchRecommendations(
  trackIds: string[]
): Promise<BatchRecommendationResponse> {
  const response = await axios.post<BatchRecommendationResponse>(
    `${API_BASE_URL}/recommend/batch/`,
    {
      track_ids: trackIds,
    }
  );

  return response.data;
}