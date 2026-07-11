from django.db import models

from accounts.models import CustomUser
from posts.models import PostModel


class Comment(models.Model):

    user = models.ForeignKey(
        CustomUser,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    post = models.ForeignKey(
        PostModel,
        on_delete=models.CASCADE,
        related_name="comments"
    )

    comment = models.TextField(
        max_length=500
    )

    created_at = models.DateTimeField(
        auto_now_add=True
    )

    updated_at = models.DateTimeField(
        auto_now=True
    )

    class Meta:
        ordering = ["-created_at"]

    class Meta:
        verbose_name = "Comment"
        verbose_name_plural = "Comments"

    def __str__(self):
        return f"{self.user.username} commented on Post {self.post.id}"