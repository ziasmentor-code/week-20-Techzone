from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from .models import Order, OrderItem
from cart.models import CartItem
from .serializers import OrderSerializer

# List all orders for a user
class OrderListView(generics.ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# Retrieve details of a single order
class OrderDetailView(generics.RetrieveAPIView):
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Order.objects.filter(user=self.request.user)

# Place an order (from cart)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def place_order(request):
    cart_items = CartItem.objects.filter(cart__user=request.user)

    if not cart_items.exists():
        return Response(
            {'detail': 'Cart is empty.'},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ✅ Calculate total price
    total_price = sum(
        item.product.price * item.quantity
        for item in cart_items
    )

    # ✅ Create order (FIXED FIELD NAME)
    order = Order.objects.create(
        user=request.user,
        total_price=total_price
    )

    # Create order items
    for item in cart_items:
        OrderItem.objects.create(
            order=order,
            product=item.product,
            price=item.product.price,
            quantity=item.quantity
        )

    # Clear cart
    cart_items.delete()

    serializer = OrderSerializer(order)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
