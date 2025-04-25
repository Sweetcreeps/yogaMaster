from rest_framework import serializers
from .models import Booking
from classes.serializers import YogaClassSerializer

class BookingSerializer(serializers.ModelSerializer):
    # don’t require user in the POST payload; it’s set automatically
    user = serializers.StringRelatedField(read_only=True)
    # when writing, accept a class ID; when reading, return the full nested object
    yoga_class_id = serializers.PrimaryKeyRelatedField(
        source='yoga_class',
        queryset=Booking.objects.model.yoga_class.field.remote_field.model.objects.all(),
        write_only=True
    )
    yoga_class = YogaClassSerializer(read_only=True)

    class Meta:
        model = Booking
        fields = ['id', 'user', 'yoga_class', 'yoga_class_id']
        read_only_fields = ['id', 'user', 'yoga_class']
