# Generated by Django 5.0 on 2025-07-15 12:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('myapp', '0003_alter_product_image'),
    ]

    operations = [
        migrations.AddField(
            model_name='order',
            name='payment_method',
            field=models.CharField(choices=[('khalti', 'Khalti'), ('cod', 'Cash on Delivery')], default='khalti', max_length=20),
        ),
    ]
