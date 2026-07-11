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
            "is_read",
            "created_at",
        ]


class ConversationSerializer(serializers.ModelSerializer):
    participants = serializers.StringRelatedField(many=True)

    last_message = serializers.SerializerMethodField()

    unread_count = serializers.SerializerMethodField()

    class Meta:
        model = Conversation
        fields = [
            "id",
            "participants",
            "updated_at",
            "last_message",
            "unread_count",
        ]

    def get_last_message(self, obj):

        message = obj.messages.last()

        if message:
            return MessageSerializer(message).data

        return None

    def get_unread_count(self, obj):

        user = self.context.get("request").user

        return obj.messages.filter(
            is_read=False
        ).exclude(
            sender=user
        ).count()