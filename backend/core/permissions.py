# permissions.py
from rest_framework import permissions


class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Solo el propio usuario puede actualizar su perfil.
    """

    def has_object_permission(self, request, view, obj):
        # SAFE_METHODS = GET, HEAD, OPTIONS (reading is allowed for anyone)
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj == request.user
