# products/admin.py
from django.contrib import admin
from .models import Product

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # Only include fields that actually exist in your models.py
    list_display = ('name', 'price', 'stock') 
    # Remove 'list_filter' if 'category' doesn't exist