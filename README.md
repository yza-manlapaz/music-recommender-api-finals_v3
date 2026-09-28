# Music Recommendation System

A content-based music recommendation web application built with Django REST Framework and React.

The system allows users to search for songs or artists and receive recommended songs based on audio-feature similarity, genre compatibility, key, mode, and popularity reranking.

## Features

* Search songs by track title or artist
* Retrieve up to 20 search results
* Generate 10 recommendations for a selected song
* Genre-aware candidate filtering
* Audio-feature similarity using Euclidean distance
* Key and mode adjustment
* Popularity reranking
* Django REST API
* Swagger/OpenAPI documentation
* React + TypeScript frontend
* Material UI interface
* No user login required

## Recommendation Model

The final recommender is a genre-aware content-based recommendation model.

The recommendation pipeline is:

```text
Selected Song
    ↓
Genre-Compatible Candidate Generation
    ↓
Audio Feature Similarity
    ↓
Key and Mode Adjustment
    ↓
Popularity Reranking
    ↓
Top 10 Recommendations
```

The model uses the following standardized audio features:

```text
danceability
energy
loudness
speechiness
acousticness
instrumentalness
liveness
valence
tempo
```

The main ranking formula is:

```text
Final Score =
Audio Distance
+ 0.05 × Key Distance
+ 0.05 × Mode Difference
- 0.30 × Normalized Popularity
```

Lower scores are considered better.

Popularity is used only as a reranking signal and is not treated as a measure of musical similarity.

## Tech Stack

### Backend

* Python 3.10
* Django
* Django REST Framework
* drf-spectacular
* NumPy
* pandas
* scikit-learn
* joblib
* django-cors-headers
* SQLite

### Frontend

* React
* TypeScript
* Vite
* Material UI
* Axios

## Project Structure

```text
Final Project_v3/
│
├── backend/
│   ├── api/
│   │   ├── migrations/
│   │   ├── urls.py
│   │   └── views.py
│   │
│   ├── config/
│   │   ├── settings.py
│   │   ├── urls.py
│   │   └── ...
│   │
│   ├── models/
│   │   └── content_based/
│   │       ├── model_config.json
│   │       ├── continuous_scaler.pkl
│   │       ├── X_continuous.npy
│   │       ├── popularity_normalized.npy
│   │       └── song_metadata.pkl
│   │
│   ├── recommender/
│   │   ├── __init__.py
│   │   ├── load.py
│   │   └── runtime_recommend.py
│   │
│   ├── manage.py
│   └── db.sqlite3
│
├── frontend/
│   ├── src/
│   │   ├── api/
│   │   │   └── musicApi.ts
│   │   ├── App.tsx
│   │   └── ...
│   │
│   ├── package.json
│   └── vite.config.ts
│
├── requirements.txt
├── .gitignore
└── README.md
```

## Model Artifacts

The following model artefacts are required for the recommender to run:

```text
backend/models/content_based/
├── continuous_scaler.pkl
├── X_continuous.npy
├── popularity_normalized.npy
├── song_metadata.pkl
└── model_config.json
```


## Backend Setup

Clone the repository:

```bash
git clone https://github.com/yza-manlapaz/music-recommender-api-finals
cd <repository-folder>
```

Create a Python virtual environment:

```bash
python -m venv venv
```

Activate it on Windows Git Bash:

```bash
source venv/Scripts/activate
```

Or:

```bash
venv/Scripts/activate
```

Install the Python dependencies:

```bash
pip install -r requirements.txt
```

Move into the backend directory:

```bash
cd backend
```

Apply Django migrations:

```bash
python manage.py migrate
```

Start the Django development server:

```bash
python manage.py runserver
```

The backend will normally run at:

```text
http://127.0.0.1:8000/
```

## Swagger API Documentation

Swagger UI is available at:

```text
http://127.0.0.1:8000/
```

The OpenAPI schema is available at:

```text
http://127.0.0.1:8000/api/schema/
```

## API Endpoints

### Search Songs

```http
GET /api/search/?q=<query>
```

Example:

```text
http://127.0.0.1:8000/api/search/?q=Adele
```

The endpoint searches track names and artist names and returns up to 20 results ordered by popularity.

Example response:

```json
{
  "query": "Adele",
  "results": [
    {
      "track_id": "example_track_id",
      "track_name": "Example Song",
      "artist_name": "Adele",
      "genre": "pop",
      "popularity": 80
    }
  ]
}
```

### Recommend Songs

```http
GET /api/recommend/<track_id>/
```

Example:

```text
http://127.0.0.1:8000/api/recommend/7qiZfU4dY1lWllzX7mPBI3/
```

The endpoint returns the top 10 recommendations for the selected song.

Example response:

```json
{
  "query_track_id": "7qiZfU4dY1lWllzX7mPBI3",
  "recommendations": [
    {
      "track_id": "example_track_id",
      "track_name": "Recommended Song",
      "artist_name": "Artist",
      "genre": "pop",
      "popularity": 70,
      "audio_distance": 0.65,
      "final_score": 0.48
    }
  ]
}
```

If the track ID does not exist:

```json
{
  "detail": "Track not found."
}
```

The API returns HTTP status `404`.

## Frontend Setup

Open a second terminal and move into the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will normally run at:

```text
http://localhost:5173/
```

Both the Django backend and React frontend must be running at the same time.

## Application Flow

```text
User searches for a song or artist
        ↓
React sends request to Django
        ↓
GET /api/search/?q=...
        ↓
User selects a song
        ↓
React sends selected track ID
        ↓
GET /api/recommend/<track_id>/
        ↓
Recommendation model calculates scores
        ↓
Top 10 recommendations displayed
```

## Dataset

The project uses a Spotify music dataset containing approximately 1.16 million tracks.

The original dataset is not included in this GitHub repository because of its large file size.

The recommendation system uses song metadata and audio characteristics including:

* Track name
* Artist name
* Spotify track ID
* Genre
* Popularity
* Key
* Mode
* Danceability
* Energy
* Loudness
* Speechiness
* Acousticness
* Instrumentalness
* Liveness
* Valence
* Tempo

## Evaluation

The final recommendation model was compared with an audio-only Euclidean-distance baseline.

### Audio-Only Baseline

* Mean audio distance: `0.4532`
* Median audio distance: `0.4049`
* Mean recommended popularity: `17.68`
* Exact genre match rate: `12.70%`
* Same-artist recommendation rate: `1.40%`

### Final Model

* Mean audio distance: `0.6406`
* Median audio distance: `0.5682`
* Mean recommended popularity: `24.45`
* Exact genre match rate: `72.10%`
* Genre compatibility rate: `100%`
* Same-artist recommendation rate: `4.70%`

The final model intentionally sacrifices some pure audio-feature proximity in exchange for stronger genre consistency and more familiar recommendations.

The 100% genre compatibility rate is a consequence of genre-based candidate filtering and should not be interpreted as prediction accuracy.

## Notes

This project is a content-based recommendation system.

It does not use user listening histories, ratings, or collaborative filtering data.

Recommendations therefore represent similarity according to the selected audio features, genre compatibility, key, mode, and popularity reranking rather than personalized user preference predictions.

## Development

Backend:

```bash
cd backend
python manage.py runserver
```

Frontend:

```bash
cd frontend
npm run dev
```

## License

This project was created for educational purposes.
