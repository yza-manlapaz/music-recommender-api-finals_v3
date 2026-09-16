from django.urls import path

from .views import (
    recommend_song,
    recommend_batch,
    search_songs,
)

urlpatterns = [
    path(
        "recommend/batch/",
        recommend_batch,
        name="recommend-batch",
    ),
    
    path(
        "recommend/<str:track_id>/",
        recommend_song,
        name="recommend-song",
    ),

    path(
        "search/",
        search_songs,
        name="search-songs",
    ),

]