import json
from channels.generic.websocket import AsyncWebsocketConsumer
from channels.db import database_sync_to_async
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

        await self.accept()

        print(f"✅ WebSocket Connected : {self.user.username}")

    async def disconnect(self, close_code):
        print("❌ WebSocket Disconnected")
        if hasattr(self, "room_group_name"):
                await self.channel_layer.group_discard(
                    self.room_group_name,
                    self.channel_name,
        )

    async def receive(self, text_data):
        data = json.loads(text_data)
        if data.get("type") == "typing":
            await self.channel_layer.group_send(
                self.room_group_name,
                {
                    "type": "typing_status",
                    "username": self.user.username,
                    "typing": data.get("typing"),
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
     
    async def chat_message(self, event):
        print("➡ Sending to frontend:", event["message"])
        await self.send(
        text_data=json.dumps(event["message"])
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

    @database_sync_to_async
    def save_message(self, sender_id, conversation_id, text):
        print("===== SAVE MESSAGE CALLED =====")
        print(sender_id, conversation_id, text)
        conversation = Conversation.objects.get(id=conversation_id)
        print("Conversation Found")
        sender = conversation.participants.get(id=sender_id)
        print("Sender Found")

        message = Message.objects.create(
            conversation=conversation,
            sender=sender,
            text=text,
            )
        print("Message Saved:", message.id)
        return {
            "id": message.id,
            "text": message.text,
            "sender": sender.username,
            "created_at": message.created_at.isoformat(),
            }