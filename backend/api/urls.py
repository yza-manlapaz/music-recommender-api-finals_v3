from django.urls import path

from .views import recommend_song, search_songs

urlpatterns = [
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