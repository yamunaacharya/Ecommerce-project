from django.urls import path, include
from rest_framework.routers import DefaultRouter

from .views import (
    UserViewSet,
    CategoryViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    AddressViewSet,
    OrderViewSet,
    OrderItemViewSet,
    CartItemViewSet,
    PaymentViewSet,
)
router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet)
router.register(r'products', ProductViewSet)
router.register(r'product-variants', ProductVariantViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('', include(router.urls)),
]