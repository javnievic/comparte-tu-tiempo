from rest_framework.routers import DefaultRouter
from .views import RegisterView

router = DefaultRouter()
router.register(r"users", RegisterView, basename="user")

urlpatterns = router.urls
