from django.urls import path
from .views import CreatePostView, PostListView, PostDetailView, UpdatePostView, DeletePostView

urlpatterns = [
    path("", PostListView.as_view(), name="post-list"),
    path("create/", CreatePostView.as_view(), name="create-post"),
    path("<int:pk>/", PostDetailView.as_view(), name="post-detail"),
    path("<int:pk>/update/", UpdatePostView.as_view(), name="update-post"),
    path("<int:pk>/delete/", DeletePostView.as_view(), name="delete-post"),
]