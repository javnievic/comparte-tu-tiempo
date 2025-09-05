from rest_framework import serializers
from .models import Offer
from apps.users.serializers import UserSerializer


class OfferSerializer(serializers.ModelSerializer):
    """
    Serializer for the Offer model.
    """
    image = serializers.ImageField(required=False, allow_null=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Offer
        fields = [
            "id",
            "title",
            "description",
            "duration",
            "is_online",
            "location",
            "publish_date",
            "image",
            "user",
        ]
        read_only_fields = ["id", "publish_date", "user", "is_active"]
