from django.urls import path
from .views import RegisterView, accounts_home, LoginView,ProfileView,UpdateProfileView, ChatUserListView, ChangePasswordView, LogoutView

urlpatterns = [
    path("", accounts_home, name="accounts-home"),
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("profile/", ProfileView.as_view(), name="profile"),
    path("update/", UpdateProfileView.as_view(), name="updateprofile"),
    path("users/", ChatUserListView.as_view(), name="chat-users"),
    path("change-password/", ChangePasswordView.as_view(), name="change-password"),
    path("logout/", LogoutView.as_view(), name="logout")

]