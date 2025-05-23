from rest_framework import serializers
from .models import (
    User, Category, Product, ProductVariant, Address,
    Order, OrderItem, CartItem, Payment
)

# 1. User Serializer
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']

# 2. Category Serializer
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

# 3. Product Variant Serializer
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'variant_name', 'variant_value', 'stock_quantity', 'image']

# 4. Product Serializer
class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity',
                  'category', 'image', 'created_at', 'updated_at', 'variants']

# 5. Address Serializer
class AddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = Address
        fields = ['id', 'user', 'city', 'state', 'zip_code', 'country']

# 6. Order Item Serializer
class OrderItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)

    class Meta:
        model = OrderItem
        fields = ['id', 'product', 'variant', 'quantity', 'price']

# 7. Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    address = AddressSerializer(read_only=True)

    class Meta:
        model = Order
        fields = ['id', 'user', 'address', 'status', 'total_amount', 'order_date', 'items']

# 8. Cart Item Serializer
class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(read_only=True)
    variant = ProductVariantSerializer(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'variant', 'quantity', 'added_at']

# 9. Payment Serializer
class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'order', 'amount', 'transaction_id', 'status', 'payment_date']
