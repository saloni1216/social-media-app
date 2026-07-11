from django.contrib import admin

from .models import Conversation, Message


@admin.register(Conversation)
class ConversationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "participants_list",
        "updated_at",
    )

    readonly_fields = (
        "created_at",
        "updated_at",
    )

    def participants_list(self, obj):
        return ", ".join(
            obj.participants.values_list(
                "username",
                flat=True
            )
        )

    participants_list.short_description = "Participants"


@admin.register(Message)
class MessageAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "conversation",
        "sender",
        "short_text",
        "is_read",
        "created_at",
    )

    list_filter = (
        "is_read",
    )

    search_fields = (
        "sender__username",
        "text",
    )

    readonly_fields = (
        "created_at",
    )

    def short_text(self, obj):
        return obj.text[:50]

    short_text.short_description = "Message"