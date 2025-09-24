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

    # ------------------------
    #  USER REGISTRATION
    # ------------------------

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

    def test_register_with_invalid_email(self, api_client):
        """Register with invalid email format should fail"""
        url = reverse("user-list")
        payload = {
            "email": "not-an-email",
            "password": "StrongPass123",
            "first_name": "Bad",
            "last_name": "Email",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "email" in response.data

    def test_register_with_weak_password(self, api_client):
        """Register with weak password should fail"""
        url = reverse("user-list")
        payload = {
            "email": "weak@example.com",
            "password": "123",
            "first_name": "Weak",
            "last_name": "Password",
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "password" in response.data

    # ------------------------
    #  USER LOGIN AND AUTHENTICATION
    # ------------------------

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

    def test_login_with_nonexistent_email(self, api_client):
        """Login with non-existing email should fail"""
        url = reverse("login")
        payload = {"email": "ghost@example.com", "password": "whatever"}
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED
        assert "error" in response.data

    def test_login_without_fields(self, api_client):
        """Login without required fields should fail"""
        url = reverse("login")
        payload = {}
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST

    def test_access_user_detail_without_token(self, api_client, user):
        """Accessing another user's detail without token should succeed"""
        url = reverse("user-detail", kwargs={"pk": user.pk})
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK

    def test_login_deleted_user(self, api_client, user):
        """Deleted users should not be able to log in"""
        user.is_active = False
        user.save()

        url = reverse("login")
        payload = {"email": user.email, "password": "strongpassword"}
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    # ------------------------
    #  USER UPDATE AND DELETE
    # ------------------------

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

    def test_delete_twice(self, api_client, user):
        """Deleting the same user twice should remain inactive"""
        api_client.force_authenticate(user=user)
        url = reverse("user-detail", kwargs={"pk": user.pk})

        response1 = api_client.delete(url)
        assert response1.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.is_active is False

        response2 = api_client.delete(url)
        assert response2.status_code == status.HTTP_200_OK
        user.refresh_from_db()
        assert user.is_active is False
        assert user.full_name == "Usuario eliminado"

    # ------------------------
    #  USER LIST & DETAIL
    # ------------------------

    def test_list_users_authenticated(self, api_client, user):
        """Authenticated user should be able to list users"""
        api_client.force_authenticate(user=user)
        url = reverse("user-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any(u["email"] == user.email for u in response.data)

    def test_list_users_unauthenticated(self, api_client):
        """Unauthenticated user trying to list users"""
        url = reverse("user-list")
        response = api_client.get(url)

        # Depending on your config this may be 200 or 401
        assert response.status_code == status.HTTP_200_OK

    # ------------------------
    #  SPECIAL FIELDS
    # ------------------------

    def test_default_time_fields(self, user):
        """New users should have default time_sent and time_received = 0"""
        assert str(user.time_sent) == "0:00:00"
        assert str(user.time_received) == "0:00:00"
