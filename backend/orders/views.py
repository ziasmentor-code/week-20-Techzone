from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from rest_framework.views import APIView
from .models import Order, OrderItem
from products.models import Product

# ✅ 1. എല്ലാ ഓർഡറുകളും ലിസ്റ്റ് ചെയ്യാൻ (യൂസറിന് മാത്രം)
class OrderListView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        orders = Order.objects.filter(user=request.user).order_by('-created_at')
        # ഇവിടെ സിംപിൾ ആയി ഡാറ്റ അയക്കുന്നു, നിങ്ങൾക്ക് വേണമെങ്കിൽ സീരിയലൈസർ ഉപയോഗിക്കാം
        data = []
        for order in orders:
            data.append({
                "id": order.id,
                "total_price": order.total_price,
                "status": order.status,
                "created_at": order.created_at,
                "shipping_address": order.shipping_address,
                "phone": order.phone
            })
        return Response(data)

# ✅ 2. ഒരു സിംഗിൾ ഓർഡറിന്റെ ഡീറ്റെയിൽസ് കാണാൻ
class OrderDetailView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, pk):
        try:
            order = Order.objects.get(pk=pk, user=request.user)
            return Response({"id": order.id, "total_price": order.total_price}) # കൂടുതൽ വിവരങ്ങൾ ചേർക്കാം
        except Order.DoesNotExist:
            return Response({'detail': 'Order not found'}, status=status.HTTP_404_NOT_FOUND)

# ✅ 3. പുതിയ ഓർഡർ പ്ലേസ് ചെയ്യാൻ
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def place_order(request):
    data = request.data
    order_items = data.get('orderItems')

    if not order_items or len(order_items) == 0:
        return Response({'detail': 'No items in order'}, status=status.HTTP_400_BAD_REQUEST)

    # ഓർഡർ ക്രിയേറ്റ് ചെയ്യുന്നു
    order = Order.objects.create(
        user=request.user,
        total_price=data.get('totalPrice'),
        shipping_address=data.get('shippingAddress'),
        phone=data.get('phone'),
        status='pending'
    )

    # ഐറ്റങ്ങൾ ക്രിയേറ്റ് ചെയ്യുന്നു
    for item in order_items:
        product = Product.objects.get(id=item['id'])
        OrderItem.objects.create(
            product=product,
            order=order,
            quantity=item['quantity'],
            price=item['price']
        )

    return Response({'detail': 'Order successful', 'order_id': order.id}, status=status.HTTP_201_CREATED)