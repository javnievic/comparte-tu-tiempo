# serializers.py
from rest_framework import serializers
from .models import Transaction
from datetime import timedelta


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

    def validate_duration(self, value):
        """Ensure duration is between 15 minutes and 4 hours."""

        min_duration = timedelta(minutes=15)
        max_duration = timedelta(hours=4)

        if value < min_duration or value > max_duration:
            raise serializers.ValidationError(
                "La duración debe estar entre 15 minutos y 4 horas."
            )
        return value
