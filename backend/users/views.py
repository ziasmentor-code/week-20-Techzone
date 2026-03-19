from rest_framework import generics, permissions, status
from django.contrib.auth.models import User
from .serializers import UserSerializer, RegisterSerializer
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken

# --- AUTHENTICATION ---

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
            'refresh': str(refresh),
            'user': {
                'username': user.username,
                'email': user.email,
                'is_staff': user.is_staff
            }
        }, status=status.HTTP_200_OK)
    
    return Response({'error': 'Admin access denied or invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)

# --- USER VIEWS ---

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser]

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

class UserProfileView(generics.RetrieveUpdateAPIView):
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_object(self):
        return self.request.user

# --- PLACEHOLDER VIEWS (To stop 404/Attribute Errors) ---

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart_view(request):
    """ലോഗിൻ ചെയ്യുമ്പോൾ കാർട്ട് എറർ വരാതിരിക്കാൻ"""
    return Response([])

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def wishlist_view(request):
    """ലോഗിൻ ചെയ്യുമ്പോൾ വിഷ്‌ലിസ്റ്റ് എറർ വരാതിരിക്കാൻ"""
    return Response([])