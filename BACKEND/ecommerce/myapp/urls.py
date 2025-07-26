from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import TokenRefreshView

from .views import (
    RegisterView,
    UserViewSet,
    CategoryViewSet,
    ProductViewSet,
    ProductVariantViewSet,
    AddressViewSet,
    OrderViewSet,
    OrderItemViewSet,
    CartItemViewSet,
    PaymentViewSet,
    MyTokenObtainPairView,
    initkhalti,
    admin_metrics,
    verify_khalti,
    khalti_webhook
)

router = DefaultRouter()
router.register(r'users', UserViewSet)
router.register(r'categories', CategoryViewSet, basename='category')
router.register(r'products', ProductViewSet)
router.register(r'product-variants', ProductVariantViewSet)
router.register(r'addresses', AddressViewSet)
router.register(r'orders', OrderViewSet)
router.register(r'order-items', OrderItemViewSet)
router.register(r'cart-items', CartItemViewSet)
router.register(r'payments', PaymentViewSet)

urlpatterns = [
    path('register/', RegisterView.as_view(), name='register'),
    path('login/', MyTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('', include(router.urls)),
]

urlpatterns += [
    path('api/admin/metrics/', admin_metrics, name='admin-metrics'),
    path('api/initiate-khalti-payment/', initkhalti, name='initiate-khalti-payment'),
    path('api/verify-khalti/', verify_khalti, name='verify-khalti'),
    path('api/khalti-webhook/', khalti_webhook, name='khalti-webhook'),
]
