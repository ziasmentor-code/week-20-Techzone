from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework.parsers import MultiPartParser, FormParser
from django.db.models import Sum

from adminpanel.models import Product
from adminpanel.serializers import ProductSerializer


# ================= PRODUCT CRUD =================

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_products(request):
    products = Product.objects.all().order_by('-id')
    serializer = ProductSerializer(products, many=True)
    return Response(serializer.data, status=status.HTTP_200_OK)


@api_view(['POST'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def add_product(request):
    serializer = ProductSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)

    print("Serializer Errors:", serializer.errors)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([AllowAny])
@parser_classes([MultiPartParser, FormParser])
def update_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)

    serializer = ProductSerializer(product, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([AllowAny])
def delete_product(request, pk):
    try:
        product = Product.objects.get(pk=pk)
        product.delete()
        return Response({"message": "Deleted successfully"}, status=status.HTTP_200_OK)
    except Product.DoesNotExist:
        return Response({"error": "Product not found"}, status=status.HTTP_404_NOT_FOUND)


# ================= DASHBOARD STATS =================

@api_view(['GET'])
@permission_classes([AllowAny])
def admin_stats(request):
    total_products = Product.objects.count()

    # Future ready (if you add Order model)
    total_orders = 0
    total_revenue = 0

    return Response({
        "total_products": total_products,
        "total_orders": total_orders,
        "total_revenue": total_revenue
    }, status=status.HTTP_200_OK)


# ================= CART =================

@api_view(['GET'])
@permission_classes([AllowAny])
def cart_view(request):
    return Response([], status=status.HTTP_200_OK)


# ================= WISHLIST =================

@api_view(['GET'])
@permission_classes([AllowAny])
def wishlist_view(request):
    return Response([], status=status.HTTP_200_OK)