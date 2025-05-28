from django.db import models

class ProductCategory(models.Model):
    name = models.CharField(max_length=100)  # Пицца, Напитки, Закуски
    icon = models.CharField(max_length=50, default='🍕')  # Иконка для фронта

class Product(models.Model):
    name = models.CharField(max_length=100)
    category = models.ForeignKey(ProductCategory, on_delete=models.CASCADE)
    price = models.DecimalField(max_digits=6, decimal_places=2)
    description = models.TextField()
    image = models.ImageField(upload_to='products/')

    def __str__(self):
        return self.name