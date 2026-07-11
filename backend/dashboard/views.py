from django.contrib.admin.views.decorators import staff_member_required
from django.contrib.auth import get_user_model
from django.shortcuts import render

from posts.models import PostModel
from likes.models import Like
from comments.models import Comment
from notifications.models import Notification


User = get_user_model()


@staff_member_required
def dashboard(request):

    context = {
        "users": User.objects.count(),
        "posts": PostModel.objects.count(),
        "likes": Like.objects.count(),
        "comments": Comment.objects.count(),
        "notifications": Notification.objects.count(),

        "recent_users": User.objects.order_by("-date_joined")[:5],
        "recent_posts": PostModel.objects.order_by("-created_at")[:5],
        "recent_notifications": Notification.objects.order_by("-created_at")[:5],
    }

    return render(request, "admin/dashboard.html", context)