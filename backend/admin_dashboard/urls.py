from django.urls import path
from .views import admin_products, admin_product_detail, category_list

urlpatterns = [
    path('admin/products/', admin_products),
    path('admin/products/<int:pk>/', admin_product_detail),
    path('categories/', category_list),
]