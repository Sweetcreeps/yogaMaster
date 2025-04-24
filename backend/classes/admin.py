from django.contrib import admin
from .models import YogaClass

@admin.register(YogaClass)
class YogaClassAdmin(admin.ModelAdmin):
    list_display    = ('title', 'date', 'start_time', 'instructor', 'capacity')
    list_filter     = ('date', 'title')
    search_fields   = ('title', 'instructor__username')
    readonly_fields = ('description',)  
    fieldsets       = (
        (None, {
            'fields': (
                'title',
                'date',
                'start_time',
                'duration',
                'instructor',
                'capacity',
                'description',  
            )
        }),
    )
