from django.db import models  
from django.conf import settings  

class Package(models.Model):
    name        = models.CharField(max_length=50)   # e.g. “Monthly Subscription”
    description = models.TextField()                 # package details shown to users
    price       = models.DecimalField(max_digits=7, decimal_places=2)  # up to £99999.99

    def __str__(self):
        return self.name  # makes packages readable in admin & shells

class PaymentMethod(models.Model):
    user            = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    cardholder_name = models.CharField(max_length=100)  # name set on the card
    last4           = models.CharField(max_length=4)    # store only last 4 digits
    expiry_month    = models.PositiveSmallIntegerField()
    expiry_year     = models.PositiveSmallIntegerField()
    created_at      = models.DateTimeField(auto_now_add=True)  # timestamp when saved

    def __str__(self):
        # helpful repr so admins can see which card it is
        return f"{self.user.username} • **** **** **** {self.last4}"

class Purchase(models.Model):
    user           = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    package        = models.ForeignKey(Package, on_delete=models.CASCADE)  # what they bought
    payment_method = models.ForeignKey(
                        PaymentMethod,
                        null=True,
                        blank=True,
                        on_delete=models.SET_NULL
                     )  # optional if using Stripe flow
    purchased_at   = models.DateTimeField(auto_now_add=True)  # when the purchase happened

    def __str__(self):
        # shows who bought what and when—nice for logs or admin view
        return f"{self.user.username} bought {self.package.name} at {self.purchased_at}"
