from rest_framework import viewsets, permissions
from .models import Announcement
from .serializers import AnnouncementSerializer

class AnnouncementViewSet(viewsets.ModelViewSet):
    """
    - list & retrieve: open to anyone
    - create/update/delete: staff users only
    """
    queryset = Announcement.objects.order_by('-date')
    serializer_class = AnnouncementSerializer

    def get_permissions(self):
        if self.action in ['list', 'retrieve']:
            return [permissions.AllowAny()]
        return [permissions.IsAdminUser()]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)
