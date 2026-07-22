from rest_framework import serializers

from .models import Conversation, Message


class MessageSerializer(serializers.ModelSerializer):
    sender = serializers.StringRelatedField()

    class Meta:
        model = Message
        fields = [
            "id",
            "sender",
            "text",
            "created_at",
            "is_delivered",
            "is_read",
            "delivered_at",
            "read_at",
            "is_deleted",
            "deleted_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):

    other_user = serializers.SerializerMethodField()

    last_message = serializers.SerializerMethodField()

    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "other_user",
            "updated_at",
            "last_message",
            "unread_count",
        ]

    def get_other_user(self, obj):

        request = self.context.get("request")

        if not request:
            return None

        user = obj.participants.exclude(
            id=request.user.id
        ).first()

        if not user:
            return None

        return {
            "id": user.id,
            "full_name": user.full_name,
            "username": user.username,
            "profile_picture": (
                user.profile_picture.url
                if user.profile_picture
                else None
            ),
            "is_verified": user.is_verified,
            "is_online": user.is_online,
            "last_seen": user.last_seen,
        }

    def get_last_message(self, obj):

        message = obj.messages.last()

        if message:
            return MessageSerializer(message).data

        return None

    def get_unread_count(self, obj):

        request = self.context.get("request")

        if not request:
            return 0

        return obj.messages.filter(
            is_read=False
        ).exclude(
            sender=request.user
        ).count()