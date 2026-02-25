from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, IsAdminUser
from rest_framework.response import Response
from rest_framework import status
from rest_framework.generics import ListAPIView, RetrieveUpdateAPIView
from cart.models import Cart, CartItem
from .models import Order, OrderItem
from .serializers import OrderSerializer
from django.db.models import Sum

# 1. എല്ലാ ഓർഡറുകളും കാണാൻ
class OrderListView(ListAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        if self.request.user.is_staff:
            return Order.objects.all().order_by('-created_at')
        return Order.objects.filter(user=self.request.user).order_by('-created_at')

# 2. ഓർഡർ അപ്‌ഡേറ്റ് ചെയ്യാൻ (ഇതാണ് പ്രധാനം)
class OrderDetailView(RetrieveUpdateAPIView):
    serializer_class = OrderSerializer
    permission_classes = [IsAuthenticated] # അടിസ്ഥാനപരമായി ലോഗിൻ ചെയ്തവർക്ക്

    def get_queryset(self):
        return Order.objects.all()

    # അഡ്മിൻ പാനലിൽ നിന്നുള്ള PATCH റിക്വസ്റ്റ് ഇവിടെയാണ് കൈകാര്യം ചെയ്യുന്നത്
    def patch(self, request, *args, **kwargs):
        if not request.user.is_staff:
            return Response({"error": "Admin access required"}, status=status.HTTP_403_FORBIDDEN)
        
        instance = self.get_object()
        # സ്റ്റാറ്റസ് മാത്രം മാറ്റാൻ partial=True ഉപയോഗിക്കുന്നു
        serializer = self.get_serializer(instance, data=request.data, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

# 3. പുതിയ ഓർഡർ നൽകാൻ 
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    user = request.user
    try:
        cart, created = Cart.objects.get_or_create(user=user)
        cart_items = cart.items.all() 

        if not cart_items.exists():
            return Response(
                {"error": "Cart is empty"}, 
                status=status.HTTP_400_BAD_REQUEST
            )

        address = request.data.get('shippingAddress', 'No Address Provided')
        phone_no = request.data.get('phone', 'No Phone Provided')

        order = Order.objects.create(
            user=user,
            status="pending",
            total_price=0
        )

        total = 0
        for item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=item.product,
                quantity=item.quantity,
                price=item.product.price
            )
            total += item.product.price * item.quantity

        order.total_price = total
        order.save()

        cart_items.delete()

        return Response({
            "message": "Order placed successfully", 
            "order_id": order.id
        }, status=status.HTTP_201_CREATED)

    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# 4. അഡ്മിൻ ഡാഷ്‌ബോർഡിന് വേണ്ടിയുള്ള സ്റ്റാറ്റിസ്റ്റിക്സ്
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_dashboard_stats(request):
    if not request.user.is_staff:
        return Response({"error": "Unauthorized"}, status=403)
    
    # Delivered ആയ ഓർഡറുകളുടെ മാത്രം തുക കണക്കാക്കുന്നു
    total_revenue = Order.objects.filter(status='delivered').aggregate(Sum('total_price'))['total_price__sum'] or 0
    total_orders = Order.objects.count()
    
    return Response({
        "revenue": total_revenue,
        "orders_count": total_orders
    })