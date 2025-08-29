from rest_framework import status, viewsets
from rest_framework.response import Response
from rest_framework.views import APIView
from .models import User
from .serializers import (
    UserRegisterSerializer,
    UserSerializer,
    UserLoginSerializer
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken


class RegisterView(viewsets.ModelViewSet):
    """
    API endpoint to register a new user.
    Accepts JSON POST requests from React frontend.
    """
    queryset = User.objects.all()
    serializer_class = UserRegisterSerializer

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(
            raise_exception=True
        )  # raises 400 with error details

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)


class LoginView(APIView):
    """
    Custom login endpoint using email and password.
    Returns JWT tokens on success.
    """
    serializer_class = UserLoginSerializer

    def post(self, request):
        serializer = self.serializer_class(data=request.data)
        serializer.is_valid(
            raise_exception=True
        )  # raises 400 with error details

        email = serializer.validated_data["email"]
        password = serializer.validated_data["password"]

        user = authenticate(request=request, email=email, password=password)
        if not user:
            # Incorrect credentials
            return Response(
                {"error": "Correo o contraseña incorrectos."},
                status=status.HTTP_401_UNAUTHORIZED
            )

        # Login exitoso
        refresh = RefreshToken.for_user(user)
        return Response({
            "refresh": str(refresh),
            "access": str(refresh.access_token),
            "user": UserSerializer(user).data
        }, status=status.HTTP_200_OK)
