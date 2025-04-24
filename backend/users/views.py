# backend/users/views.py

from rest_framework import viewsets, permissions
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response

from .models import User
from .serializers import UserSerializer

class UserViewSet(viewsets.ModelViewSet):
    """
    - Anyone can create a new user (sign up).
    - Only staff users (is_staff=True) can list, retrieve, update, or delete.
    """
    queryset = User.objects.all()
    serializer_class = UserSerializer

    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [IsAdminUser()]


class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly list only users who are instructors (role='teacher').
    """
    queryset = User.objects.filter(role='teacher')
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Return the currently authenticated user's data.
    """
    return Response(UserSerializer(request.user).data)
