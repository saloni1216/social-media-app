from urllib.parse import parse_qs

from channels.db import database_sync_to_async
from rest_framework_simplejwt.tokens import AccessToken

from accounts.models import CustomUser


@database_sync_to_async
def get_user(token):
    try:
        access = AccessToken(token)
        user = CustomUser.objects.get(id=access["user_id"])
        return user
    except Exception:
        return None


class JwtAuthMiddleware:

    def __init__(self, inner):
        self.inner = inner

    async def __call__(self, scope, receive, send):

        query_string = scope["query_string"].decode()

        params = parse_qs(query_string)

        token = params.get("token")

        if token:
            scope["user"] = await get_user(token[0])

        else:
            scope["user"] = None

        return await self.inner(scope, receive, send)