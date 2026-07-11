from django.db.models.signals import post_save
from django.dispatch import receiver

from likes.models import Like
from comments.models import Comment

from .models import Notification


@receiver(post_save, sender=Like)
def create_like_notification(sender, instance, created, **kwargs):

    if not created:
        return

    if instance.user == instance.post.user:
        return

    Notification.objects.get_or_create(
        sender=instance.user,
        receiver=instance.post.user,
        post=instance.post,
        notification_type="like",
    )


@receiver(post_save, sender=Comment)
def create_comment_notification(sender, instance, created, **kwargs):

    if not created:
        return

    if instance.user == instance.post.user:
        return

    Notification.objects.create(
        sender=instance.user,
        receiver=instance.post.user,
        post=instance.post,
        notification_type="comment",
    )