from django.contrib import admin
from .models import Profile, Patient, PatientReport, PlanProgress, Task

# Register your models here.
admin.site.register(Profile)
admin.site.register(Patient)
admin.site.register(PatientReport)
admin.site.register(PlanProgress)
admin.site.register(Task)
