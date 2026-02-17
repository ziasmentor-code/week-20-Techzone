from django.urls import path
from .views import (
    WishlistListCreateView,
    WishlistDeleteView,
    toggle_wishlist_item
)

urlpatterns = [
    path('', WishlistListCreateView.as_view(), name='wishlist-list-create'),
    path('<int:pk>/', WishlistDeleteView.as_view(), name='wishlist-delete'),
    path('toggle/', toggle_wishlist_item, name='wishlist-toggle'),
]
