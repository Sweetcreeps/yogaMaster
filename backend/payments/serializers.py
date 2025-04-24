from rest_framework import serializers
from .models import Package, Purchase

class PackageSerializer(serializers.ModelSerializer):
    class Meta:
        model = Package
        fields = ['id','name','description','price']

class PurchaseSerializer(serializers.ModelSerializer):
    package = serializers.PrimaryKeyRelatedField(queryset=Package.objects.all())
    class Meta:
        model = Purchase
        fields = ['id','package','purchased_at']
        read_only_fields = ['id','purchased_at']
