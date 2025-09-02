from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer


class OfferViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage Offers.
    Only authenticated users can create offers.
    Only the owner can update or delete their offer.
    """
    queryset = Offer.objects.all().order_by("-publish_date")
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def create(self, request, *args, **kwargs):

        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save(user=request.user)  # assign the logged-in user
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)

    def update(self, request, *args, **kwargs):
        offer = self.get_object()

        if request.user != offer.user:
            return Response(
                {"error": "No puedes modificar una oferta que no es tuya."},
                status=status.HTTP_403_FORBIDDEN
            )
        serializer = self.get_serializer(offer, data=request.data,
                                         partial=True)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data)

    def destroy(self, request, *args, **kwargs):
        offer = self.get_object()
        if request.user != offer.user:
            return Response(
                {"error": "No puedes eliminar una oferta que no es tuya."},
                status=status.HTTP_403_FORBIDDEN
            )
        offer.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)
