from rest_framework import serializers
from .models import YogaClass
from users.models import User

class YogaClassSerializer(serializers.ModelSerializer):
    # writeable PK field for instructor
    instructor = serializers.PrimaryKeyRelatedField(
        queryset=User.objects.filter(role='admin')
    )
    # if you still want to return the username in responses, add a read-only field:
    instructor_name = serializers.CharField(
        source='instructor.username', read_only=True
    )

    class Meta:
        model = YogaClass
        # explicitly list so we include instructor_name
        fields = [
            'id',
            'title',
            'description',
            'date',
            'start_time',
            'duration',
            'capacity',
            'instructor',
            'instructor_name',
        ]
        read_only_fields = ['description', 'instructor_name']
