from pathlib import Path
import json
import joblib
import numpy as np
import pandas as pd


BASE_DIR = Path(__file__).resolve().parent.parent

MODEL_DIR = BASE_DIR / "models" / "content_based"

# ==========================================
# load saved model artifacts
# ==========================================

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


# ==========================================
# set genre families
# ==========================================

runtime_genre_families = {
    family: set(genres)
    for family, genres
    in runtime_config["genre_families"].items()
}

# ==========================================
# make track lookup dictionary
# ==========================================

runtime_track_lookup = {
    track_id: idx
    for idx, track_id
    in enumerate(
        runtime_metadata["track_id"].to_numpy()
    )
}

# ==========================================
# checker
# ==========================================

# print("Model artifacts loaded successfully.")
# print("Feature matrix:", runtime_X.shape)
# print("Metadata:", runtime_metadata.shape)
# print("Popularity:", runtime_popularity.shape)
# print(
#     "Genre families:",
#     list(runtime_genre_families.keys())
# )
# print(
#     "Track lookup entries:",
#     len(runtime_track_lookup)
# )