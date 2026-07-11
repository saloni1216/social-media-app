# Register the model in Django Admin

from .forms import CustomUserCreationForm, CustomUserChangeForm
from unfold.admin import ModelAdmin
from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import CustomUser
from django.utils.html import format_html


@admin.register(CustomUser)
class CustomUserAdmin(UserAdmin, ModelAdmin):

    add_form = CustomUserCreationForm
    form = CustomUserChangeForm

    readonly_fields = (
    "created_at",
    "updated_at",
    "last_login",
    "date_joined",
)

    def profile_preview(self, obj):
        if obj.profile_picture:
            return format_html(
            '<img src="{}" width="50" height="50" style="border-radius:50%;" />',
            obj.profile_picture.url
        )
        return "No Image"
    profile_preview.short_description = "Profile"

    list_display = (
        "profile_preview",
        "username",
        "full_name",
        "email",
        "is_verified",
        "is_active",
    )

    search_fields = (
        "username",
        "full_name",
        "email",
    )

    list_filter = (
        "is_verified",
        "is_active",
        "is_private",
        "gender",
    )


    fieldsets = (
    ("Account Information",{
            "fields": (
            "username",
            "password",
            "full_name",
            "email",
        )
    }),

      ("Profile Information", {
        "fields": (
            "bio",
            "profile_picture",
            "cover_photo",
            "website",
            "location",
            "gender",
            "date_of_birth",
        )
    }),




    ("Permissions & Privacy", {
        "fields": (
            "is_verified",
            "is_private",
            "is_active",
            "is_staff",
            "is_superuser",
            "groups",
            "user_permissions",
        )
    }),

     ("System Information", {
        "fields": (
            "last_login",
            "date_joined",
            "created_at",
            "updated_at",
        )
    }),
    



    )

    add_fieldsets = (
    (
        "Create New User",
        {
            "classes": ("wide",),
            "fields": (
                "username",
                "email",
                "full_name",
                "password1",
                "password2",
            ),
        },
    ),
)
    

    list_per_page = 10
    save_on_top = True
    list_display_links = (
    "username",
    )