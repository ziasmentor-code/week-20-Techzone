from django.urls import path
from .views import (
    CartItemListCreateView,
    CartItemDetailView,
    cart_total_view,
    clear_cart_view
)

urlpatterns = [
    path('', CartItemListCreateView.as_view(), name='cart-list-create'),
    path('<int:pk>/', CartItemDetailView.as_view(), name='cart-detail'),
    path('total/', cart_total_view, name='cart-total'),
    path('clear/', clear_cart_view, name='cart-clear'),
]
