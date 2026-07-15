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
            user = CustomUser.objects.get(email=email)
        except CustomUser.DoesNotExist:
            raise serializers.ValidationError("Invalid email or password.")

        user = authenticate(
            username=user.username,
            password=password,
        )

        if user is None:
            raise serializers.ValidationError("Invalid email or password.")

        refresh = self.get_token(user)

        return {
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "message": "Login Successful",
            "user": {
                "id": user.id,
                "username": user.username,
                "email": user.email,
                "full_name": user.full_name,
                "is_verified": user.is_verified,
                "profile_picture": user.profile_picture.url if user.profile_picture else None,
            },
        }
    

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = (
            "username",
            "password",
            "groups",
            "user_permissions",
        )

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
    old_password = serializers.CharField(write_only=True,  style={"input_type": "password"} )
    new_password = serializers.CharField(write_only=True,  style={"input_type": "password"})

class LogoutSerializer(serializers.Serializer):
    refresh = serializers.CharField()
    def save(self):
        token = RefreshToken(self.validated_data["refresh"])
        token.blacklist()