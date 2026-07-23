from email import message
import json
from channels.db import database_sync_to_async
from channels.generic.websocket import AsyncWebsocketConsumer
from django.core.mail import message
from django.utils import timezone
from .models import Conversation, Message


class ChatConsumer(AsyncWebsocketConsumer):
    async def connect(self):
        self.user = self.scope["user"]

        if self.user.is_anonymous:
            print("❌ Anonymous user. Connection rejected.")
            await self.close()
            return

        self.conversation_id = self.scope["url_route"]["kwargs"]["conversation_id"]
        self.room_group_name = f"chat_{self.conversation_id}"

        await self.channel_layer.group_add(
            self.room_group_name,
            self.channel_name,
        )

        await self.channel_layer.group_add(
            "online_users",
            self.channel_name,
        )

        await self.accept()
        await self.set_user_online()

        await self.channel_layer.group_send(
            "online_users",
            {
                "type": "user_status",
                "username": self.user.username,
                "is_online": True,
                "last_seen": None,
            },
        )

    async def disconnect(self, close_code):
        print("❌ WebSocket Disconnected")
        if hasattr(self, "room_group_name"):
            await self.channel_layer.group_discard(
                self.room_group_name,
                self.channel_name,
                )

            await self.channel_layer.group_discard(
                "online_users",
                self.channel_name,
                )

        if not self.user.is_anonymous:
            await self.set_user_offline()
            await self.channel_layer.group_send(
                "online_users",
                {
                    "type": "user_status",
                    "username": self.user.username,
                    "is_online": False,
                    "last_seen": timezone.now().isoformat(),
                },
            )

    async def receive(self, text_data):
        data = json.loads(text_data)
        event_type = data.get("type")
        if event_type == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "username": self.user.username,
                    "typing": data.get("typing", False),
                },
            )
            return

        if event_type == "read":
            message_ids = data.get("message_ids", [])
            if message_ids:
                await self.mark_messages_read(message_ids)
                await self.channel_layer.group_send(
                    self.room_group_name,
                    {
                        "type": "read_receipt",
                        "message_ids": message_ids,
                        },
                        )
                return
            
        text = data.get("text")
        if not text:
            return
        
        saved_message = await self.save_message(
            self.user.id,
            self.conversation_id,
            text,
            )

        await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "chat_message",
                    "message": saved_message,
                    },
                    )
            
        await self.channel_layer.group_send(
                "online_users",
                {
                    "type": "conversation_update",
                    "conversation_id": int(self.conversation_id),
                    "last_message": saved_message["text"],
                    "sender": saved_message["sender"],
                    "created_at": saved_message["created_at"],
                    },
                    )

    async def chat_message(self, event):
        await self.send(
            text_data=json.dumps(event["message"])
            )

    async def conversation_update(self, event):
        await self.send(
            text_data=json.dumps({
            "type": "conversation_update",
            "conversation_id": event["conversation_id"],
            "last_message": event["last_message"],
            "sender": event["sender"],
            "created_at": event["created_at"],
        })
    )

    async def typing_status(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "typing",
                    "username": event["username"],
                    "typing": event["typing"],
                }
            )
        )

    async def read_receipt(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "read",
                    "message_ids": event["message_ids"],
                }
            )
        )

    async def user_status(self, event):
        await self.send(
            text_data=json.dumps(
                {
                    "type": "status",
                    "username": event["username"],
                    "is_online": event["is_online"],
                    "last_seen": event["last_seen"],
                }
            )
        )

    #DataBase

    @database_sync_to_async
    def save_message(self, sender_id, conversation_id, text):
        conversation = Conversation.objects.get(
            id=conversation_id
        )
        sender = conversation.participants.get(
            id=sender_id
        )
        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text,
        )
        message.is_delivered = True
        message.delivered_at = timezone.now()
        message.save(update_fields=["is_delivered", "delivered_at"])
        conversation.updated_at = timezone.now()
        conversation.save(update_fields=["updated_at"])

        return {
            "id": message.id,
            "text": message.text,
            "sender": sender.username,
            "created_at": message.created_at.isoformat(),
            "is_delivered": message.is_delivered,
            "is_read": message.is_read,
            "delivered_at": (
                message.delivered_at.isoformat()
                if message.delivered_at
                else None
            ),
            "read_at": (
                message.read_at.isoformat()
                if message.read_at
                else None
            ),
        }

    @database_sync_to_async
    def mark_messages_read(self, message_ids):

        Message.objects.filter(
            id__in=message_ids
        ).update(
            is_read=True,
            read_at=timezone.now(),
        )

    @database_sync_to_async
    def set_user_online(self):

        self.user.is_online = True
        self.user.save(update_fields=["is_online"])

    @database_sync_to_async
    def set_user_offline(self):
        
        self.user.is_online = False
        self.user.last_seen = timezone.now()
        self.user.save(
            update_fields=[
                "is_online",
                "last_seen",
            ]
        )