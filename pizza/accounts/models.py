from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models


class CustomUserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('Email обязателен')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        return self.create_user(email, password, **extra_fields)


class CustomUser(AbstractUser):
    username = None  # Полностью убираем поле username
    email = models.EmailField('Email', unique=True)
    full_name = models.CharField('ФИО', max_length=100, blank=True)
    phone = models.CharField('Телефон', max_length=20, blank=True)
    address = models.CharField('Адрес', max_length=255, blank=True, null=True)
    apartment = models.CharField('Квартира', max_length=10, blank=True, null=True)
    entrance = models.CharField('Подъезд', max_length=10, blank=True, null=True)
    floor = models.CharField('Этаж', max_length=3, blank=True, null=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = []  # Поля, требуемые для createsuperuser (кроме email и password)

    objects = CustomUserManager()

    def __str__(self):
        return self.email

    def get_full_address(self):
        if self.address:
            return f"{self.address}, кв. {self.apartment}, подъезд {self.entrance}, этаж {self.floor}"
        return "Адрес не указан"