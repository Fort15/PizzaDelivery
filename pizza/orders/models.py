from django.db import models
from accounts.models import CustomUser

class Order(models.Model):
    user = models.ForeignKey(CustomUser, on_delete=models.CASCADE)
    total_price = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, default='pending')
    created_at = models.DateTimeField(auto_now_add=True)
    address = models.TextField()  # Для хранения адреса из карты

    def __str__(self):
        return f"Order #{self.id} by {self.user.email}"