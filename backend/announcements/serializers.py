from rest_framework import serializers
from .models import Announcement

class AnnouncementSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(
        source='author.username',
        read_only=True
    )

    class Meta:
        model = Announcement
        fields = ['id', 'title', 'content', 'date', 'author_name']
        read_only_fields = ['id', 'date', 'author_name']
