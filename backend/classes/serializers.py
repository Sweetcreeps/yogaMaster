# backend/classes/serializers.py

from rest_framework import serializers
from .models import YogaClass
from users.models import User

class YogaClassSerializer(serializers.ModelSerializer):
    # read-only username for popup display
    instructor_name = serializers.CharField(
        source='instructor.username',
        read_only=True
    )
    # writeable PK field for instructor FK
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_staff=True),
        help_text='ID of a staff user who will teach this class'
    )
    spots_taken = serializers.SerializerMethodField()
    spots_remaining = serializers.SerializerMethodField()

    class Meta:
        model = YogaClass
        fields = [
            'id',
            'title',
            'date',
            'start_time',
            'duration',
            'capacity',
            'instructor',        # write this in POST/PUT
            'instructor_name',   # read-only for display
            'spots_taken',
            'spots_remaining',
        ]

    def get_spots_taken(self, obj):
        # default related_name is booking_set
        return obj.booking_set.count()

    def get_spots_remaining(self, obj):
        return obj.capacity - obj.booking_set.count()
