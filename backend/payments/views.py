# backend/payments/views.py

from rest_framework import viewsets, permissions, status
from rest_framework.views import APIView
from rest_framework.response import Response
from django.shortcuts import get_object_or_404

from .models import Package, Purchase, PaymentMethod
from .serializers import PackageSerializer, PurchaseSerializer

class PackageViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Package.objects.all()
    serializer_class = PackageSerializer
    permission_classes = [permissions.AllowAny]

class PurchaseViewSet(viewsets.ModelViewSet):
    queryset = Purchase.objects.all()
    serializer_class = PurchaseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

class CheckoutAPIView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        user   = request.user
        data   = request.data
        pkg_id = data.get('package')
        pkg    = get_object_or_404(Package, id=pkg_id)

        # Stripe flow (CardElement)
        stripe_pm = data.get('stripe_payment_method')
        if stripe_pm:
            # optional: handle "remember" here if you want, otherwise just record purchase
            Purchase.objects.create(user=user, package=pkg)
            return Response({'detail':'Purchase stored (Stripe flow)'}, status=status.HTTP_201_CREATED)

        # Manual dummy‐card flow
        name    = data.get('cardholder_name')
        number  = data.get('card_number','').replace(' ','')
        expiry  = data.get('expiry','')
        cvv     = data.get('cvv')
        remember= data.get('remember', False)

        # validate fields
        if not all([name, number, expiry, cvv]):
            return Response(
                {'detail':'All card fields required'},
                status=status.HTTP_400_BAD_REQUEST
            )

        # parse expiry MM/YY
        try:
            mm, yy = expiry.split('/')
            mm = int(mm)
            yy = int(yy) + (2000 if len(yy)==2 else 0)
        except:
            return Response(
                {'detail':'Invalid expiry format'},
                status=status.HTTP_400_BAD_REQUEST
            )

        pm = None
        if remember:
            pm = PaymentMethod.objects.create(
                user=user,
                cardholder_name=name,
                last4=number[-4:],
                expiry_month=mm,
                expiry_year=yy
            )

        Purchase.objects.create(user=user, package=pkg, payment_method=pm)
        return Response({'detail':'Purchase stored (manual flow)'}, status=status.HTTP_201_CREATED)
