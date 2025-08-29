from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import RegisterView, LoginView

router = DefaultRouter()
router.register(r"users", RegisterView, basename="user")

urlpatterns = [
    path("login/", LoginView.as_view(), name="login"),
]

urlpatterns += router.urls
