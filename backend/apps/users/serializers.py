from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from .models import User


class UserSerializer(serializers.ModelSerializer):
    """
    Serializer genérico para representar al usuario en responses.
    No expone la contraseña.
    """

    class Meta:
        model = User
        fields = [
            "id",
            "email",
            "first_name",
            "last_name",
            "profile_picture",
            "phone_number",
            "location",
            "description",
            "date_joined",
            "time_sent",
            "time_received",
            "full_name"
        ]
        read_only_fields = ["id", "date_joined", "email", "time_sent",
                            "time_received", "full_name"]


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

    def validate_email(self, value):
        if User.objects.filter(email=value).exists():
            raise serializers.ValidationError(
                "Ya existe un usuario con este email."
            )
        return value

    def create(self, validated_data):
        # Hash password before saving
        validated_data["password"] = make_password(validated_data["password"])
        return super().create(validated_data)


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField(required=True)
    password = serializers.CharField(write_only=True, required=True)

    def validate(self, data):
        email = data.get("email")
        password = data.get("password")

        if not email or not password:
            raise serializers.ValidationError(
                "Correo y contraseña obligatorios."
            )

        # We don't perform authentication here; it's handled in the view
        return data
