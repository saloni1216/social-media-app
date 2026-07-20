from pathlib import Path
from datetime import timedelta
from django.urls import reverse_lazy
from decouple import config, Csv
import os
import cloudinary


BASE_DIR = Path(__file__).resolve().parent.parent


# ===============================
# Security
# ===============================

SECRET_KEY = config("SECRET_KEY")

DEBUG = config("DEBUG", default=False, cast=bool)


ALLOWED_HOSTS = [
    "127.0.0.1",
    "localhost",
]


RENDER_EXTERNAL_HOSTNAME = os.environ.get("RENDER_EXTERNAL_HOSTNAME")

if RENDER_EXTERNAL_HOSTNAME:
    ALLOWED_HOSTS.append(RENDER_EXTERNAL_HOSTNAME)



CORS_ALLOWED_ORIGINS = config(
    "CORS_ALLOWED_ORIGINS",
    cast=Csv(),
)



# ===============================
# Cloudinary
# ===============================

cloudinary.config(
    cloud_name=config("CLOUDINARY_CLOUD_NAME"),
    api_key=config("CLOUDINARY_API_KEY"),
    api_secret=config("CLOUDINARY_API_SECRET"),
    secure=True,
)


CLOUDINARY_STORAGE = {
    "CLOUD_NAME": config("CLOUDINARY_CLOUD_NAME"),
    "API_KEY": config("CLOUDINARY_API_KEY"),
    "API_SECRET": config("CLOUDINARY_API_SECRET"),
}



# ===============================
# Installed Apps
# ===============================

INSTALLED_APPS = [

    # Cloudinary
    "cloudinary",


    # Third Party
    "rest_framework",
    "rest_framework_simplejwt.token_blacklist",
    "corsheaders",
    

    "unfold",
    "unfold.contrib.filters",
    "unfold.contrib.forms",


    # Django
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",


    # Local Apps
    "accounts",
    "posts",
    "likes",
    "comments",
    "chat",
    "notifications.apps.NotificationsConfig",
    "dashboard",
]



# ===============================
# Middleware
# ===============================

MIDDLEWARE = [

    "django.middleware.security.SecurityMiddleware",

    "whitenoise.middleware.WhiteNoiseMiddleware",

    "corsheaders.middleware.CorsMiddleware",

    "django.contrib.sessions.middleware.SessionMiddleware",

    "django.middleware.common.CommonMiddleware",

    "django.middleware.csrf.CsrfViewMiddleware",

    "django.contrib.auth.middleware.AuthenticationMiddleware",

    "django.contrib.messages.middleware.MessageMiddleware",

    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]



ROOT_URLCONF = "config.urls"



# ===============================
# Templates
# ===============================

TEMPLATES = [

    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",

        "DIRS": [
            BASE_DIR / "templates",
        ],

        "APP_DIRS": True,

        "OPTIONS": {

            "context_processors": [

                "django.template.context_processors.request",

                "django.contrib.auth.context_processors.auth",

                "django.contrib.messages.context_processors.messages",

                "dashboard.context_processors.dashboard_stats",
            ],
        },
    },
]



WSGI_APPLICATION = "config.wsgi.application"



# ===============================
# Database
# ===============================

DATABASES = {

    "default": {

        "ENGINE": "django.db.backends.sqlite3",

        "NAME": BASE_DIR / "db.sqlite3",

    }
}



# ===============================
# Password Validation
# ===============================

AUTH_PASSWORD_VALIDATORS = [

    {
        "NAME":
        "django.contrib.auth.password_validation.UserAttributeSimilarityValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.MinimumLengthValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.CommonPasswordValidator",
    },

    {
        "NAME":
        "django.contrib.auth.password_validation.NumericPasswordValidator",
    },

]



# ===============================
# Language
# ===============================

LANGUAGE_CODE = "en-us"

TIME_ZONE = "UTC"

USE_I18N = True

USE_TZ = True



# ===============================
# Static & Media
# ===============================
STATIC_URL = "/static/"

STATIC_ROOT = BASE_DIR / "staticfiles"

STATICFILES_DIRS = [
    BASE_DIR / "static",
]

STATICFILES_STORAGE = "django.contrib.staticfiles.storage.StaticFilesStorage"


MEDIA_URL = "/media/"

MEDIA_ROOT = BASE_DIR / "media"


STORAGES = {
    "default": {
        "BACKEND": "cloudinary_storage.storage.MediaCloudinaryStorage",
    },
    "staticfiles": {
        "BACKEND": "django.contrib.staticfiles.storage.StaticFilesStorage",
    },
}
# ===============================
# Custom User
# ===============================

AUTH_USER_MODEL = "accounts.CustomUser"



# ===============================
# DRF
# ===============================

REST_FRAMEWORK = {


    "DEFAULT_AUTHENTICATION_CLASSES": (

        "rest_framework_simplejwt.authentication.JWTAuthentication",

    ),

}



# ===============================
# JWT
# ===============================

SIMPLE_JWT = {


    "ACCESS_TOKEN_LIFETIME":
    timedelta(minutes=30),


    "REFRESH_TOKEN_LIFETIME":
    timedelta(days=7),


    "ROTATE_REFRESH_TOKENS":
    False,


    "BLACKLIST_AFTER_ROTATION":
    True,

}



# ===============================
# Unfold Admin
# ===============================

UNFOLD = {

    "SITE_TITLE": "Socialize Admin",

    "SITE_HEADER": "Socialize",

    "SITE_SUBHEADER": "Social Media Management",

    "SITE_SYMBOL": "groups",

    "SHOW_HISTORY": True,

    "SHOW_VIEW_ON_SITE": False,

}



DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"