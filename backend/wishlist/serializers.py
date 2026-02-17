from rest_framework import serializers
from .models import Wishlist
from products.models import Product
from products.serializers import ProductSerializer


class WishlistSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    product_id = serializers.PrimaryKeyRelatedField(
        queryset=Product.objects.all(),
        write_only=True,
        source='product'
    )

    class Meta:
        model = Wishlist
        fields = ['id', 'product', 'product_id', 'added_on']
        read_only_fields = ['id', 'added_on']
