from django.shortcuts import render

# Create your views here.
from rest_framework import generics
from .models import CustomUser
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from .serializers import (RegisterrSerializer,LoginSerializer,ProfileSerializer,UpdateProfileSerializer, ChangePasswordSerializer, LogoutSerializer, ChatUserSerializer,)
from rest_framework_simplejwt.views import TokenObtainPairView


def accounts_home(request):
    return render(request, "accounts/home.html")

class RegisterView(generics.CreateAPIView):
    queryset = CustomUser.objects.all()
    serializer_class = RegisterrSerializer

class LoginView(TokenObtainPairView):
    serializer_class = LoginSerializer


class ProfileView(APIView):
    permission_classes = [IsAuthenticated]
    def get(self, request):
        serializer = ProfileSerializer(request.user)
        return Response(serializer.data)
    
class ChatUserListView(generics.ListAPIView):

    serializer_class = ChatUserSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            CustomUser.objects
            .exclude(id=self.request.user.id)
            .order_by("full_name")
        )

class UpdateProfileView(generics.UpdateAPIView):
    serializer_class = UpdateProfileSerializer
    permission_classes = [IsAuthenticated]

    def get_object(self):
        return self.request.user

class ChangePasswordView(generics.GenericAPIView):

    serializer_class = ChangePasswordSerializer
    permission_classes = [IsAuthenticated]

    def post(self, request):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        user = request.user

        if not user.check_password(serializer.validated_data["old_password"]):
            return Response(
                {"message": "Old password is incorrect."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(serializer.validated_data["new_password"])
        user.save()

        return Response(
            {"message": "Password changed successfully."}
        )
    

class LogoutView(generics.GenericAPIView):
    serializer_class = LogoutSerializer
    permission_classes = [IsAuthenticated]
    def post(self, request):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(
            {
                "message": "Logout successful."
            },
            status=status.HTTP_200_OK,
        )