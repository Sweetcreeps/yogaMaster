# backend/yogamaster/urls.py

from django.contrib import admin 
from django.urls import path, include
from rest_framework import routers
from rest_framework.authtoken.views import obtain_auth_token

from users.views import UserViewSet, InstructorViewSet, current_user
from classes.views import YogaClassViewSet
from bookings.views import BookingViewSet
from announcements.views import AnnouncementViewSet
from payments.views import PackageViewSet, PurchaseViewSet, CheckoutAPIView 

router = routers.DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'instructors', InstructorViewSet, basename='instructor')
router.register(r'classes', YogaClassViewSet)
router.register(r'bookings', BookingViewSet)
router.register(r'announcements', AnnouncementViewSet)
router.register(r'packages', PackageViewSet)
router.register(r'purchases', PurchaseViewSet)

urlpatterns = [
    path('admin/', admin.site.urls),

    # who am I endpoint
    path('api/auth/user/', current_user, name='current_user'),

    # Checkout endpoint must come before the router include
    path('api/checkout/', CheckoutAPIView.as_view(), name='checkout'),

    # Router‐registered viewsets under /api/
    path('api/', include(router.urls)),

    # JSON login endpoint
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]
