from django.urls import path
from .views import (
    ProductListCreateView, 
    ProductDetailView, 
    CategoryListCreateView  # ഇത് ഇവിടെ ചേർത്തു
)

urlpatterns = [
    # പ്രൊഡക്റ്റുകൾക്കുള്ള പാത്തുകൾ
    path('', ProductListCreateView.as_view(), name='product-list-create'),
    path('<int:pk>/', ProductDetailView.as_view(), name='product-detail'),
    
    # കാറ്റഗറികൾക്കുള്ള പാത്ത് (ഇതാണ് നമുക്ക് വേണ്ടത്)
    path('categories/', CategoryListCreateView.as_view(), name='category-list-create'),
]