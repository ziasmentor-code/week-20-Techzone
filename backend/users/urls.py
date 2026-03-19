from django.urls import path
from .views import UserListView, RegisterView, UserProfileView
from . import views

urlpatterns = [
    path('users/', UserListView.as_view(), name='user-list'),
    path('register/', RegisterView.as_view(), name='register'),
    path('profile/', UserProfileView.as_view(), name='user-profile'),
    path('admin-dashboard/login/', views.admin_dashboard_login, name='admin_login'),
    path('wishlist/', views.wishlist_view, name='wishlist'),
]