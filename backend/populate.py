# flake8: noqa
import os
import django
from datetime import timedelta
from django.core.files import File

# Setup Django environment
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")
django.setup()

# Import models
from apps.users.models import User
from apps.offers.models import Offer
from apps.transactions.models import Transaction
MEDIA_PATH = os.path.join(os.path.dirname(__file__), "media_demo")


def clear_data():
    """Delete previous data from the database."""
    print("⚠️ Deleting old data...")
    Transaction.objects.all().delete()
    Offer.objects.all().delete()
    User.objects.all().delete()
    print("✅ Old data deleted.")


def populate_users():
    """Create demo users with profile pictures."""
    print("👤 Creating demo users...")
    users_data = [
        {"email": "juan@example.com", "first_name": "Juan", "last_name": "López", "location": "Triana, Sevilla", "profile": "profiles/juanLopez.jpg"},
        {"email": "marta@example.com", "first_name": "Marta", "last_name": "Soler Ríos", "location": "Nervión, Sevilla", "profile": "profiles/martaSoler.jpg"},
        {"email": "emma@example.com", "first_name": "Emma", "last_name": "Torres Vidal", "location": "Los Remedios, Sevilla", "profile": "profiles/emmaTorres.jpg"},
        {"email": "luis@example.com", "first_name": "Luis", "last_name": "Fernández Peña", "location": "Macarena, Sevilla", "profile": "profiles/luisFernandez.jpg"},
        {"email": "paco@example.com", "first_name": "Paco", "last_name": "Fernández", "location": "Alameda, Sevilla", "profile": "profiles/pacoFernandez.jpg"},
        {"email": "juancarlos@example.com", "first_name": "Juan Carlos", "last_name": "Ortega", "location": "Santa Cruz, Sevilla", "profile": "profiles/juanCarlos.jpg"},
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
        # Asignar imagen de perfil si existe
        profile_path = os.path.join(MEDIA_PATH, data["profile"])
        if os.path.exists(profile_path):
            with open(profile_path, "rb") as f:
                user.profile_picture.save(os.path.basename(profile_path), File(f), save=True)
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
