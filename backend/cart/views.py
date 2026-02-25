from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Cart, CartItem
from .serializers import CartSerializer

# 1. കാർട്ട് കാണാൻ
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def view_cart(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    serializer = CartSerializer(cart)
    return Response(serializer.data)

# 2. കാർട്ടിലേക്ക് സാധനങ്ങൾ ആഡ് ചെയ്യാൻ
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def add_to_cart(request):
    product_id = request.data.get('product_id')
    quantity = int(request.data.get('quantity', 1))
    cart, created = Cart.objects.get_or_create(user=request.user)
    item, created = CartItem.objects.get_or_create(cart=cart, product_id=product_id)
    if not created:
        item.quantity += quantity
    else:
        item.quantity = quantity
    item.save()
    return Response({"message": "Added to cart"}, status=status.HTTP_201_CREATED)

# 3. ക്വാണ്ടിറ്റി അപ്ഡേറ്റ് ചെയ്യാൻ
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def update_cart_item(request):
    product_id = request.data.get('product_id')
    quantity = request.data.get('quantity')
    cart = Cart.objects.get(user=request.user)
    try:
        item = CartItem.objects.get(cart=cart, product_id=product_id)
        item.quantity = int(quantity)
        item.save()
        return Response({"message": "Quantity updated"})
    except CartItem.DoesNotExist:
        return Response({"error": "Item not found"}, status=404)

# 4. കാർട്ടിൽ നിന്ന് ഒഴിവാക്കാൻ
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def remove_cart_item(request, product_id):
    cart = Cart.objects.get(user=request.user)
    CartItem.objects.filter(cart=cart, product_id=product_id).delete()
    return Response({"message": "Item removed"})

# 5. ടോട്ടൽ തുക കാണാൻ (ഇതാണ് നിങ്ങളുടെ ImportError പരിഹരിക്കുന്നത്)
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_total_view(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    total = sum(item.product.price * item.quantity for item in cart.items.all())
    return Response({"total_price": total})

# 6. കാർട്ട് ക്ലിയർ ചെയ്യാൻ
@api_view(['POST'])
@permission_classes([IsAuthenticated])
def clear_cart_view(request):
    cart, created = Cart.objects.get_or_create(user=request.user)
    cart.items.all().delete()
    return Response({"message": "Cart cleared"})