from django.contrib import admin  # Django admin site registration
from .models import Package, Purchase  # payment-related models

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name', 'price')  # show name and price columns in admin list view

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display  = ('user', 'package', 'purchased_at')  # columns for user, package, timestamp
    list_filter   = ('package',)                        # filter purchases by package
    search_fields = ('user__username',)                 # enable search by user's username
