from rest_framework import serializers
from .models import User

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = User
        # add is_staff here so the frontend can see it
        fields = ['id', 'username', 'email', 'role', 'is_staff', 'password']
        read_only_fields = ['id', 'role', 'is_staff']

    def create(self, validated_data):
        validated_data['role'] = 'user'
        password = validated_data.pop('password')
        user = User(**validated_data)
        user.set_password(password)
        user.save()
        return user
