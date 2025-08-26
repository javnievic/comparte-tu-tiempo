from django.db import models
from django.contrib.auth.models import AbstractUser
from .validators import phone_validator


class User(AbstractUser):
    """
    Custom User model for the Time Bank application.

    Extends Django's AbstractUser to support JWT authentication
    and additional user information.
    """

    # Email is already included in AbstractUser; enforce uniqueness
    email = models.EmailField(unique=True)

    # Additional fields
    profile_picture = models.ImageField(
        upload_to='profiles/', blank=True, null=True
    )
    phone_number = models.CharField(max_length=15, blank=True, null=True,
                                    validators=[phone_validator])

    location = models.CharField(max_length=100, blank=True, null=True)

    class Meta:
        db_table = "users"
        verbose_name = "User"
        verbose_name_plural = "Users"

    def __str__(self):
        return f"{self.email}"
