from rest_framework import viewsets, generics, permissions, filters
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.views import TokenObtainPairView
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework import status
from rest_framework.response import Response
from rest_framework import serializers
from rest_framework.decorators import action
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework.permissions import IsAdminUser
from .models import Order, User, models

from .models import User, Category, Product, ProductVariant, Address, Order, OrderItem, CartItem, Payment
from .serializers import (
    UserSerializer,
    CategorySerializer,
    ProductSerializer,
    ProductVariantSerializer,
    AddressSerializer,
    OrderSerializer,
    OrderItemSerializer,
    CartItemSerializer,
    PaymentSerializer,
    RegisterSerializer,
)

# --- Custom JWT Token Serializer and View for Login with User Info ---
class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        data['user'] = {
            'id': self.user.id,
            'username': self.user.username,
            'role': self.user.role,
            'email': self.user.email,
        }
        return data

class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


# --- User Registration API View ---
class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    permission_classes = (permissions.AllowAny,)
    serializer_class = RegisterSerializer


class IsAdminOrReadOnly(permissions.BasePermission):
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_staff


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAdminUser] 


class CategoryViewSet(viewsets.ModelViewSet):
    queryset = Category.objects.all()
    serializer_class = CategorySerializer
    permission_classes = [IsAdminOrReadOnly]  


class ProductViewSet(viewsets.ModelViewSet):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer
    permission_classes = [IsAdminOrReadOnly]
    parser_classes = (MultiPartParser, FormParser)  
    filter_backends = [filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['name', 'description', 'category__name']
    ordering_fields = ['price', 'name']

    def get_serializer_context(self):
        context = super().get_serializer_context()
        context.update({"request": self.request})
        return context


class ProductVariantViewSet(viewsets.ModelViewSet):
    queryset = ProductVariant.objects.all()
    serializer_class = ProductVariantSerializer
    permission_classes = [permissions.IsAuthenticatedOrReadOnly]


class AddressViewSet(viewsets.ModelViewSet):
    queryset = Address.objects.all()
    serializer_class = AddressSerializer
    permission_classes = [permissions.IsAuthenticated]


class OrderViewSet(viewsets.ModelViewSet):
    queryset = Order.objects.all()
    serializer_class = OrderSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        user = self.request.user
        if user.is_staff or user.is_superuser:
            return Order.objects.all().order_by('-order_date')
        return Order.objects.filter(user=user).order_by('-order_date')

    def perform_create(self, serializer):
        order = serializer.save(user=self.request.user)
        from .models import CartItem, OrderItem
        cart_items = CartItem.objects.filter(user=self.request.user)
        for cart_item in cart_items:
            OrderItem.objects.create(
                order=order,
                product=cart_item.product,
                quantity=cart_item.quantity,
                price=cart_item.product.price,
            )
        cart_items.delete()


class OrderItemViewSet(viewsets.ModelViewSet):
    queryset = OrderItem.objects.all()
    serializer_class = OrderItemSerializer
    permission_classes = [permissions.IsAuthenticated]


class CartItemViewSet(viewsets.ModelViewSet):
    queryset = CartItem.objects.all()
    serializer_class = CartItemSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.validated_data['product']
        quantity = serializer.validated_data['quantity']
        if product.stock_quantity < quantity:
            return Response({ 'Not enough stock available.'}, status=status.HTTP_400_BAD_REQUEST)
        cart_item = serializer.save(user=request.user)
        product.stock_quantity -= quantity
        product.save()
        headers = self.get_success_headers(serializer.data)
        return Response(serializer.data, status=status.HTTP_201_CREATED, headers=headers)

    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        product = instance.product
        product.stock_quantity += instance.quantity
        product.save()
        return super().destroy(request, *args, **kwargs)

    def partial_update(self, request, *args, **kwargs):
        instance = self.get_object()
        old_quantity = instance.quantity
        response = super().partial_update(request, *args, **kwargs)
        instance.refresh_from_db()
        new_quantity = instance.quantity
        product = instance.product
        diff = old_quantity - new_quantity
        product.stock_quantity += diff
        product.save()
        return response

    @action(detail=False, methods=['delete'], url_path='clear')
    def clear_cart(self, request):
        user = request.user
        CartItem.objects.filter(user=user).delete()
        return Response({'detail': 'Cart cleared.'}, status=status.HTTP_204_NO_CONTENT)


class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer
    permission_classes = [permissions.IsAuthenticated]


@api_view(['GET'])
@permission_classes([IsAdminUser])
def admin_metrics(request):
    total_sales = Order.objects.aggregate(total=models.Sum('total_amount'))['total'] or 0
    total_orders = Order.objects.count()
    active_users = User.objects.filter(order__isnull=False).distinct().count()
    revenue = Order.objects.filter(status='delivered').aggregate(total=models.Sum('total_amount'))['total'] or 0
    return Response({
        'total_sales': total_sales,
        'total_orders': total_orders,
        'active_users': active_users,
        'revenue': revenue,
    })
