# from django.test import TestCase

# Create your tests here.
import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from apps.users.models import User


@pytest.mark.django_db
class TestUserEndpoints:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email="test@example.com",
            password="strongpassword",
            first_name="Test",
            last_name="User"
        )

    def test_register_user(self, api_client):
        url = reverse("user-list")  # → api/users/
        payload = {
            "email": "newuser@example.com",
            "password": "newpassword123",
            "first_name": "New",
            "last_name": "User",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert User.objects.filter(email="newuser@example.com").exists()

    def test_register_user_duplicate_email(self, api_client, user):
        url = reverse("user-list")  # → api/users/
        payload = {
            "email": user.email,
            "password": "newpassword123",
            "first_name": "Dup",
            "last_name": "User",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_login_user_success(self, api_client, user):
        url = reverse("login")  # → api/login/
        payload = {
            "email": "test@example.com",
            "password": "strongpassword",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        assert "access" in response.data
        assert "refresh" in response.data
        assert response.data["user"]["email"] == user.email

    def test_login_user_invalid_credentials(self, api_client, user):
        url = reverse("login")  # → api/login/
        payload = {
            "email": "test@example.com",
            "password": "wrongpassword",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "error" in response.data

    def test_update_user_profile(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse(
            "user-detail", kwargs={"pk": user.pk}
        )  # → api/users/<id>/
        payload = {
            "first_name": "Updated",
            "last_name": "Name",
            "location": "Madrid",
        }
        response = api_client.patch(url, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.first_name == "Updated"
        assert user.location == "Madrid"

    def test_delete_user_soft(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse(
            "user-detail", kwargs={"pk": user.pk}
            )  # → api/users/<id>/
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.is_active is False
        assert user.full_name == "Usuario eliminado"
