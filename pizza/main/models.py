from django.db import models
from django.contrib.auth.models import AbstractBaseUser, BaseUserManager
from datetime import timedelta
from django.utils import timezone


class UserManager(BaseUserManager):
    def create_user(self, email):
        user = self.model(email=email)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser):
    email = models.EmailField(unique=True)  # Логин пользователя
    current_code = models.CharField(max_length=6, null=True, blank=True)  # Текущий код входа
    code_expires = models.DateTimeField(null=True, blank=True)  # Время действия кода

    # Профиль (можно заполнить позже)
    phone = models.CharField(max_length=15, blank=True)
    address = models.TextField(blank=True)

    # Корзина и заказы храним в JSON (без отдельных моделей)
    cart = models.JSONField(default=list)  # Пример: [{"id":1,"name":"Пепперони","price":365,"qty":2}]
    orders = models.JSONField(default=list)  # История заказов

    USERNAME_FIELD = 'email'
    objects = UserManager()