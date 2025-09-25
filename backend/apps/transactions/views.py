# views.py
from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from .models import Transaction
from .serializers import TransactionSerializer
from django.db.models import Q


class TransactionViewSet(viewsets.ModelViewSet):
    queryset = Transaction.objects.all()
    serializer_class = TransactionSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        receiver = serializer.validated_data.get("receiver")
        if receiver == request.user:
            return Response(
                {"receiver": "No puedes enviarte tiempo a ti mismo."},
                status=status.HTTP_400_BAD_REQUEST
            )

        transaction = serializer.save(sender=request.user)

        # Update time totals for sender and receiver
        transaction.sender.time_sent += transaction.duration
        transaction.sender.save(update_fields=["time_sent"])

        transaction.receiver.time_received += transaction.duration
        transaction.receiver.save(update_fields=["time_received"])
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED,
                        headers=headers)

    @action(detail=False, methods=["get"], url_path="my-transactions")
    def my_transactions(self, request):
        """
        Retorna todas las transacciones donde el usuario es
        sender o receiver.
        """
        user = request.user
        transactions = Transaction.objects.filter(
            Q(sender=user) | Q(receiver=user)
        ).order_by("-datetime")
        serializer = self.get_serializer(transactions, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
