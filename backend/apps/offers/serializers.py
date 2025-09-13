from rest_framework import serializers
from .models import Offer
from apps.users.serializers import UserSerializer
from datetime import timedelta


class OfferSerializer(serializers.ModelSerializer):
    """
    Serializer for the Offer model.
    """
    image = serializers.ImageField(required=False, allow_null=True)
    user = UserSerializer(read_only=True)
    duration_minutes = serializers.SerializerMethodField()

    class Meta:
        model = Offer
        fields = [
            "id",
            "title",
            "description",
            "duration",
            "duration_minutes",
            "is_online",
            "location",
            "publish_date",
            "image",
            "user",
        ]
        read_only_fields = ["id", "publish_date", "user", "is_active"]

    def get_duration_minutes(self, obj):
        if obj.duration:
            return int(obj.duration.total_seconds() // 60)
        return None

    def validate_duration(self, value):
        """Ensure duration is between 15 minutes and 4 hours."""
        min_duration = timedelta(minutes=15)
        max_duration = timedelta(hours=4)

        if value < min_duration or value > max_duration:
            raise serializers.ValidationError(
                "La duración debe estar entre 15 minutos y 4 horas."
            )
        return value
