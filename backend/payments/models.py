# backend/payments/models.py

from django.db import models
from django.conf import settings

class Package(models.Model):
    name        = models.CharField(max_length=50)
    description = models.TextField()
    price       = models.DecimalField(max_digits=7, decimal_places=2)

    def __str__(self):
        return self.name

class PaymentMethod(models.Model):
    user             = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cardholder_name  = models.CharField(max_length=100)
    last4            = models.CharField(max_length=4)
    expiry_month     = models.PositiveSmallIntegerField()
    expiry_year      = models.PositiveSmallIntegerField()
    created_at       = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} • **** **** **** {self.last4}"

class Purchase(models.Model):
    user            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    package         = models.ForeignKey(Package, on_delete=models.CASCADE)
    payment_method  = models.ForeignKey(
                        PaymentMethod,
                        null=True,
                        blank=True,
                        on_delete=models.SET_NULL
                     )
    purchased_at    = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} bought {self.package.name} at {self.purchased_at}"
