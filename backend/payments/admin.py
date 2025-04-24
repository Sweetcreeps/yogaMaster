# backend/payments/admin.py

from django.contrib import admin
from .models import Package, Purchase

@admin.register(Package)
class PackageAdmin(admin.ModelAdmin):
    list_display = ('name','price')

@admin.register(Purchase)
class PurchaseAdmin(admin.ModelAdmin):
    list_display  = ('user','package','purchased_at')
    list_filter   = ('package',)
    search_fields = ('user__username',)
