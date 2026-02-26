from django.contrib import admin
from django.urls import path
from django.conf import settings
from django.conf.urls.static import static
from . import views

urlpatterns = [
    path('admin/', admin.site.urls),

    # ===== PRODUCT CRUD =====
    path('api/admin-products/', views.admin_products, name='admin-products'),
    path('api/add-product/', views.add_product, name='add-product'),
    path('api/update-product/<int:pk>/', views.update_product, name='update-product'),
    path('api/delete-product/<int:pk>/', views.delete_product, name='delete-product'),

    # ===== DASHBOARD =====
    path('api/admin-stats/', views.admin_stats, name='admin-stats'),

    # ===== CART & WISHLIST =====
    path('api/cart/', views.cart_view, name='cart'),
    path('api/wishlist/', views.wishlist_view, name='wishlist'),
]

# Media files support
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)