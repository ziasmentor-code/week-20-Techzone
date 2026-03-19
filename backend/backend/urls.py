from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from rest_framework_simplejwt.views import TokenObtainPairView

urlpatterns = [
    path('admin/', admin.site.urls),

    # 🔐 Authentication
    path('api/login/', TokenObtainPairView.as_view(), name='login'),

    # 👤 Users & Admin Dashboard (ഇവിടെയാണ് മാറ്റം വരുത്തിയത്)
    # നിങ്ങളുടെ views.py ഫയൽ 'users' എന്ന ആപ്പിലാണെങ്കിൽ ഇത് കൃത്യമാണ്
    path('api/', include('users.urls')), 

    # 🛒 Other Modules
    path('api/cart/', include('cart.urls')),
    path('api/products/', include('products.urls')),
    path('api/orders/', include('orders.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)