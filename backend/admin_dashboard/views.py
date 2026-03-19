from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from products.models import Product, Category
from products.serializers import ProductSerializer, CategorySerializer
from django.contrib.auth import authenticate

# ================================
# ADMIN PRODUCT MANAGEMENT
# ================================

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_products(request):
    """
    GET  -> List all products
    POST -> Create new product
    """

    # GET ALL PRODUCTS
    if request.method == 'GET':
        products = Product.objects.all().order_by('-id')
        serializer = ProductSerializer(products, many=True, context={'request': request})
        return Response(serializer.data)

    # CREATE PRODUCT
    if request.method == 'POST':
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_product_detail(request, pk):
    """
    GET    -> Get single product
    PUT    -> Update product
    DELETE -> Delete product
    """

    product = get_object_or_404(Product, pk=pk)

    # GET SINGLE PRODUCT
    if request.method == 'GET':
        serializer = ProductSerializer(product, context={'request': request})
        return Response(serializer.data)

    # UPDATE PRODUCT
    if request.method == 'PUT':
        serializer = ProductSerializer(
            product,
            data=request.data,
            partial=True,
            context={'request': request}
        )
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # DELETE PRODUCT
    if request.method == 'DELETE':
        product.delete()
        return Response(
            {'message': 'Product deleted successfully'},
            status=status.HTTP_204_NO_CONTENT
        )


# ================================
# CATEGORY LIST (PUBLIC)
# ================================

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)



@api_view(['POST'])
@permission_classes([AllowAny])
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')

    user = authenticate(username=username, password=password)

    if user is not None and user.is_staff:
        return Response({"message": "Login Success"})
    else:
        return Response({"error": "Invalid Credentials"}, status=status.HTTP_401_UNAUTHORIZED)