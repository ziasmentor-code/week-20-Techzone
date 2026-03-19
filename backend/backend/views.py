from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.parsers import MultiPartParser, FormParser, JSONParser
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

# Serializers and Models import
from products.models import Product, Category
from products.serializers import ProductSerializer, CategorySerializer, UserSerializer


# --- AUTHENTICATION ---

@api_view(['POST'])
@permission_classes([AllowAny])
def register_user(request):   # 🔥 ഇവിടെ പേര് മാറ്റി
    serializer = UserSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'user': UserSerializer(user).data
        }, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['POST'])
@permission_classes([AllowAny])
def admin_dashboard_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    user = authenticate(username=username, password=password)
    if user and user.is_staff:
        refresh = RefreshToken.for_user(user)
        return Response({
            'access': str(refresh.access_token),
            'user': {'username': user.username, 'is_staff': user.is_staff}
        })
    return Response({'error': 'Admin access denied'}, status=401)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user(request):
    return Response(UserSerializer(request.user).data)

# --- PRODUCT CRUD ---

@api_view(['GET', 'POST', 'PUT', 'DELETE'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser, JSONParser])
def admin_products(request, pk=None):
    if request.method == 'GET':
        if pk:
            product = get_object_or_404(Product, pk=pk)
            return Response(ProductSerializer(product, context={'request': request}).data)
        products = Product.objects.all().order_by('-id')
        return Response(ProductSerializer(products, many=True, context={'request': request}).data)

    elif request.method == 'POST':
        serializer = ProductSerializer(data=request.data, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'PUT':
        product = get_object_or_404(Product, pk=pk)
        serializer = ProductSerializer(product, data=request.data, partial=True, context={'request': request})
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    elif request.method == 'DELETE':
        product = get_object_or_404(Product, pk=pk)
        product.delete()
        return Response(status=status.HTTP_204_NO_CONTENT)

# --- CATEGORIES (FIXES ATTRIBUTE ERROR) ---

@api_view(['GET'])
@permission_classes([AllowAny])
def category_list(request):
    """Returns all categories for dropdowns"""
    categories = Category.objects.all()
    serializer = CategorySerializer(categories, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([AllowAny])
def category_detail(request, pk):
    category = get_object_or_404(Category, pk=pk)
    return Response(CategorySerializer(category).data)

# --- DASHBOARD STATS ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def admin_stats(request):
    if not request.user.is_staff:
        return Response({'error': 'Forbidden'}, status=403)
    data = {
        'total_products': Product.objects.count(),
        'total_categories': Category.objects.count(),
        'total_users': User.objects.count(),
        'total_revenue': 0 # Replace with actual logic later
    }
    return Response(data)

# --- STOPPING 404 ERRORS (Cart/Wishlist) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    return Response([])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_view(request):
    return Response([])