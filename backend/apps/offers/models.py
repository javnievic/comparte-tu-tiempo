from django.db import models
from ..services.models import AbstractService


class Offer(AbstractService):
    """
    Offer model, inherits from AbstractService.
    """
    image = models.ImageField(
        upload_to='offers',  # Folder where offer images will be stored
        blank=True,
        null=True,
        verbose_name="Imagen",
        default="offers/default.webp"
    )

    class Meta:
        db_table = "offers"
        verbose_name = "Oferta"
        verbose_name_plural = "Ofertas"

    def __str__(self):
        return f"{self.title} - {self.user.email}"
