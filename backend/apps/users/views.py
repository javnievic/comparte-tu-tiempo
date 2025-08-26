from rest_framework import status, viewsets
from rest_framework.response import Response
from .models import User
from .serializers import UserRegisterSerializer


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
