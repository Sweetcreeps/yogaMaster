from rest_framework import viewsets, permissions, status  
from rest_framework.views import APIView                   
from rest_framework.response import Response               
from django.shortcuts import get_object_or_404              

from .models import Package, Purchase, PaymentMethod        
from .serializers import PackageSerializer, PurchaseSerializer  


class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    """
    Read-only endpoint for viewing available packages.
    """
    queryset = Package.objects.all()             # fetch all packages
    serializer_class = PackageSerializer         # how we serialize them
    permission_classes = [permissions.AllowAny]  # open to anyone


class PurchaseViewSet(viewsets.ModelViewSet):
    """
    CRUD for purchases—only authenticated users may create or view.
    """
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]  # must be logged in

    def perform_create(self, serializer):
        # automatically link the new purchase to the current user
        serializer.save(user=self.request.user)


class CheckoutAPIView(APIView):
    """
    Custom checkout endpoint handling both Stripe and manual card flows.
    """
    permission_classes = [permissions.IsAuthenticated]  # require login

    def post(self, request):
        user   = request.user
        data   = request.data
        pkg_id = data.get('package')
        pkg    = get_object_or_404(Package, id=pkg_id)  # 404 if package not found

        # --- Stripe payment flow ---
        stripe_pm = data.get('stripe_payment_method')
        if stripe_pm:
            # record purchase immediately; could save PM if desired
            Purchase.objects.create(user=user, package=pkg)
            return Response(
                {'detail': 'Purchase stored (Stripe flow)'},
                status=status.HTTP_201_CREATED
            )

        # --- Manual dummy-card flow ---
        name     = data.get('cardholder_name')
        number   = data.get('card_number', '').replace(' ', '')
        expiry   = data.get('expiry', '')
        cvv      = data.get('cvv')
        remember = data.get('remember', False)

        # ensure all fields are present
        if not all([name, number, expiry, cvv]):
            return Response(
                {'detail': 'All card fields required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # parse expiry in MM/YY or MM/YYYY format
        try:
            mm, yy = expiry.split('/')
            mm = int(mm)
            yy = int(yy) + (2000 if len(yy) == 2 else 0)
        except:
            return Response(
                {'detail': 'Invalid expiry format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pm = None
        if remember:
            # store a PaymentMethod for the user
            pm = PaymentMethod.objects.create(
                user=user,
                cardholder_name=name,
                last4=number[-4:],       # only keep last 4 digits
                expiry_month=mm,
                expiry_year=yy
            )

        # record the purchase (with optional PM)
        Purchase.objects.create(user=user, package=pkg, payment_method=pm)
        return Response(
            {'detail': 'Purchase stored (manual flow)'},
            status=status.HTTP_201_CREATED
        )
