from rest_framework import serializers
from django.contrib.auth.models import User
from .models import Product, Category

# Add this class to your file
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'is_staff', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        # This ensures the password is encrypted correctly
        user = User.objects.create_user(**validated_data)
        return user

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    # This allows you to see category details in the product response
    category_name = serializers.ReadOnlyField(source='category.name')

    class Meta:
        model = Product
        fields = '__all__'