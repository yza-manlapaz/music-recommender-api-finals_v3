from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from rapidfuzz import fuzz, process

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

from recommender.runtime_recommend import ( 
    runtime_recommend,
    runtime_recommend_batch,
)

from recommender.load import runtime_metadata

#prep song and artist names for fuzzy search
fuzzy_track_names = (
    runtime_metadata["track_name"]
    .dropna()
    .astype(str)
    .drop_duplicates()
    .tolist()
)

fuzzy_artist_names = (
    runtime_metadata["artist_name"]
    .dropna()
    .astype(str)
    .drop_duplicates()
    .tolist()
)

@extend_schema(
    summary="Recommend songs",
    description=(
        "Returns 10 recommended songs for the given track ID "
        "using the content-based music recommendation model."
    ),
    parameters=[
        OpenApiParameter(
            name="track_id",
            type=str,
            location=OpenApiParameter.PATH,
            description="Spotify track ID of the selected song.",
            required=True,
        ),
    ],
    responses={
        200: OpenApiResponse(
            description="Recommendations returned successfully."
        ),
        404: OpenApiResponse(
            description="Track ID was not found."
        ),
    },
)
@api_view(["GET"])
def recommend_song(request, track_id):
    results = runtime_recommend(
        track_id=track_id,
        top_n=10,
    )

    if results is None:
        return Response(
            {
                "detail": "Track not found."
            },
            status=status.HTTP_404_NOT_FOUND,
        )

    recommendations = []

    for _, row in results.iterrows():
        recommendations.append({
            "track_id": row["track_id"],
            "track_name": row["track_name"],
            "artist_name": row["artist_name"],
            "genre": row["genre"],
            "popularity": int(row["popularity"]),
            "audio_distance": float(
                row["audio_distance"]
            ),
            "final_score": float(
                row["final_score"]
            ),
        })

    return Response({
        "query_track_id": track_id,
        "recommendations": recommendations,
    })


@extend_schema(
    summary="Recommend songs from multiple selections",
    description=(
        "Accepts between 1 and 10 Spotify track IDs and returns "
        "10 recommendations based on the combined audio profile "
        "of the selected songs."
    ),
    request={
        "application/json": {
            "type": "object",
            "properties": {
                "track_ids": {
                    "type": "array",
                    "items": {
                        "type": "string",
                    },
                    "minItems": 1,
                    "maxItems": 10,
                    "description": (
                        "Spotify track IDs of the selected songs."
                    ),
                }
            },
            "required": ["track_ids"],
        }
    },
    responses={
        200: OpenApiResponse(
            description="Recommendations returned successfully."
        ),
        400: OpenApiResponse(
            description="Invalid number or format of track IDs."
        ),
        404: OpenApiResponse(
            description="One or more track IDs were not found."
        ),
    },
)
@api_view(["POST"])
def recommend_batch(request):

    track_ids = request.data.get("track_ids")

    # track_ids must be a list
    if not isinstance(track_ids, list):
        return Response(
            {
                "detail": "track_ids must be a list."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # require between 1 and 10 songs
    if len(track_ids) < 1 or len(track_ids) > 10:
        return Response(
            {
                "detail": (
                    "Please select between 1 and 10 songs."
                )
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    # remove duplicate track IDs
    track_ids = list(dict.fromkeys(track_ids))

    # verify every track exists
    selected_tracks = []

    for track_id in track_ids:

        matches = runtime_metadata[
            runtime_metadata["track_id"] == track_id
        ]

        if matches.empty:
            return Response(
                {
                    "detail": (
                        f"Track not found: {track_id}"
                    )
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        row = matches.iloc[0]

        selected_tracks.append({
            "track_id": row["track_id"],
            "track_name": row["track_name"],
            "artist_name": row["artist_name"],
            "genre": row["genre"],
            "popularity": int(row["popularity"]),
        })

    # generate recommendations
    results = runtime_recommend_batch(
        track_ids=track_ids,
        top_n=10,
    )

    recommendations = []

    for _, row in results.iterrows():
        recommendations.append({
            "track_id": row["track_id"],
            "track_name": row["track_name"],
            "artist_name": row["artist_name"],
            "genre": row["genre"],
            "popularity": int(row["popularity"]),
            "audio_distance": float(
                row["audio_distance"]
            ),
            "final_score": float(
                row["final_score"]
            ),
        })

    return Response({
        "selected_tracks": selected_tracks,
        "recommendations": recommendations,
    })


@extend_schema(
    summary="Search songs",
    description=(
        "Search for songs by track name or artist name. "
        "Returns up to 20 matching songs."
    ),
    parameters=[
        OpenApiParameter(
            name="q",
            type=str,
            location=OpenApiParameter.QUERY,
            description="Song title or artist name.",
            required=True,
        ),
    ],
)
@api_view(["GET"])
def search_songs(request):
    query = request.GET.get("q", "").strip()

    if not query:
        return Response(
            {
                "detail": "Search query is required."
            },
            status=status.HTTP_400_BAD_REQUEST,
        )

    #normal search substring
    matches = runtime_metadata[
        runtime_metadata["track_name"]
        .astype(str)
        .str.contains(
            query,
            case=False,
            na=False,
            regex=False,
        )
        |
        runtime_metadata["artist_name"]
        .astype(str)
        .str.contains(
            query,
            case=False,
            na=False,
            regex=False,
        )
    ].copy()

    #fuzzy search if normal doesnt find anything
    if matches.empty:
        # Fuzzy match song titles
        track_matches = process.extract(
            query,
            fuzzy_track_names,
            scorer=fuzz.ratio,
            limit=20,
            score_cutoff=60,
        )

        # Fuzzy match artist names
        artist_matches = process.extract(
            query,
            fuzzy_artist_names,
            scorer=fuzz.ratio,
            limit=20,
            score_cutoff=60,
        )

        best_track_score = (
            track_matches[0][1]
            if track_matches
            else 0
        )

        best_artist_score = (
            artist_matches[0][1]
            if artist_matches
            else 0
        )

        # Decide whether the query looks more like
        # a song title or an artist name.
        if best_track_score >= best_artist_score:
            # Treat query primarily as a song-title search
            track_scores = {
                result[0]: result[1]
                for result in track_matches
            }

            matched_track_names = list(
                track_scores.keys()
            )

            matches = runtime_metadata[
                runtime_metadata["track_name"].isin(
                    matched_track_names
                )
            ].copy()

            matches["fuzzy_score"] = (
                matches["track_name"]
                .map(track_scores)
                .fillna(0)
            )

        else:
            # Treat query primarily as an artist search
            artist_scores = {
                result[0]: result[1]
                for result in artist_matches
            }

            matched_artist_names = list(
                artist_scores.keys()
            )

            matches = runtime_metadata[
                runtime_metadata["artist_name"].isin(
                    matched_artist_names
                )
            ].copy()

            matches["fuzzy_score"] = (
                matches["artist_name"]
                .map(artist_scores)
                .fillna(0)
            )

        # Similarity is most important.
        # Popularity is only used as a tie-breaker.
        matches = matches.sort_values(
            by=["fuzzy_score", "popularity"],
            ascending=[False, False],
        ).head(20)

    else:
        # Exact/substring searches keep their
        # existing popularity ranking.
        matches = matches.sort_values(
            by="popularity",
            ascending=False,
        ).head(20)

    results = []

    for _, row in matches.iterrows():
        results.append({
            "track_id": row["track_id"],
            "track_name": row["track_name"],
            "artist_name": row["artist_name"],
            "genre": row["genre"],
            "popularity": int(row["popularity"]),
        })

    return Response({
        "query": query,
        "results": results,
    })