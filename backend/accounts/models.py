from django.db import models
from django.contrib.auth.models import AbstractUser

class CustomUser(AbstractUser):
    full_name = models.CharField(max_length=150)
    bio = models.TextField(blank=True)
    profile_picture = models.ImageField(
        upload_to="profile_pictures/",
        blank=True,
        null=True
    )

    cover_photo = models.ImageField(
        upload_to="cover_photos/",
        blank=True,
        null=True
    )

    website = models.URLField(blank=True)
    location = models.CharField(max_length=100, blank=True)

    GENDER_CHOICES = [
        ("Male", "Male"),
        ("Female", "Female"),
        ("Other", "Other"),
    ]

    gender = models.CharField(
        max_length=10,
        choices=GENDER_CHOICES,
        blank=True
    )

    is_online = models.BooleanField(default=False)
    last_seen = models.DateTimeField(
        null=True,
        blank=True,
        )

    date_of_birth = models.DateField(blank=True, null=True)

    is_verified = models.BooleanField(default=False)
    is_private = models.BooleanField(default=False)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)


    def __str__(self):
        return self.username