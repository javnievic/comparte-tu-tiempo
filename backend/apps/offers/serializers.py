from rest_framework import serializers
from .models import Offer


class OfferSerializer(serializers.ModelSerializer):
    """
    Serializer for the Offer model.
    """

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
