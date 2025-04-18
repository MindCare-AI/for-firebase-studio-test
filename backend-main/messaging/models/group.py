# messaging/models/group.py
from django.db import models
from django.conf import settings
from .base import BaseConversation, BaseMessage


class GroupConversation(BaseConversation):
    name = models.CharField(max_length=100)
    description = models.TextField(blank=True)
    moderators = models.ManyToManyField(
        settings.AUTH_USER_MODEL, related_name="moderated_groups"
    )
    is_private = models.BooleanField(default=True)

    def __str__(self):
        return self.name


class GroupMessage(BaseMessage):
    conversation = models.ForeignKey(
        GroupConversation, on_delete=models.CASCADE, related_name="messages"
    )
    message_type = models.CharField(
        max_length=10, choices=[("text", "Text"), ("system", "System")], default="text"
    )

    def __str__(self):
        return f"Message by {self.sender} in {self.conversation}"
