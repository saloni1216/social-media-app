from rest_framework import generics
from rest_framework.permissions import IsAuthenticated

from .models import PostModel
from .serializers import PostSerializer


class CreatePostView(generics.CreateAPIView):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)


class PostListView(generics.ListAPIView):
    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        return (
            PostModel.objects
            .select_related("user")
            .prefetch_related("likes")
            .order_by("-created_at")
        )

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context["request"] = self.request
        return context


class PostDetailView(generics.RetrieveAPIView):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    queryset = PostModel.objects.all()


class UpdatePostView(generics.UpdateAPIView):

    serializer_class = PostSerializer
    permission_classes = [IsAuthenticated]
    queryset = PostModel.objects.all()

    def get_queryset(self):
        return PostModel.objects.filter(user=self.request.user)

class DeletePostView(generics.DestroyAPIView):

    permission_classes = [IsAuthenticated]
    queryset = PostModel.objects.all()

    def get_queryset(self):
        return PostModel.objects.filter(user=self.request.user)