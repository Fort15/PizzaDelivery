from django.shortcuts import render, redirect
from django.core.mail import send_mail
from random import randint
from django.contrib.auth import login
from django.http import JsonResponse
from accounts.models import CustomUser


def index(request):
    return render(request, 'main/index.html')


def send_auth_code(request):
    email = request.POST.get('email')
    code = randint(1000, 9999)

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


def verify_code(request):
    if request.method != 'POST':
        return JsonResponse({'status': 'error', 'message': 'Неверный метод запроса'}, status=400)

    user_code = request.POST.get('code')
    saved_code = request.session.get('auth_code')
    email = request.session.get('auth_email')

    if not all([user_code, saved_code, email]):
        return JsonResponse({'status': 'error', 'message': 'Сессия устарела'}, status=400)

    if user_code != saved_code:
        return JsonResponse({'status': 'error', 'message': 'Неверный код подтверждения'}, status=400)

    try:
        user, created = CustomUser.objects.get_or_create(
            email=email,
            defaults={
                'email': email,
                'is_active': True
            }
        )
        login(request, user)
        return JsonResponse({'status': 'success'})
    except Exception as e:
        return JsonResponse({'status': 'error', 'message': str(e)}, status=500)


def logout_view(request):
    from django.contrib.auth import logout
    logout(request)
    return redirect('/')