from django.urls import path
from .views import OrderListView, OrderDetailView, place_order

urlpatterns = [
    path('', OrderListView.as_view(), name='order-list'),
    path('<int:pk>/', OrderDetailView.as_view(), name='order-detail'),
    path('place/', place_order, name='place-order'),
]