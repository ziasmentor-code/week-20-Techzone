from django.urls import path
from .views import UserListView,RegisterView,UserProfileView

urlpatterns=[
    path('register/',RegisterView.as_view(), name='user-register'),
    path('profile/',UserProfileView.as_view(), name='user-profile'),
    path('', UserListView.as_view(), name='user-list'),
]