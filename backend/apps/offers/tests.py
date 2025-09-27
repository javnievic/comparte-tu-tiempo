import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import date, timedelta
from apps.users.models import User
from apps.offers.models import Offer


@pytest.mark.django_db
class TestOfferEndpoints:

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def user(self):
        return User.objects.create_user(
            email="user@example.com",
            password="strongpassword",
            first_name="Test",
            last_name="User"
        )

    @pytest.fixture
    def offer(self, user):
        return Offer.objects.create(
            title="Test Offer",
            description="Offer description",
            duration=timedelta(hours=1),
            is_online=True,
            location="Triana, Sevilla",
            user=user
        )

    # ------------------------
    #  OFFER CREATION
    # ------------------------

    def test_create_offer_authenticated(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse("offer-list")
        payload = {
            "title": "New Offer",
            "description": "Great service",
            "duration": "01:30:00",
            "is_online": True,
            "location": "Nervión, Sevilla"
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert Offer.objects.filter(title="New Offer").exists()
        assert response.data["user"]["email"] == user.email

    def test_create_offer_unauthenticated(self, api_client):
        url = reverse("offer-list")
        payload = {
            "title": "Anonymous Offer",
            "description": "Should fail",
            "duration": "01:00:00",
            "is_online": True
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_offer_invalid_duration(self, api_client, user):
        api_client.force_authenticate(user=user)
        url = reverse("offer-list")
        payload = {
            "title": "Bad Duration",
            "description": "Too short",
            "duration": "00:10:00",
            "is_online": True
        }
        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "duration" in response.data

    def test_create_offer_with_user_field_ignored(self, api_client, user):
        """
        Attempt to create an offer assigning it to another user (malicious
        attempt). The backend should ignore the 'user' field sent in the
        payload and always assign the authenticated request.user as the owner.
        """
        other_user = User.objects.create_user(
            email="other@example.com", password="password"
        )
        api_client.force_authenticate(user=user)
        url = reverse("offer-list")
        payload = {
            "title": "Fake Owner Offer",
            "description": "Trying to hijack",
            "duration": "01:00:00",
            "is_online": False,
            "user": other_user.id,  # attempt to assign to another user
        }

        response = api_client.post(url, payload, format="json")

        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["user"]["email"] == user.email  # should ignore
        # the provided user id

    # ------------------------
    #  OFFER UPDATE
    # ------------------------

    def test_update_offer_owner(self, api_client, user, offer):
        api_client.force_authenticate(user=user)
        url = reverse("offer-detail", kwargs={"pk": offer.pk})
        payload = {"title": "Updated Offer", "location": "Sevilla"}
        response = api_client.patch(url, payload, format="json")

        assert response.status_code == status.HTTP_200_OK
        offer.refresh_from_db()
        assert offer.title == "Updated Offer"
        assert offer.location == "Sevilla"

    def test_update_offer_not_owner(self, api_client, offer):
        other_user = User.objects.create_user(
            email="other@example.com", password="password"
        )
        api_client.force_authenticate(user=other_user)
        url = reverse("offer-detail", kwargs={"pk": offer.pk})
        payload = {"title": "Hacked Offer"}
        response = api_client.patch(url, payload, format="json")

        assert response.status_code == status.HTTP_403_FORBIDDEN
        offer.refresh_from_db()
        assert offer.title != "Hacked Offer"

    # ------------------------
    #  OFFER DELETE
    # ------------------------

    def test_delete_offer_owner(self, api_client, user, offer):
        api_client.force_authenticate(user=user)
        url = reverse("offer-detail", kwargs={"pk": offer.pk})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_204_NO_CONTENT
        assert not Offer.objects.filter(pk=offer.pk).exists()

    def test_delete_offer_not_owner(self, api_client, offer):
        other_user = User.objects.create_user(
            email="other@example.com", password="password"
        )
        api_client.force_authenticate(user=other_user)
        url = reverse("offer-detail", kwargs={"pk": offer.pk})
        response = api_client.delete(url)

        assert response.status_code == status.HTTP_403_FORBIDDEN
        assert Offer.objects.filter(pk=offer.pk).exists()

    # ------------------------
    #  OFFER LIST & FILTERS
    # ------------------------

    def test_list_offers(self, api_client, offer):
        url = reverse("offer-list")
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any(o["id"] == offer.id for o in response.data)

    def test_filter_offers_by_user(self, api_client, offer, user):
        url = reverse("offer-list") + f"?user={user.id}"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert all(o["user"]["email"] == user.email for o in response.data)

    def test_filter_offers_by_location(self, api_client, offer):
        url = reverse("offer-list") + "?location=Triana"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert all("Triana" in o["location"] for o in response.data)

    def test_filter_offers_by_is_online(self, api_client, offer):
        url = reverse("offer-list") + "?is_online=true"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert all(o["is_online"] for o in response.data)

    def test_filter_offers_by_min_max_duration(self, api_client, offer):
        url = reverse("offer-list") + "?min_duration=0.5&max_duration=2"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any(o["id"] == offer.id for o in response.data)

    def test_filter_offers_invalid_min_duration(self, api_client, offer):
        url = reverse("offer-list") + "?min_duration=abc"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any(o["id"] == offer.id for o in response.data)

    def test_filter_offers_by_date_range(self, api_client, offer):
        today = date.today().isoformat()
        tomorrow = (date.today() + timedelta(days=1)).isoformat()
        url = reverse("offer-list") + f"?from_date={today}&to_date={tomorrow}"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any(o["id"] == offer.id for o in response.data)

    def test_filter_offers_by_search(self, api_client, offer):
        url = reverse("offer-list") + "?q=Test"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
        assert any("Test" in o["title"] for o in response.data)

    def test_filter_offers_by_injection_like_query(self, api_client, offer):
        """
        Ensure the search filter is safe against injection-like queries.
        """
        url = reverse("offer-list") + "?q=' OR 1=1 --"
        response = api_client.get(url)

        assert response.status_code == status.HTTP_200_OK
