from django.urls import path
from . import views

urlpatterns = [
    path('yoomoney/webhook/', views.yoomoney_webhook, name='yoomoney_webhook'),
    path('create/', views.create_order, name='create_order'),
    path('payment_callback/', views.payment_callback, name='payment_callback'),
    path('my/', views.my_orders, name='my_orders'),
    path('order/<int:order_id>/items/', views.order_items_json, name='order_items_json'),
]