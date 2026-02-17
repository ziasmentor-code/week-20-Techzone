from rest_framework import serializers
from .models import CartItem

class CartItemSerializer(serializers.ModelSerializer):

    total_price = serializers.ReadOnlyField() 

    class Meta:
        model = CartItem
        fields = ['id', 'cart', 'product', 'quantity', 'total_price']