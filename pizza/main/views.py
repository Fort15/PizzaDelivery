from django.shortcuts import render
from django.core.mail import send_mail
import random
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt


def index(request):
    return render(request, 'main/index.html')


def send_auth_code(request):
    email = request.POST.get('email')
    code = random.randint(1000, 9999)

    request.session['auth_code'] = str(code)
    request.session['auth_email'] = email
    request.session.set_expiry(300)

    send_mail(
        'Код подтверждения',
        f'Ваш код: {code}',
        None,
        [email],
    )
    return JsonResponse({'status': 'success'})