from rest_framework import serializers
from .models import CustomUser
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterrSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = CustomUser
        fields = (
            "username",
            "email",
            "full_name",
            "password",
        )

    def create(self, validated_data):
        user = CustomUser.objects.create_user(
            username=validated_data["username"],
            email=validated_data["email"],
            full_name=validated_data["full_name"],
            password=validated_data["password"],
        )
        return user
    
class LoginSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token["username"] = user.username
        token["email"] = user.email
        token["full_name"] = user.full_name
        return token

    def validate(self, attrs):
        data = super().validate(attrs)
        data["message"] = "Login Successful"
        data["user"] = {
                "id": self.user.id,
                "username": self.user.username,
                "email": self.user.email,
                "full_name": self.user.full_name,
                "is_verified": self.user.is_verified,
                "profile_picture": self.user.profile_picture.url if self.user.profile_picture else None,
        }
        return data
    

class ProfileSerializer(serializers.ModelSerializer):

    class Meta:
        model = CustomUser
        exclude = (
            "password",
            "groups",
            "user_permissions",
        )

class UpdateProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = CustomUser
        fields = (
            "full_name",
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