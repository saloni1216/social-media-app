from rest_framework import serializers

from .models import Notification


class NotificationSerializer(serializers.ModelSerializer):

    sender_username = serializers.CharField(
        source="sender.username",
        read_only=True,
    )

    sender_full_name = serializers.CharField(
        source="sender.full_name",
        read_only=True,
    )

    sender_profile_picture = serializers.ImageField(
        source="sender.profile_picture",
        read_only=True,
    )

    class Meta:
        model = Notification

        fields = (
            "id",
            "sender",
            "sender_username",
            "sender_full_name",
            "sender_profile_picture",
            "receiver",
            "post",
            "notification_type",
            "is_read",
            "created_at",
        )

        read_only_fields = (
            "id",
            "sender",
            "receiver",
            "created_at",
        )