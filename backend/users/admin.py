from django.contrib import admin  
from django.contrib.auth.admin import UserAdmin  
from .models import User  

@admin.register(User)  # register the custom User model with the admin site
class CustomUserAdmin(UserAdmin):
    # add the 'role' field to the “add user” form
    add_fieldsets = UserAdmin.add_fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    # include the 'role' field in the user change/edit form
    fieldsets = UserAdmin.fieldsets + (
        ('Role', {'fields': ('role',)}),
    )
    # show these columns in the user list view
    list_display = ('username', 'email', 'role', 'is_staff', 'is_active')
