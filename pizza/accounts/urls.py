from django.urls import path
from .views import save_address

urlpatterns = [
    path('save_address/', save_address, name='save_address'),
]