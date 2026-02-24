from rest_framework import serializers
from .models import Order, OrderItem

class OrderItemSerializer(serializers.ModelSerializer):
    # പ്രോഡക്റ്റിന്റെ പേരും ചിത്രവും ഫ്രണ്ട് എൻഡിലേക്ക് അയക്കാൻ
    product_name = serializers.ReadOnlyField(source='product.name')
    product_image = serializers.ImageField(source='product.image', read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'product_name', 'product_image', 'price', 'quantity']

class OrderSerializer(serializers.ModelSerializer):
    # ഓർഡറിലുള്ള എല്ലാ ഐറ്റംസിനെയും ഉൾപ്പെടുത്തുന്നു
    items = OrderItemSerializer(many=True, read_only=True, source='orderitem_set')

    class Meta:
        model = Order
        fields = ['id', 'user', 'total_price', 'status', 'created_at', 'items']