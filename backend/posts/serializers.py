from rest_framework import serializers
from .models import PostModel


class PostSerializer(serializers.ModelSerializer):

    likes_count = serializers.SerializerMethodField()
    is_liked = serializers.SerializerMethodField()

    class Meta:
        model = PostModel
        fields = (
            "id",
            "user",
            "image",
            "caption",
            "likes_count",
            "is_liked",
            "created_at",
            "updated_at",
        )

        read_only_fields = (
            "id",
            "user",
            "created_at",
            "updated_at",
        )

    def get_likes_count(self, obj):
        return obj.likes.count()

    def get_is_liked(self, obj):

        request = self.context.get("request")

        if request is None:
            return False

        if request.user.is_anonymous:
            return False

        return obj.likes.filter(user=request.user).exists()