from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models" / "content_based"


runtime_scaler = joblib.load(
    MODEL_DIR / "continuous_scaler.pkl"
)

runtime_X = np.load(
    MODEL_DIR / "X_continuous.npy"
)

runtime_popularity = np.load(
    MODEL_DIR / "popularity_normalized.npy"
)

runtime_metadata = pd.read_pickle(
    MODEL_DIR / "song_metadata.pkl"
)

with open(
    MODEL_DIR / "model_config.json",
    "r",
    encoding="utf-8"
) as file:
    runtime_config = json.load(file)


runtime_genre_families = {
    family: set(genres)
    for family, genres
    in runtime_config["genre_families"].items()
}


runtime_track_lookup = {
    track_id: idx
    for idx, track_id
    in enumerate(
        runtime_metadata["track_id"].to_numpy()
    )
}
