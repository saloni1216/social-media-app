from django.contrib import admin
from django.urls import path

from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from .views import api_home,home
from rest_framework_simplejwt.views import TokenRefreshView



urlpatterns = [
    path("", home, name="home"),
    path("admin/", admin.site.urls),
    path("api/", api_home),
    path("api/accounts/", include("accounts.urls")),
    path("api/accounts/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/posts/", include("posts.urls")),
    path("api/likes/", include("likes.urls")),
    path("api/comments/", include("comments.urls")),
    path("api/notifications/", include("notifications.urls")),
    path("api/chat/", include("chat.urls")),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)