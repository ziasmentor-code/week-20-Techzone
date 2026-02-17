from rest_framework import generics, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework import serializers
from .models import Wishlist
from .serializers import WishlistSerializer


class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']

        # ✅ prevent duplicate wishlist item
        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError(
                {"detail": "This product is already in your wishlist."}
            )

        serializer.save(user=user)


class WishlistDeleteView(generics.DestroyAPIView):
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)


# ✅ OPTIONAL: Toggle wishlist (add/remove)
@api_view(['POST'])
@permission_classes([permissions.IsAuthenticated])
def toggle_wishlist_item(request):
    product_id = request.data.get('product_id')

    if not product_id:
        return Response(
            {"detail": "product_id is required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    item = Wishlist.objects.filter(
        user=request.user,
        product_id=product_id
    ).first()

    if item:
        item.delete()
        return Response({"detail": "Removed from wishlist"})

    Wishlist.objects.create(
        user=request.user,
        product_id=product_id
    )
    return Response({"detail": "Added to wishlist"}, status=201)
