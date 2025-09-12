# serializers.py
from rest_framework import serializers
from .models import Transaction


class TransactionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Transaction
        fields = [
            "id",
            "sender",
            "receiver",
            "offer",
            "title",
            "text",
            "datetime",
            "duration",
        ]
        read_only_fields = ["id", "datetime", "sender"]
