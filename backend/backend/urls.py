from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from . import views
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView

urlpatterns = [
    # Django admin
    path('admin/', admin.site.urls),
    
    # Custom admin dashboard (HTML templates)
    path('admin-dashboard/', include('admin_dashboard.urls')),
    
    # ===== API ENDPOINTS =====
    
    # JWT Authentication
    path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/register/', views.register, name='register'),  # ✅ ഇത് ഇവിടെ ഉണ്ട്
    
    # ===== PUBLIC API =====
    path('api/products/', views.product_list, name='product-list'),
    path('api/products/<int:pk>/', views.product_detail, name='product-detail'),
    
    # ===== CATEGORIES API =====
    path('api/categories/', views.category_list, name='category-list'),
    path('api/categories/<int:pk>/', views.category_detail, name='category-detail'),
    
    # ===== AUTHENTICATED API =====
    path('api/cart/', views.cart_view, name='cart'),
    path('api/wishlist/', views.wishlist_view, name='wishlist'),
    path('api/user/', views.get_user, name='user'),
    
    # ===== ADMIN API =====
    path('api/admin-products/', views.admin_products, name='admin-products'),
    path('api/admin-stats/', views.admin_stats, name='admin-stats'),
    
    # ===== ADMIN DASHBOARD API (Frontend admin login) =====
    path('api/admin-dashboard/login/', views.admin_dashboard_login, name='admin-dashboard-login'),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)