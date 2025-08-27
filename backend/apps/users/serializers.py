from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User


class UserRegisterSerializer(serializers.ModelSerializer):
    """
    Serializer for user registration.
    Prepares input/output for React frontend.
    """

    password = serializers.CharField(
        write_only=True,
        required=True,
        style={"input_type": "password"},
        min_length=8
    )

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "password",
            "first_name",
            "last_name",
            "profile_picture",
            "phone_number",
            "location",
            "description",
            "date_joined",
        ]
        read_only_fields = ["id", "date_joined"]

    def create(self, validated_data):
        # Hash password before saving
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)
