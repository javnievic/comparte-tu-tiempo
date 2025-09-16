from rest_framework import status, viewsets, permissions
from rest_framework.response import Response
from .models import Offer
from .serializers import OfferSerializer
from django.db.models import Q
from datetime import timedelta


class OfferViewSet(viewsets.ModelViewSet):
    """
    API endpoint to manage Offers.
    Only authenticated users can create offers.
    Only the owner can update or delete their offer.
    """
    queryset = Offer.objects.all().order_by("-publish_date")
    serializer_class = OfferSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]

    def get_queryset(self):
        queryset = Offer.objects.all().order_by("-publish_date")

        # Query params filters (TODO connect with frontend in a future)
        user_id = self.request.query_params.get("user")
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        is_online = self.request.query_params.get("is_online")
        if is_online is not None:
            queryset = queryset.filter(is_online=is_online.lower() == "true")

        is_active = self.request.query_params.get("is_active")
        if is_active is not None:
            queryset = queryset.filter(is_active=is_active.lower() == "true")

        location = self.request.query_params.get("location")
        if location:
            queryset = queryset.filter(location__icontains=location)

        min_duration = self.request.query_params.get("min_duration")
        if min_duration:
            try:
                queryset = queryset.filter(duration__gte=timedelta
                                           (hours=float(min_duration)))
            except ValueError:
                pass  # ignore if is not a valid number

        max_duration = self.request.query_params.get("max_duration")
        if max_duration:
            try:
                queryset = queryset.filter(duration__lte=timedelta
                                           (hours=float(max_duration)))
            except ValueError:
                pass

        from_date = self.request.query_params.get("from_date")
        if from_date:
            queryset = queryset.filter(publish_date__gte=from_date)

        to_date = self.request.query_params.get("to_date")
        if to_date:
            queryset = queryset.filter(publish_date__lte=to_date)

        search = self.request.query_params.get("q")
        if search:
            queryset = queryset.filter(
                Q(title__icontains=search) |
                Q(description__icontains=search)
            )
        user_id = self.request.query_params.get("user")
        if user_id:
            queryset = queryset.filter(user_id=user_id)

        return queryset

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
