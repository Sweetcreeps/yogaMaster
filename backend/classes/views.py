# backend/classes/views.py

from rest_framework import viewsets, permissions
from .models import YogaClass
from .serializers import YogaClassSerializer

class YogaClassViewSet(viewsets.ModelViewSet):
    queryset = YogaClass.objects.all()
    serializer_class = YogaClassSerializer

    def get_permissions(self):
        # Allow anyone to view (GET /api/classes/ or /api/classes/{pk}/)
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        # All other actions (create/update/delete) still require auth
        return [permissions.IsAuthenticated()]
