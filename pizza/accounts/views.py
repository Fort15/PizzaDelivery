from django.shortcuts import render, redirect
from django.http import JsonResponse
import requests
import random


EXOLVE_API_KEY = "eyJhbGciOiJSUzI1NiIsInR5cCIgOiAiSldUIiwia2lkIiA6ICJRV05sMENiTXY1SHZSV29CVUpkWjVNQURXSFVDS0NWODRlNGMzbEQtVHA0In0.eyJleHAiOjIwNTg4MTMzMjksImlhdCI6MTc0MzQ1MzMyOSwianRpIjoiMWM1OGYzODEtNmFlYy00MTBkLWIyMGMtOTNjN2QxMTRmNjA3IiwiaXNzIjoiaHR0cHM6Ly9zc28uZXhvbHZlLnJ1L3JlYWxtcy9FeG9sdmUiLCJhdWQiOiJhY2NvdW50Iiwic3ViIjoiOWZiMGIzMzAtZmE3ZS00YTI0LWJkYmItZDZhNzE5MjA2OTM3IiwidHlwIjoiQmVhcmVyIiwiYXpwIjoiZDBhZjVlZWMtZWE4MC00MGJmLTljNGItYzI3ZGEyMTRhNTNmIiwic2Vzc2lvbl9zdGF0ZSI6IjFkZGYxYTdhLTgyNTUtNDhiMi05M2JhLTBiMGJkZjk2NDdmMiIsImFjciI6IjEiLCJyZWFsbV9hY2Nlc3MiOnsicm9sZXMiOlsiZGVmYXVsdC1yb2xlcy1leG9sdmUiLCJvZmZsaW5lX2FjY2VzcyIsInVtYV9hdXRob3JpemF0aW9uIl19LCJyZXNvdXJjZV9hY2Nlc3MiOnsiYWNjb3VudCI6eyJyb2xlcyI6WyJtYW5hZ2UtYWNjb3VudCIsIm1hbmFnZS1hY2NvdW50LWxpbmtzIiwidmlldy1wcm9maWxlIl19fSwic2NvcGUiOiJleG9sdmVfYXBwIHByb2ZpbGUgZW1haWwiLCJzaWQiOiIxZGRmMWE3YS04MjU1LTQ4YjItOTNiYS0wYjBiZGY5NjQ3ZjIiLCJ1c2VyX3V1aWQiOiIyMDBkODQzZi00MjdhLTQxNWMtYjZiNC0wMzYyZDU2MGVhNTciLCJjbGllbnRIb3N0IjoiMTcyLjE2LjE2MS4xOSIsImVtYWlsX3ZlcmlmaWVkIjpmYWxzZSwiY2xpZW50SWQiOiJkMGFmNWVlYy1lYTgwLTQwYmYtOWM0Yi1jMjdkYTIxNGE1M2YiLCJhcGlfa2V5Ijp0cnVlLCJhcGlmb25pY2Ffc2lkIjoiZDBhZjVlZWMtZWE4MC00MGJmLTljNGItYzI3ZGEyMTRhNTNmIiwiYmlsbGluZ19udW1iZXIiOiIxMzAyMzI3IiwiYXBpZm9uaWNhX3Rva2VuIjoiYXV0NTYzNjFmZjUtYjQ0YS00ZDZiLTk2Y2QtYWQ1ZGZkMTNjNTg3IiwicHJlZmVycmVkX3VzZXJuYW1lIjoic2VydmljZS1hY2NvdW50LWQwYWY1ZWVjLWVhODAtNDBiZi05YzRiLWMyN2RhMjE0YTUzZiIsImN1c3RvbWVyX2lkIjoiMTA3MDkxIiwiY2xpZW50QWRkcmVzcyI6IjE3Mi4xNi4xNjEuMTkifQ.B2A2mVgi2avbbbaYY84jzXnRsze3QxBymL09urO78_Vh2NUN_dlouWwekePQIdqSg23DismvrMCOIGQ6E6Lb8ic2DDQjOoZUmtNXV3zni_QoM3QxfBaX2CvyZr-fDRgOnu1Reo4R62PVf9vUqeEXWe-XkQ9_G9NlsgUIPewa5K32x497M1sBXBhfrmXKo-nGxDdgtOvXyRYFKJiWp38DEBc1x-Rqrarq2DMMVfMWqWp3Ho6R5PoRgWkuloXAtgImv1OACuyyGTVVNCZH5JyolbBrJWPheJ0JtVf6oBJtoyrmQIATL4tvUsOhPPctbXlYyvuYimXQlGrSUid2b9sFrg"

# временно
sms_codes = {}


def register(request):
    data = {
        'code_sent': False
    }
    return render(request, 'accounts/register.html', data)


def send_sms(request):
    if request.method == 'POST':
        phone = request.POST.get('phone', '',).strip()
        if not phone:
            return render(request, 'accounts/register.html', {
                'code_sent': False,
                'error': 'Номер телефона обязателен',
            })

        code = str(random.randint(1000, 9999))

        sms_codes[phone] = code

        url = 'https://api.exolve.ru/messaging/v1/SendSMS'
        headers = {
            'Authorization': f'Bearer {EXOLVE_API_KEY}',
            'Content-Type': 'application/json',
        }
        payload = {
            'number': '79587122510',
            'destination': phone,
            'text': f'Ваш код подтверждения: {code}',
        }

        try:
            response = requests.post(url, json=payload, headers=headers)
            print("Статус ответа:", response.status_code)
            print("Тело ответа:", response.json())

            if response.status_code == 200:
                response_data = response.json()
                if response_data.get('status') == 'success':
                    return render(request, 'accounts/register.html', {
                        'code_sent': True,
                        'phone': phone,
                    })
                else:
                    return render(request, 'accounts/register.html', {
                        'code_sent': False,
                        'error': f'Ошибка при отправке SMS: {response_data.get("message", "Неизвестная ошибка")}',
                    })
            else:
                return render(request, 'accounts/register.html', {
                    'code_sent': False,
                    'error': f'Ошибка при отправке SMS: {response.json().get("message", "Неизвестная ошибка")}',
                })
        except Exception as e:
            print(f"Ошибка: {e}")
            return render(request, 'accounts/register.html', {
                'code_sent': False,
                'error': f'Ошибка при отправке SMS: {str(e)}',
            })

    return redirect('register')


def verify_code(request):
    if request.method == 'POST':
        phone = request.POST.get('phone')
        code = request.POST.get('code')
        if not phone or not code:
            return render(request, 'accounts/register.html', {
                'code_sent': True,
                'error': 'Номер телефона и код обязательны',
            })

        if sms_codes.get(phone) == code:
            del sms_codes[phone]
            return redirect('success')
        else:
            return render(request, 'accounts/register.html', {
                'code_sent': True,
                'error': 'Неверный код',
            })

    return redirect('register')


def success(request):
    return render(request, 'accounts/success.html')