from django.contrib import admin
from django.utils.html import format_html

from .models import PostModel


@admin.register(PostModel)
class PostAdmin(admin.ModelAdmin):

    def image_preview(self, obj):
        if obj.image:
            return format_html(
                '<img src="{}" width="70" height="70" style="border-radius:10px; object-fit:cover;" />',
                obj.image.url
            )
        return "No Image"

    image_preview.short_description = "Preview"

    def short_caption(self, obj):
        if obj.caption:
            return obj.caption[:40] + "..." if len(obj.caption) > 40 else obj.caption
        return "-"

    short_caption.short_description = "Caption"

    def likes_count(self, obj):
        return obj.likes.count()

    likes_count.short_description = "❤️ Likes"

    list_display = (
        "image_preview",
        "id",
        "user",
        "short_caption",
        "likes_count",
        "created_at",
    )

    search_fields = (
        "user__username",
        "caption",
    )

    list_filter = (
        "created_at",
    )

    ordering = (
        "-created_at",
    )

    readonly_fields = (
        "image_preview",
        "created_at",
        "updated_at",
    )

    fieldsets = (
        (
            "Post Information",
            {
                "fields": (
                    "user",
                    "image",
                    "image_preview",
                    "caption",
                )
            },
        ),
        (
            "System Information",
            {
                "fields": (
                    "created_at",
                    "updated_at",
                )
            },
        ),
    )

    list_per_page = 10