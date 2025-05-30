from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from .models import Order, OrderItem
from django.http import JsonResponse
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse
from django.contrib.admin.views.decorators import staff_member_required
from django.db.models import Case, When, IntegerField


@csrf_exempt
@login_required
def create_order(request):
    if request.method == 'POST':
        data = json.loads(request.body)
        items = data.get('items', [])
        total_amount = sum(item['price'] * item['quantity'] for item in items)
        order = Order.objects.create(
            user=request.user,
            total_amount=total_amount,
            status='pending',
            payment_label=f'order_{request.user.id}_{Order.objects.count() + 1}'
        )
        order_items = [
            OrderItem(
                order=order,
                name=item['name'],
                price=item['price'],
                quantity=item['quantity']
            )
            for item in items
        ]
        OrderItem.objects.bulk_create(order_items)
        # Ссылка на ЮMoney
        yoomoney_url = (
            f"https://yoomoney.ru/to/410017963597609"
            f"?amount={order.total_amount}&label={order.payment_label}&successURL={request.get_host()}"
        )
        return JsonResponse({'redirect_url': yoomoney_url})
    return JsonResponse({'error': 'Только POST!'})

@csrf_exempt
def payment_callback(request):
    if request.method == 'POST':
        label = request.POST.get('label')
        amount = float(request.POST.get('amount', '0'))
        order = Order.objects.filter(payment_label=label).first()
        if order:
            # Сверяем сумму
            if amount >= float(order.total_amount):
                order.status = 'paid'
            else:
                order.status = 'underpaid'
            order.save()
    return HttpResponse('OK')

@login_required
def my_orders(request):
    orders = Order.objects.filter(
        user=request.user,
        status__in=['active', 'completed']
    ).order_by(
        Case(
            When(status='active', then=0),
            When(status='completed', then=1),
            default=2,
            output_field=IntegerField()
        ),
        '-created_at'
    )
    return render(request, 'orders/my_orders.html', {'orders': orders})

@csrf_exempt
def yoomoney_webhook(request):
    if request.method == "POST":
        label = request.POST.get('label')
        amount = request.POST.get('amount')
        notification_secret = request.POST.get('notification_secret')  # для доп. проверки

        # Проверь label
        if label and label.startswith('order_'):
            order_id = int(label.replace('order_', ''))
            try:
                order = Order.objects.get(id=order_id)
                # Проверь сумму (по желанию)
                if str(order.total_amount) == amount:
                    order.status = 'active'
                    order.save()
                    return HttpResponse('OK')
            except Order.DoesNotExist:
                pass
    return HttpResponse('fail', status=400)

@staff_member_required
def complete_order(request):
    if request.method == "POST":
        order_id = request.POST.get('order_id')
        order = get_object_or_404(Order, id=order_id)
        order.status = 'completed'
        order.save()
        return render(request, 'orders/complete_success.html', {'order': order})
    return render(request, 'orders/complete_form.html')

@login_required
def order_items_json(request, order_id):
    order = Order.objects.filter(id=order_id, user=request.user).first()
    if not order:
        return JsonResponse({'error': 'not found'}, status=404)
    items = [
        {
            'name': item.name,
            'price': float(item.price),
            'quantity': item.quantity,
        }
        for item in order.items.all()
    ]
    return JsonResponse({'items': items})