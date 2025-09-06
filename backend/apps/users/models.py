from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import phone_validator
from datetime import timedelta


class User(AbstractUser):
    """
    Custom User model for the Time Bank application.

    Extends Django's AbstractUser to support JWT authentication
    and additional user information.
    """
    username = None  # Remove username field
    first_name = models.CharField(max_length=50)
    last_name = models.CharField(max_length=50)
    email = models.EmailField(unique=True, error_messages={
        "unique": "Ya existe un usuario registrado con este email.",
        "invalid": "Introduce un email válido.",
    })

    # Additional fields
    profile_picture = models.ImageField(
        upload_to='profiles', blank=True, null=True,
        default="profiles/default_user.webp"
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True,
                                    validators=[phone_validator])

    location = models.CharField(max_length=100, blank=True, null=True)
    description = models.TextField(
        blank=True, null=True, max_length=500,
        help_text="Escribe algo sobre ti (máx. 500 caracteres)"
    )

    time_sent = models.DurationField(
        default=timedelta(0),
        verbose_name="Tiempo enviado",
        help_text="Tiempo total ofrecido a otros usuarios"
    )
    time_received = models.DurationField(
        default=timedelta(0),
        verbose_name="Tiempo recibido",
        help_text="Tiempo total recibido de otros usuarios"
    )

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email}"
