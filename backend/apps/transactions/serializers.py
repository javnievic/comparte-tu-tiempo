from rest_framework import serializers
from apps.users.serializers import UserSerializer
from apps.offers.serializers import OfferSerializer
from .models import Transaction
from datetime import timedelta
from apps.users.models import User
from apps.offers.models import Offer


class TransactionSerializer(serializers.ModelSerializer):
    # To sent to frontend complete data
    sender = UserSerializer(read_only=True)
    receiver = UserSerializer(read_only=True)
    offer = OfferSerializer(read_only=True)

    # To receive Id at post
    receiver_id = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.all(), write_only=True, source='receiver'
    )
    offer_id = serializers.PrimaryKeyRelatedField(
        queryset=Offer.objects.all(),
        write_only=True,
        source='offer',
        required=False,  # optional
        allow_null=True
    )

    class Meta:
        model = Transaction
        fields = [
            "id",
            "sender",
            "receiver",      # Complete data (read_only)
            "receiver_id",   # To receive ID in POST (write_only)
            "offer",
            "offer_id",
            "title",
            "text",
            "datetime",
            "duration",
        ]
        read_only_fields = ["id", "datetime", "sender"]

    def validate_duration(self, value):
        min_duration = timedelta(minutes=15)
        max_duration = timedelta(hours=4)
        if value < min_duration or value > max_duration:
            raise serializers.ValidationError(
                "La duración debe estar entre 15 minutos y 4 horas."
            )
        return value
