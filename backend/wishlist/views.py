from rest_framework import generics, permissions, status, serializers
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes, authentication_classes
from rest_framework_simplejwt.authentication import JWTAuthentication # ✅ ഇമ്പോർട്ട് ചെയ്യുക
from .models import Wishlist
from .serializers import WishlistSerializer

class WishlistListCreateView(generics.ListCreateAPIView):
    serializer_class = WishlistSerializer
    # ✅ JWTAuthentication ഇവിടെ നേരിട്ട് നൽകുന്നത് 403 ഒഴിവാക്കാൻ സഹായിക്കും
    authentication_classes = [JWTAuthentication] 
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        user = self.request.user
        product = serializer.validated_data['product']

        if Wishlist.objects.filter(user=user, product=product).exists():
            raise serializers.ValidationError(
                {"detail": "This product is already in your wishlist."}
            )
        serializer.save(user=user)

class WishlistDeleteView(generics.DestroyAPIView):
    authentication_classes = [JWTAuthentication] # ✅ ഇവിടെയും ചേർക്കുക
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Wishlist.objects.filter(user=self.request.user)

# ✅ Toggle wishlist (Add/Remove)
@api_view(['POST'])
@authentication_classes([JWTAuthentication]) # ✅ ഡെക്കറേറ്റർ ആയി നൽകുക
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
        return Response({"detail": "Removed from wishlist"}, status=status.HTTP_200_OK)

    Wishlist.objects.create(
        user=request.user,
        product_id=product_id
    )
    return Response({"detail": "Added to wishlist"}, status=status.HTTP_201_CREATED)