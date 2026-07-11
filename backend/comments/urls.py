from django.urls import path

from .views import (
    CommentCreateView,
    CommentListView,
    CommentUpdateView,
    CommentDeleteView,
)

urlpatterns = [

    path("", CommentCreateView.as_view(), name="create-comment"),
    path("post/<int:post_id>/", CommentListView.as_view(), name="post-comments"),
    path("<int:pk>/update/", CommentUpdateView.as_view(), name="update-comment"),
    path("<int:pk>/delete/", CommentDeleteView.as_view(), name="delete-comment"),
]