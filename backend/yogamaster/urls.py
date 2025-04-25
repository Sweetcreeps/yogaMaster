from django.contrib import admin  # Django admin site
from django.urls import path, include  # URL routing helpers
from rest_framework import routers  # DRF routers for ViewSets
from rest_framework.authtoken.views import obtain_auth_token  # token auth endpoint

# import our ViewSets and custom endpoints
from users.views import UserViewSet, InstructorViewSet, current_user
from classes.views import YogaClassViewSet
from bookings.views import BookingViewSet
from announcements.views import AnnouncementViewSet
from payments.views import PackageViewSet, PurchaseViewSet, CheckoutAPIView

# set up a DRF router to automatically generate CRUD routes
router = routers.DefaultRouter()
router.register(r'users', UserViewSet)  # /api/users/
router.register(r'instructors', InstructorViewSet, basename='instructor')  # /api/instructors/
router.register(r'classes', YogaClassViewSet)  # /api/classes/
router.register(r'bookings', BookingViewSet)  # /api/bookings/
router.register(r'announcements', AnnouncementViewSet)  # /api/announcements/
router.register(r'packages', PackageViewSet)  # /api/packages/
router.register(r'purchases', PurchaseViewSet)  # /api/purchases/

urlpatterns = [
    path('admin/', admin.site.urls),  # Django admin

    # Who am I – returns the current authenticated user’s details
    path('api/auth/user/', current_user, name='current_user'),

    # Checkout endpoint (must be before router to avoid URL conflicts)
    path('api/checkout/', CheckoutAPIView.as_view(), name='checkout'),

    # Include all router-generated routes under /api/
    path('api/', include(router.urls)),

    # Token-based auth endpoint for JSON login
    path('api/token-auth/', obtain_auth_token, name='api_token_auth'),
]
