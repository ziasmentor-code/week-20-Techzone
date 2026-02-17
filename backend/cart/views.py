from rest_framework import generics, permissions,authentication
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes,authentication_classes
from .models import Cart, CartItem 
from .serializers import CartItemSerializer



class CartItemListCreateView(generics.ListCreateAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated] 

    authentication_classes=[
        authentication.SessionAuthentication,
        authentication.BaseAuthentication
    ]

    def get_queryset(self):
       
        return CartItem.objects.filter(cart__user=self.request.user)

    def perform_create(self, serializer):
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data.get('quantity', 1)
        
     
        cart, created = Cart.objects.get_or_create(user=self.request.user)
        
       
        cart_item = CartItem.objects.filter(cart=cart, product=product).first()
        
        if cart_item:
         
            cart_item.quantity += quantity
            cart_item.save()
        else:
            
            serializer.save(cart=cart)


class CartItemDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated] 
    authentication_classes = [authentication.SessionAuthentication, authentication.BasicAuthentication]

    def get_queryset(self):
        return CartItem.objects.filter(cart__user=self.request.user)


@api_view(['GET'])
@permission_classes([permissions.IsAuthenticated])
def cart_total_view(request):
    cart_items = CartItem.objects.filter(cart__user=request.user)
  
    total = sum(item.total_price for item in cart_items)
    return Response({'total': total})


@api_view(['DELETE'])
@permission_classes([permissions.IsAuthenticated])
def clear_cart_view(request):
    CartItem.objects.filter(cart__user=request.user).delete()
    return Response({'detail': 'Cart cleared successfully.'})