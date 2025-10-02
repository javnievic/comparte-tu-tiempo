# flake8: noqa
import os
import django
from datetime import timedelta

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

# Import models
from apps.users.models import User
from apps.offers.models import Offer
from apps.transactions.models import Transaction


def clear_data():
    """Delete previous data from the database."""
    print("⚠️ Deleting old data...")
    Transaction.objects.all().delete()
    Offer.objects.all().delete()
    User.objects.all().delete()
    print("✅ Old data deleted.")


def populate_users():
    """Create demo users."""
    print("👤 Creating demo users...")
    users_data = [
        {"email": "juan@example.com", "first_name": "Juan", "last_name": "Pérez", "location": "Madrid"},
        {"email": "maria@example.com", "first_name": "María", "last_name": "López", "location": "Barcelona"},
    ]

    users = []
    for data in users_data:
        user = User.objects.create(
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            location=data["location"]
        )
        user.set_password("12345678")
        user.save()
        users.append(user)
    print(f"✅ {len(users)} users created.")
    return users


def populate_offers(users):
    """Create demo offers linked to users."""
    print("📦 Creating demo offers...")
    offers_data = [
        {"title": "Clases de matemáticas",
         "description": "Apoyo escolar en matemáticas de secundaria",
         "duration": timedelta(hours=2),
         "is_online": True,
         "user": users[0]},
        {"title": "Cuidado de mascotas",
         "description": "Paseo de perros por las tardes",
         "duration": timedelta(hours=1),
         "location": "Barcelona",
         "user": users[1]},
    ]

    offers = []
    for data in offers_data:
        offer = Offer.objects.create(**data)
        offers.append(offer)
    print(f"✅ {len(offers)} offers created.")


def main():
    """Main population function."""
    clear_data()
    users = populate_users()
    populate_offers(users)
    print("🎉 Database populated successfully!")


if __name__ == "__main__":
    main()
