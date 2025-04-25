from rest_framework import viewsets, permissions  
from rest_framework.decorators import api_view, permission_classes  
from rest_framework.permissions import IsAuthenticated, IsAdminUser  
from rest_framework.response import Response  

from .models import User  # our custom User model
from .serializers import UserSerializer  # serializer for User instances


class UserViewSet(viewsets.ModelViewSet):
    """
    - Anyone can create a new user (sign up).
    - Only staff users (is_staff=True) can list, retrieve, update, or delete users.
    """
    queryset = User.objects.all()  # full list of users
    serializer_class = UserSerializer  # how we serialize/deserialize users

    def get_permissions(self):
        # allow anyone to sign up
        if self.action == 'create':
            return [permissions.AllowAny()]
        # restrict all other actions to admin/staff
        return [IsAdminUser()]


class InstructorViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Publicly list only users who have is_staff=True
    (i.e. your instructors/admins).
    """
    queryset = User.objects.filter(is_staff=True)  # only staff users
    serializer_class = UserSerializer
    permission_classes = [permissions.AllowAny]  # open to everyone for read-only


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def current_user(request):
    """
    Return the currently authenticated user's data.
    """
    # wrap request.user in our serializer and return JSON
    return Response(UserSerializer(request.user).data)
