from rest_framework import serializers  
from .models import User  

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)  # only accept password on input, never expose it in API

    class Meta:
        model = User
        # include is_staff so frontend knows who’s an admin/instructor
        fields = ['id', 'username', 'email', 'role', 'is_staff', 'password']
        read_only_fields = ['id', 'role', 'is_staff']  # prevent clients from tampering with these

    def create(self, validated_data):
        # default new users to role 'user'
        validated_data['role'] = 'user'
        # remove raw password so we can hash it properly
        password = validated_data.pop('password')
        user = User(**validated_data)  # build user without saving yet
        user.set_password(password)  # hash the password
        user.save()  # persist to DB
        return user  # return the newly created user instance
