from django.contrib import admin

from .models import Notification


@admin.register(Notification)
class NotificationAdmin(admin.ModelAdmin):

    list_display = (
        "id",
        "sender",
        "receiver",
        "notification_type",
        "post",
        "is_read",
        "created_at",
    )

    search_fields = (
        "sender__username",
        "receiver__username",
    )

    list_filter = (
        "notification_type",
        "is_read",
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "created_at",
    )

    fieldsets = (
        (
            "Notification Information",
            {
                "fields": (
                    "sender",
                    "receiver",
                    "post",
                    "notification_type",
                    "is_read",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                )
            },
        ),
    )

    list_per_page = 10