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
        {"email": "juan@example.com", "first_name": "Juan", "last_name": "López", "location": "Triana, Sevilla"},
        {"email": "marta@example.com", "first_name": "Marta", "last_name": "Soler Ríos", "location": "Nervión, Sevilla"},
        {"email": "emma@example.com", "first_name": "Emma", "last_name": "Torres Vidal", "location": "Los Remedios, Sevilla"},
        {"email": "luis@example.com", "first_name": "Luis", "last_name": "Fernández Peña", "location": "Macarena, Sevilla"},
        {"email": "paco@example.com", "first_name": "Paco", "last_name": "Fernández", "location": "Alameda, Sevilla"},
        {"email": "juancarlos@example.com", "first_name": "Juan Carlos", "last_name": "Ortega", "location": "Santa Cruz, Sevilla"},  # flake8: noqa
    ]

    users = []
    for data in users_data:
        user = User.objects.create(
            email=data["email"],
            first_name=data["first_name"],
            last_name=data["last_name"],
            location=data["location"]
        )
        user.set_password("12345678Ma")
        user.save()
        users.append(user)
    print(f"✅ {len(users)} users created.")
    return users


def populate_offers(users):
    """Create demo offers linked to users."""
    print("📦 Creating demo offers...")
    offers_data = [
        {"title": "Diseño gráfico",
         "description": "Servicios de diseño gráfico profesional",
         "duration": timedelta(hours=2),
         "is_online": True,
         "user": users[0]},
        {"title": "Mantenimiento de jardines",
         "description": "Cuidado y mantenimiento de jardines",
         "duration": timedelta(hours=3),
         "location": "Nervión, Sevilla",
         "user": users[1]},
        {"title": "Clases de inglés",
         "description": "Clases particulares de inglés para todos los niveles",
         "duration": timedelta(hours=1, minutes=30),
         "is_online": True,
         "user": users[2]},
        {"title": "Configuración de móviles",
         "description": "Ayuda en configuración y optimización de smartphones",
         "duration": timedelta(hours=1),
         "user": users[3]},
        {"title": "Clases básicas de guitarra",
         "description": "Aprende guitarra desde cero",
         "duration": timedelta(hours=1, minutes=45),
         "user": users[4]},
        {"title": "Reparación de bicicletas",
         "description": "Servicio de reparación y mantenimiento de bicicletas",
         "duration": timedelta(hours=2),
         "user": users[5]},
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
