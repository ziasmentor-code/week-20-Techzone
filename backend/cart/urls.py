from django.urls import path
from .views import (
    view_cart, 
    add_to_cart, 
    update_cart_item, 
    remove_cart_item, 
    cart_total_view, 
    clear_cart_view
)

urlpatterns = [
    path('', view_cart, name='view_cart'),
    path('add/', add_to_cart, name='add_to_cart'),
    path('update/', update_cart_item, name='update_cart_item'),
    path('remove/<int:product_id>/', remove_cart_item, name='remove_cart_item'),
    path('total/', cart_total_view, name='cart_total'),
    path('clear/', clear_cart_view, name='clear_cart'),
]