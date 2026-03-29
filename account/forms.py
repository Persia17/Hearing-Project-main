from django import forms
from django.contrib.auth.models import User
from django.contrib.auth.forms import UserCreationForm
from .models import Profile

class SignUpForm(UserCreationForm):
    dob = forms.DateField(widget=forms.DateInput(attrs={'type': 'date'}))
    gender = forms.ChoiceField(choices=Profile.GENDER_CHOICES, widget=forms.RadioSelect)
    phone = forms.CharField(max_length=15)

    class Meta:
        model = User
        fields = ['username', 'email', 'password1', 'password2', 'dob', 'gender', 'phone']
