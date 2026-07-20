from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate


class RegisterrSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "email",
            "full_name",
            "password",
        )

    def create(self, validated_data):
        email = validated_data["email"]
        username = email.split("@")[0]

        # Ensure username is unique
        base_username = username
        count = 1

        while CustomUser.objects.filter(username=username).exists():
            username = f"{base_username}{count}"
            count += 1

        user = CustomUser.objects.create_user(
            username=username,
            email=email,
            full_name=validated_data["full_name"],
            password=validated_data["password"],
        )

        return user


class ProfileSerializer(serializers.ModelSerializer):
    profile_picture = serializers.SerializerMethodField()
    cover_photo = serializers.SerializerMethodField()

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "username",
            "email",
            "full_name",
            "bio",
            "website",
            "location",
            "gender",
            "date_of_birth",
            "profile_picture",
            "cover_photo",
            "is_verified",
            "is_private",
        )

    def get_profile_picture(self, obj):
        request = self.context.get("request")
        if obj.profile_picture:
            if request:
                return request.build_absolute_uri(obj.profile_picture.url)
            return obj.profile_picture.url
        return None

    def get_cover_photo(self, obj):
        request = self.context.get("request")
        if obj.cover_photo:
            if request:
                return request.build_absolute_uri(obj.cover_photo.url)
            return obj.cover_photo.url
        return None


class LoginSerializer(TokenObtainPairSerializer):

    email = serializers.EmailField(write_only=True)
    password = serializers.CharField(write_only=True)

    username_field = "email"

    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)

        token["username"] = user.username
        token["email"] = user.email
        token["full_name"] = user.full_name

        return token

    def validate(self, attrs):

        email = attrs.get("email")
        password = attrs.get("password")

        try:
            db_user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        user = authenticate(
            username=db_user.username,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        refresh = self.get_token(user)

        request = self.context.get("request")

        # Return complete profile
        profile_data = ProfileSerializer(
            user,
            context={"request": request},
        ).data

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Login Successful",
            "user": profile_data,
        }


class ChatUserSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = (
            "id",
            "full_name",
            "username",
            "profile_picture",
            "is_verified",
        )


class UpdateProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        fields = (
            "full_name",
            "username",
            "bio",
            "website",
            "location",
            "gender",
            "date_of_birth",
            "profile_picture",
            "cover_photo",
            "is_private",
        )


class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )

    new_password = serializers.CharField(
        write_only=True,
        style={"input_type": "password"},
    )


class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()

    def save(self):
        token = RefreshToken(self.validated_data["refresh"])
        token.blacklist()