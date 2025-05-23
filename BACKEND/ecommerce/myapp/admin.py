from django.contrib import admin
from .models import User,CartItem,Category,Product,Payment,ProductVariant,Address,Order,OrderItem

# Register your models here.
admin.site.register([User,CartItem,Category,Product,Payment,ProductVariant,Address,Order,OrderItem])