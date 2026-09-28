import numpy as np

from recommender.load import (
    runtime_metadata,
    runtime_X,
    runtime_popularity,
    runtime_config,
    runtime_genre_families,
    runtime_track_lookup,
)


def runtime_recommend(track_id, top_n=10):
    
    song_idx = runtime_track_lookup.get(track_id)

    if song_idx is None:
        return None

    query_row = runtime_metadata.iloc[song_idx]

    query_genre = query_row["genre"]
    query_key = int(query_row["key"])
    query_mode = int(query_row["mode"])

    query_title = str(query_row["track_name"]).strip().lower()
    query_artist = str(query_row["artist_name"]).strip().lower()


    compatible_genres = {query_genre}

    for genres in runtime_genre_families.values():
        if query_genre in genres:
            compatible_genres.update(genres)


    genre_array = runtime_metadata["genre"].to_numpy()

    candidate_indices = np.flatnonzero(
        np.isin(
            genre_array,
            list(compatible_genres),
        )
    )


    candidate_indices = candidate_indices[
        candidate_indices != song_idx
    ]

    candidate_metadata = runtime_metadata.iloc[
        candidate_indices
    ]

    normalized_titles = (
        candidate_metadata["track_name"]
        .astype(str)
        .str.strip()
        .str.lower()
        .to_numpy()
    )

    normalized_artists = (
        candidate_metadata["artist_name"]
        .astype(str)
        .str.strip()
        .str.lower()
        .to_numpy()
    )

    duplicate_mask = (
        (normalized_titles == query_title)
        &
        (normalized_artists == query_artist)
    )

    candidate_indices = candidate_indices[
        ~duplicate_mask
    ]


    query_vector = runtime_X[song_idx]

    candidate_vectors = runtime_X[
        candidate_indices
    ]

    audio_distance = np.linalg.norm(
        candidate_vectors - query_vector,
        axis=1,
    )


    candidate_keys = (
        runtime_metadata.iloc[candidate_indices]["key"]
        .to_numpy(dtype=np.float32)
    )

    query_angle = (
        2 * np.pi * query_key / 12
    )

    candidate_angles = (
        2 * np.pi * candidate_keys / 12
    )

    raw_key_distance = np.sqrt(
        (
            np.sin(candidate_angles)
            - np.sin(query_angle)
        ) ** 2
        +
        (
            np.cos(candidate_angles)
            - np.cos(query_angle)
        ) ** 2
    )

    key_distance = raw_key_distance / 2.0

    candidate_modes = (
        runtime_metadata.iloc[candidate_indices]["mode"]
        .to_numpy(dtype=np.float32)
    )

    mode_difference = np.abs(
        candidate_modes - query_mode
    )

  
    weights = runtime_config["weights"]

    key_weight = weights["key_weight"]
    mode_weight = weights["mode_weight"]
    popularity_weight = weights["popularity_weight"]


    music_distance = (
        audio_distance
        + key_weight * key_distance
        + mode_weight * mode_difference
    )

  
    candidate_popularity = runtime_popularity[
        candidate_indices
    ]

    popularity_bonus = (
        popularity_weight
        * candidate_popularity
    )

    final_score = (
        music_distance
        - popularity_bonus
    )


    number_to_return = min(
        top_n,
        len(candidate_indices),
    )

    if number_to_return == 0:
        return runtime_metadata.iloc[[]].copy()

    top_positions = np.argpartition(
        final_score,
        number_to_return - 1,
    )[:number_to_return]

   
    top_positions = top_positions[
        np.argsort(
            final_score[top_positions]
        )
    ]

    top_indices = candidate_indices[
        top_positions
    ]

   
    results = runtime_metadata.iloc[
        top_indices
    ].copy()

    results["audio_distance"] = (
        audio_distance[top_positions]
    )

    results["key_distance"] = (
        key_distance[top_positions]
    )

    results["mode_difference"] = (
        mode_difference[top_positions]
    )

    results["final_score"] = (
        final_score[top_positions]
    )

    return results


def runtime_recommend_batch(track_ids, top_n=10):

  
    if not track_ids or len(track_ids) > 10:
        return None

   
    selected_indices = []

    for track_id in track_ids:
        song_idx = runtime_track_lookup.get(track_id)

        if song_idx is None:
            return None

        selected_indices.append(song_idx)

   
    selected_indices = list(dict.fromkeys(selected_indices))

 
    selected_vectors = runtime_X[selected_indices]

 
    query_vector = np.mean(
        selected_vectors,
        axis=0,
    )

    compatible_genres = set()

    for song_idx in selected_indices:

        query_genre = runtime_metadata.iloc[song_idx]["genre"]

        compatible_genres.add(query_genre)

        for genres in runtime_genre_families.values():
            if query_genre in genres:
                compatible_genres.update(genres)


    genre_array = runtime_metadata["genre"].to_numpy()

    candidate_indices = np.flatnonzero(
        np.isin(
            genre_array,
            list(compatible_genres),
        )
    )


    candidate_indices = candidate_indices[
        ~np.isin(
            candidate_indices,
            selected_indices,
        )
    ]


    candidate_vectors = runtime_X[
        candidate_indices
    ]

    audio_distance = np.linalg.norm(
        candidate_vectors - query_vector,
        axis=1,
    )

 
    candidate_popularity = runtime_popularity[
        candidate_indices
    ]

 
    popularity_weight = runtime_config[
        "weights"
    ]["popularity_weight"]

  
    final_score = (
        audio_distance
        - popularity_weight * candidate_popularity
    )


    number_to_return = min(
        top_n,
        len(candidate_indices),
    )

    if number_to_return == 0:
        return runtime_metadata.iloc[[]].copy()

 
    top_positions = np.argpartition(
        final_score,
        number_to_return - 1,
    )[:number_to_return]


    top_positions = top_positions[
        np.argsort(
            final_score[top_positions]
        )
    ]

    top_indices = candidate_indices[
        top_positions
    ]

    results = runtime_metadata.iloc[
        top_indices
    ].copy()

    results["audio_distance"] = (
        audio_distance[top_positions]
    )

    results["final_score"] = (
        final_score[top_positions]
    )

    return results