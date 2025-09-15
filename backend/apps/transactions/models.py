from django.db import models
from ..users.models import User
from ..offers.models import Offer


class Transaction(models.Model):
    """
    Transaction model.
    Represents the transfer of time between two users
    based on an offer.
    """
    id = models.AutoField(primary_key=True)
    sender = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="sent_transactions",
        verbose_name="Emisor"
    )
    receiver = models.ForeignKey(
        User,
        on_delete=models.PROTECT,
        related_name="received_transactions",
        verbose_name="Receptor"
    )
    offer = models.ForeignKey(
        Offer,
        on_delete=models.SET_NULL,
        related_name="transactions",
        verbose_name="Oferta",
        blank=True,
        null=True,  # Allow null for transactions not linked to an offer
    )
    title = models.CharField(max_length=100, verbose_name="Título")
    text = models.TextField(
        max_length=500,
        verbose_name="Texto",
        blank=True,
        null=True,
    )
    datetime = models.DateTimeField(
        auto_now_add=True,
        verbose_name="Fecha y hora",
    )
    duration = models.DurationField(
        verbose_name="Duración",
        help_text="Duración del servicio en horas y minutos"
    )

    class Meta:
        db_table = "transactions"
        verbose_name = "Transacción"
        verbose_name_plural = "Transacciones"

    def __str__(self):
        return (
            f"Transacción: {self.title} ({self.sender.email} → "
            f"{self.receiver.email})"
        )
