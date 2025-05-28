from django import forms
from .models import CustomUser  # или UserProfile

class AddressForm(forms.ModelForm):
    class Meta:
        model = CustomUser  # или UserProfile
        fields = ['address', 'apartment', 'floor']