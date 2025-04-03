from django.urls import path
from . import views


urlpatterns = [
    path('register/', views.register, name='register'),
    path('send_sms/', views.send_sms, name='send_sms'),
    path('verify_code/', views.verify_code, name='verify_code'),
    path('success/', views.success, name='success'),
]