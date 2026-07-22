from time import timezone

from django.contrib.auth import get_user_model

from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.views import APIView

from .models import Conversation, Message
from .serializers import ConversationSerializer, MessageSerializer

User = get_user_model()


class StartConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):

        receiver_id = request.data.get("receiver_id")

        if not receiver_id:
            return Response(
                {"error": "receiver_id is required"},
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            receiver = User.objects.get(id=receiver_id)

        except User.DoesNotExist:
            return Response(
                {"error": "User not found"},
                status=status.HTTP_404_NOT_FOUND,
            )

        conversations = Conversation.objects.filter(
            participants=request.user
        )

        for conversation in conversations:

            participants = conversation.participants.all()

            if (
                participants.count() == 2
                and receiver in participants
            ):
                serializer = ConversationSerializer(
                    conversation,
                    context={
                        "request": request
                    }
                )

                return Response(serializer.data)

        conversation = Conversation.objects.create()

        conversation.participants.add(
            request.user,
            receiver,
        )

        serializer = ConversationSerializer(
            conversation,
            context={
                "request": request
            }
        )

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )

class SendMessageView(APIView):
    permission_classes = [IsAuthenticated]
    def post(self, request):
        conversation_id = request.data.get("conversation_id")
        text = request.data.get("text")

        if not conversation_id or not text:
            return Response(
                {
                    "error": "conversation_id and text are required"
                },
                status=status.HTTP_400_BAD_REQUEST,
            )

        try:
            conversation = Conversation.objects.get(
                id=conversation_id
            )

        except Conversation.DoesNotExist:
            return Response(
                {
                    "error": "Conversation not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user not in conversation.participants.all():
            return Response(
                {
                    "error": "You are not part of this conversation"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        message = Message.objects.create(
            conversation=conversation,
            sender=request.user,
            text=text,
        )

        conversation.save()

        serializer = MessageSerializer(message)

        return Response(
            serializer.data,
            status=status.HTTP_201_CREATED,
        )
     
class ConversationListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):

        conversations = (
            Conversation.objects
            .filter(participants=request.user)
            .order_by("-updated_at")
        )

        serializer = ConversationSerializer(
            conversations,
            many=True,
            context={
                "request": request
            }
        )

        return Response(serializer.data)      

class ConversationMessagesView(APIView):

    permission_classes = [IsAuthenticated]

    def get(self, request, conversation_id):

        try:
            conversation = Conversation.objects.get(
                id=conversation_id
            )

        except Conversation.DoesNotExist:
            return Response(
                {
                    "error": "Conversation not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user not in conversation.participants.all():
            return Response(
                {
                    "error": "Access denied"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        messages = (
            Message.objects
            .filter(conversation=conversation)
            .order_by("created_at")
        )

        serializer = MessageSerializer(
            messages,
            many=True
        )

        return Response(serializer.data)
    
class MarkMessagesReadView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request, conversation_id):

        try:
            conversation = Conversation.objects.get(
                id=conversation_id
            )

        except Conversation.DoesNotExist:
            return Response(
                {
                    "error": "Conversation not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user not in conversation.participants.all():
            return Response(
                {
                    "error": "Access denied"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        updated = Message.objects.filter(
            conversation=conversation,
            is_read=False
        ).exclude(
            sender=request.user
        ).update(
            is_read=True,
            read_at=timezone.now()
        )

        return Response(
            {
                "message": "Messages marked as read",
                "updated": updated,
            },
            status=status.HTTP_200_OK,
        )
    
class DeleteMessageView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, message_id):

        try:
            message = Message.objects.get(id=message_id)

        except Message.DoesNotExist:
            return Response(
                {
                    "error": "Message not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if message.sender != request.user:
            return Response(
                {
                    "error": "You can delete only your own messages."
                },
                status=status.HTTP_403_FORBIDDEN,
            )
        message.is_deleted = True
        message.deleted_at = timezone.now()
        message.text = "This message was deleted"
        message.save()

        return Response(
            {
                "message": "Message deleted successfully."
            },
            status=status.HTTP_200_OK,
        )
    
class DeleteConversationView(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request, conversation_id):

        try:
            conversation = Conversation.objects.get(
                id=conversation_id
            )

        except Conversation.DoesNotExist:
            return Response(
                {
                    "error": "Conversation not found"
                },
                status=status.HTTP_404_NOT_FOUND,
            )

        if request.user not in conversation.participants.all():
            return Response(
                {
                    "error": "Access denied"
                },
                status=status.HTTP_403_FORBIDDEN,
            )

        conversation.delete()

        return Response(
            {
                "message": "Conversation deleted successfully."
            },
            status=status.HTTP_200_OK,
        )