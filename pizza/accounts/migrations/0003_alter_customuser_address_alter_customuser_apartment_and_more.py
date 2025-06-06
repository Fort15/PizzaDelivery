# Generated by Django 5.1.7 on 2025-05-28 19:07

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('accounts', '0002_customuser_apartment_customuser_floor_and_more'),
    ]

    operations = [
        migrations.AlterField(
            model_name='customuser',
            name='address',
            field=models.CharField(blank=True, max_length=255, null=True, verbose_name='Адрес'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='apartment',
            field=models.CharField(blank=True, max_length=10, null=True, verbose_name='Квартира'),
        ),
        migrations.AlterField(
            model_name='customuser',
            name='floor',
            field=models.CharField(blank=True, max_length=10, null=True, verbose_name='Этаж'),
        ),
    ]
