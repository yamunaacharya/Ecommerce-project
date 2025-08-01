from rest_framework import serializers
from .models import User, Category, Product, ProductVariant, Address, Order, OrderItem, CartItem, Payment

# --- Register Serializer for User Signup ---
class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, required=True, style={'input_type': 'password'})
    password2 = serializers.CharField(write_only=True, required=True, label="Confirm password", style={'input_type': 'password'})

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'phone', 'role', 'password', 'password2']

    def validate(self, attrs):
        if attrs['password'] != attrs['password2']:
            raise serializers.ValidationError({"password": "Password fields didn't match."})
        return attrs

    def create(self, validated_data):
        validated_data.pop('password2') 
        password = validated_data.pop('password')
        user = User.objects.create_user(**validated_data)
        user.set_password(password)
        user.save()
        return user

# 1. User Serializer 
class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role', 'phone']
        extra_kwargs = {
            'password': {'write_only': True}
        }

    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        return user

# 2. Category Serializer 
class CategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category
        fields = ['id', 'name', 'description']

# 3. Product Variant Serializer
class ProductVariantSerializer(serializers.ModelSerializer):
    class Meta:
        model = ProductVariant
        fields = ['id', 'product', 'variant_name', 'variant_value', 'stock_quantity', 'image']

# 4. Product Serializer 
class ProductSerializer(serializers.ModelSerializer):
    variants = ProductVariantSerializer(many=True, read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Product
        fields = ['id', 'name', 'description', 'price', 'stock_quantity', 'category', 'image', 'image_url', 
                  'created_at', 'updated_at', 'variants']

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

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
        fields = ['id', 'order', 'product', 'variant', 'quantity', 'price']

# 7. Order Serializer
class OrderSerializer(serializers.ModelSerializer):
    items = OrderItemSerializer(many=True, read_only=True)
    user = UserSerializer(read_only=True)
    payment_method = serializers.ChoiceField(choices=Order.PAYMENT_CHOICES, required=True)

    class Meta:
        model = Order
        fields = [
            'id',
            'user',
            'customer_name',         
            'shipping_address',      
            'status',
            'total_amount',
            'order_date',
            'items',
            'payment_method',
            'khalti_transaction_id',
            'khalti_token',
        ]

# 8. Cart Item Serializer
class CartItemSerializer(serializers.ModelSerializer):
    product = serializers.PrimaryKeyRelatedField(queryset=Product.objects.all(), write_only=True)
    product_detail = ProductSerializer(source='product', read_only=True)
    variant = serializers.PrimaryKeyRelatedField(queryset=ProductVariant.objects.all(), 
                                                 required=False, allow_null=True)
    user = serializers.PrimaryKeyRelatedField(read_only=True)

    class Meta:
        model = CartItem
        fields = ['id', 'user', 'product', 'product_detail', 'variant', 'quantity', 'added_at']

# 9. Payment Serializer
class PaymentSerializer(serializers.ModelSerializer):
    order = OrderSerializer(read_only=True)
    user = UserSerializer(read_only=True)

    class Meta:
        model = Payment
        fields = ['id', 'user', 'order', 'amount', 'transaction_id', 'status', 'payment_date']
