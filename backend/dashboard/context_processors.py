from django.contrib.auth import get_user_model

from posts.models import PostModel
from likes.models import Like
from comments.models import Comment
from notifications.models import Notification

User = get_user_model()


def dashboard_stats(request):
    return {
        "total_users": User.objects.count(),
        "total_posts": PostModel.objects.count(),
        "total_likes": Like.objects.count(),
        "total_comments": Comment.objects.count(),
        "total_notifications": Notification.objects.count(),

        "recent_users": User.objects.order_by("-date_joined")[:5],
        "recent_posts": PostModel.objects.select_related("user").order_by("-created_at")[:5],
        "recent_notifications": Notification.objects.select_related(
            "sender",
            "receiver"
        ).order_by("-created_at")[:5],
    }