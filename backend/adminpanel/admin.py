from django.contrib import admin
from orders.models import Order, OrderItem
from products.models import Product

# --- ORDER SECTION ---
class OrderItemInline(admin.TabularInline):
    model = OrderItem
    extra = 0

# ഇതിനകം എവിടെയെങ്കിലും രജിസ്റ്റർ ചെയ്തിട്ടുണ്ടെങ്കിൽ അത് ഒഴിവാക്കി പുതിയത് നൽകുന്നു
try:
    admin.site.unregister(Order)
except admin.sites.NotRegistered:
    pass

@admin.register(Order)
class OrderAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'total_price', 'status', 'created_at']
    list_filter = ['status']
    inlines = [OrderItemInline]

# --- PRODUCT SECTION ---
try:
    admin.site.unregister(Product)
except admin.sites.NotRegistered:
    pass

@admin.register(Product)
class ProductAdmin(admin.ModelAdmin):
    # 'stock' എറർ ഒഴിവാക്കാൻ സുരക്ഷിതമായ ഫീൽഡുകൾ മാത്രം നൽകുന്നു
    list_display = ['id', 'name', 'price']
    search_fields = ['name']

# --- ADMIN LOOK ---
admin.site.site_header = "Tech Zone Admin"
admin.site.index_title = "Welcome to Tech Zone Management"