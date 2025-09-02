from django.db import models
from ..users.models import User


class AbstractService(models.Model):
    """
    Abstract Service model.
    Contains common fields for both Oferta and Demanda.
    """
    title = models.CharField(max_length=100, verbose_name="Título")
    description = models.TextField(max_length=500, verbose_name="Descripción")
    duration = models.CharField(max_length=50, verbose_name="Duración")
    is_online = models.BooleanField(default=False,
                                    verbose_name="Servicio online")
    is_active = models.BooleanField(default=True, verbose_name="Activo")
    location = models.CharField(max_length=100, blank=True, null=True,
                                verbose_name="Ubicación")
    publish_date = models.DateField(auto_now_add=True,
                                    verbose_name="Fecha de publicación")
    status = models.CharField(max_length=50, default="Disponible",
                              verbose_name="Estado")
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        verbose_name="Usuario",
        help_text="Usuario asociado al servicio"
    )

    class Meta:
        abstract = True  # This model won't create a table in the DB

    def __str__(self):
        return f"{self.title}"
