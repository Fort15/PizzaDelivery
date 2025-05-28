from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from orders.models import Order

@login_required
def order_history(request):
    orders = Order.objects.filter(user=request.user, created_at__year=2024)
    return render(request, 'orders/history.html', {'orders': orders})