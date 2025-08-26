from django.core.validators import RegexValidator

phone_validator = RegexValidator(
    regex=r'^\+?\d{9,15}$',
    message=(
        "El teléfono debe ingresarse en el formato: '+999999999'. "
        "Se permiten hasta 15 dígitos."
    )
)
