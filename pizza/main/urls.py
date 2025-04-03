from django.urls import path
from . import views
from django.conf.urls.static import static
from django.conf import settings

urlpatterns = [
    path('', views.index, name='home'),
    path('send-code/', views.send_auth_code, name='send_code'),
] + static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)

