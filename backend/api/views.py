from django.shortcuts import render
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status

from drf_spectacular.utils import (
    extend_schema,
    OpenApiParameter,
    OpenApiResponse,
)

from recommender.runtime_recommend import runtime_recommend
from recommender.load import runtime_metadata

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

    #put popular songs first in search
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