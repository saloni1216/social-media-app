from rest_framework import serializers

from .models import Comment


class CommentSerializer(serializers.ModelSerializer):

    username = serializers.CharField(
        source="user.username",
        read_only=True,
    )

    full_name = serializers.CharField(
        source="user.full_name",
        read_only=True,
    )

    profile_picture = serializers.ImageField(
        source="user.profile_picture",
        read_only=True,
    )

    class Meta:
        model = Comment

        fields = (
            "id",
            "user",
            "username",
            "full_name",
            "profile_picture",
            "post",
            "comment",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
        )