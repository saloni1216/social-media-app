from django.urls import path

from .views import (
    ConversationListView,
    ConversationMessagesView,
    DeleteConversationView,
    DeleteMessageView,
    MarkMessagesReadView,
    SendMessageView,
    StartConversationView,
)

urlpatterns = [
    path("", ConversationListView.as_view()),
    path("start/", StartConversationView.as_view()),
    path("send/", SendMessageView.as_view()),

    path(
        "messages/<int:conversation_id>/",
        ConversationMessagesView.as_view(),
    ),

    path(
        "messages/<int:conversation_id>/read/",
        MarkMessagesReadView.as_view(),
    ),

    path(
        "message/<int:message_id>/delete/",
        DeleteMessageView.as_view(),
    ),

    path(
        "<int:conversation_id>/delete/",
        DeleteConversationView.as_view(),
    ),
]