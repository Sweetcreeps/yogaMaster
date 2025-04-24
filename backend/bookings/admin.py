from django.contrib import admin
from .models import Booking

@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display  = ('user', 'yoga_class', 'timestamp')
    list_filter   = ('timestamp', 'yoga_class')
    search_fields = ('user__username', 'yoga_class__title')
