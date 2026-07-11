from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from posts.models import PostModel
from .models import Like


class ToggleLikeView(APIView):

    permission_classes = [IsAuthenticated]

    def post(self, request, post_id):

        try:
            post = PostModel.objects.get(id=post_id)

        except PostModel.DoesNotExist:

            return Response(
                {
                    "message": "Post not found."
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        like = Like.objects.filter(
            user=request.user,
            post=post
        )

        if like.exists():

            like.delete()

            return Response(
                {
                    "liked": False,
                    "message": "Post unliked."
                }
            )

        Like.objects.create(
            user=request.user,
            post=post,
        )

        return Response(
            {
                "liked": True,
                "message": "Post liked."
            }
        )