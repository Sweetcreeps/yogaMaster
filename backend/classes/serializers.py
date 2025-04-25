from rest_framework import serializers  
from .models import YogaClass          
from users.models import User          

class YogaClassSerializer(serializers.ModelSerializer):
    # include the instructor’s username in the serialized output
    instructor_name = serializers.CharField(
        source='instructor.username',  # pull from the related User
        read_only=True                 # only for reading, not writing
    )
    # allow clients to set instructor by their user ID
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(is_staff=True),  # only staff can be instructors
        help_text='ID of a staff user who will teach this class'  # for API docs
    )
    # calculate how many spots have been booked
    spots_taken = serializers.SerializerMethodField()
    # calculate remaining spots based on capacity
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
            'instructor',        
            'instructor_name',   
            'spots_taken',       
            'spots_remaining',   
        ]

    def get_spots_taken(self, obj):
        # count related bookings (default related_name: booking_set)
        return obj.booking_set.count()

    def get_spots_remaining(self, obj):
        # subtract taken spots from capacity
        return obj.capacity - obj.booking_set.count()
