from django.urls import path

from .views import (
    StartConversationView, SendMessageView, ConversationListView, ConversationMessagesView, MarkMessagesReadView, DeleteMessageView, DeleteConversationView
)

urlpatterns = [

    path("start/", StartConversationView.as_view(), name="start_convertion"),
    path("send/", SendMessageView.as_view(), name="send_message"),
    path("", ConversationListView.as_view(), name="conversion_list"),
    path("messages/<int:conversation_id>/", ConversationMessagesView.as_view(), name="conversation-messages"),
    path("read/<int:conversation_id>/", MarkMessagesReadView.as_view(), name="mark-messages-read"),
    path("message/delete/<int:message_id>/", DeleteMessageView.as_view(), name="delete-message"),
    path("conversation/delete/<int:conversation_id>/", DeleteConversationView.as_view(),name="delete-conversation",
),


]