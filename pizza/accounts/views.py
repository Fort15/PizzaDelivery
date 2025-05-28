from django.http import JsonResponse
from django.contrib.auth.decorators import login_required
from .models import CustomUser

@login_required
def save_address(request):
    if request.method == 'POST':
        user = request.user
        user.address = request.POST.get('address')
        user.apartment = request.POST.get('apartment')
        user.entrance = request.POST.get('entrance')
        user.floor = request.POST.get('floor')
        user.save()
        return JsonResponse({'success': True})
    return JsonResponse({'success': False})