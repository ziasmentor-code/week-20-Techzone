from rest_framework import serializers
from .models import Product, Category

class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        # fields = ['id', 'name', 'description', 'created_at']
        fields="__all__"
        read_only_fields = ['id', 'created_at']

class ProductSerializer(serializers.ModelSerializer):
    category = CategorySerializer(read_only=True)
    category_id = serializers.PrimaryKeyRelatedField(
        queryset=Category.objects.all(), source='category', write_only=True, allow_null=True
    )
    image = serializers.ImageField(required=False)

    class Meta:
        model = Product
        # fields = ['id', 'name', 'description', 'price', 'category', 'category_id', 'created_at', 'updated_at']
        fields = "__all__"
        read_only_fields = ['id', 'created_at', 'updated_at']
        extra_kwargs={
            "category":{"required":False}
        }
