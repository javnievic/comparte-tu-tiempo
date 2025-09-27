import pytest
from django.urls import reverse
from rest_framework import status
from rest_framework.test import APIClient
from datetime import timedelta
from apps.users.models import User
from apps.offers.models import Offer
from apps.transactions.models import Transaction


@pytest.mark.django_db
class TestTransactionEndpoints:

    # ------------------------
    #  Fixtures
    # ------------------------

    @pytest.fixture
    def api_client(self):
        return APIClient()

    @pytest.fixture
    def sender(self):
        return User.objects.create_user(
            email="sender@example.com",
            password="strongpassword",
            first_name="Sender",
            last_name="User",
            time_sent=timedelta(0),
            time_received=timedelta(0)
        )

    @pytest.fixture
    def receiver(self):
        return User.objects.create_user(
            email="receiver@example.com",
            password="strongpassword",
            first_name="Receiver",
            last_name="User",
            time_sent=timedelta(0),
            time_received=timedelta(0)
        )

    @pytest.fixture
    def offer(self, sender):
        return Offer.objects.create(
            title="Test Offer",
            description="Offer description",
            duration=timedelta(hours=1),
            is_online=True,
            location="Triana, Sevilla",
            user=sender
        )

    @pytest.fixture
    def transaction(self, sender, receiver, offer):
        return Transaction.objects.create(
            sender=sender,
            receiver=receiver,
            offer=offer,
            title="Test Transaction",
            text="A test transaction",
            duration=timedelta(hours=1)
        )

    # ------------------------
    #  Transaction Creation
    # ------------------------

    def test_create_transaction(self, api_client, sender, receiver, offer):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-list")
        payload = {
            "receiver_id": receiver.id,
            "offer_id": offer.id,
            "title": "New Transaction",
            "text": "Sending 1 hour",
            "duration": "01:00:00"
        }

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        sender.refresh_from_db()
        receiver.refresh_from_db()
        # Verify time adjustments
        assert sender.time_sent == timedelta(hours=1)
        assert receiver.time_received == timedelta(hours=1)

    def test_create_transaction_without_offer(
            self, api_client, sender, receiver
    ):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-list")
        payload = {
            "receiver_id": receiver.id,
            "title": "Transaction without Offer",
            "duration": "01:00:00"
        }
        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_201_CREATED
        assert response.data["offer"] is None

    def test_create_transaction_invalid_receiver(self, api_client, sender):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-list")
        payload = {
            "receiver_id": 9999,  # unexisting user ID
            "title": "Invalid Receiver Transaction",
            "duration": "01:00:00"
        }

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "receiver_id" in response.data

    def test_create_transaction_to_self_fails(self, api_client, sender):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-list")
        payload = {
            "receiver_id": sender.id,
            "title": "Self Transaction",
            "duration": "00:30:00"
        }

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "receiver" in response.data

    def test_create_transaction_unauthenticated(self, api_client, receiver):
        url = reverse("transaction-list")
        payload = {
            "receiver_id": receiver.id,
            "title": "No Auth Transaction",
            "duration": "01:00:00"
        }

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_401_UNAUTHORIZED

    def test_create_transaction_invalid_duration(
        self, api_client, sender, receiver
    ):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-list")
        payload = {
            "receiver_id": receiver.id,
            "title": "Too Long Transaction",
            "duration": "05:00:00"  # more than 4 hours
        }

        response = api_client.post(url, payload, format="json")
        assert response.status_code == status.HTTP_400_BAD_REQUEST
        assert "duration" in response.data

    # ------------------------
    #  List Transactions
    # ------------------------

    def test_list_my_transactions(
            self, api_client, sender, receiver, transaction
    ):
        api_client.force_authenticate(user=sender)
        url = reverse("transaction-my-transactions")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        # Ensure the transaction appears in the list
        assert any(t["id"] == transaction.id for t in response.data)

    def test_list_my_transactions_receiver(
            self, api_client, sender, receiver, transaction
    ):
        api_client.force_authenticate(user=receiver)
        url = reverse("transaction-my-transactions")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_200_OK
        assert any(t["id"] == transaction.id for t in response.data)

    def test_list_my_transactions_unauthenticated(self, api_client):
        url = reverse("transaction-my-transactions")
        response = api_client.get(url)
        assert response.status_code == status.HTTP_401_UNAUTHORIZED
