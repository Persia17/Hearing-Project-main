from django.db import models
from django.contrib.auth.models import User


# account/models.py
from django.db import models
from django.contrib.auth.models import User

class Profile(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=150, blank=True, null=True)
    email = models.EmailField(blank=True, null=True)
    dob = models.DateField(blank=True, null=True)
    gender = models.CharField(max_length=20, blank=True, null=True)
    phone = models.CharField(max_length=15, blank=True, null=True)

    def __str__(self):
        return self.user.username



class Patient(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, null=True, blank=True)    # Belongs to the logged-in user
    name = models.CharField(max_length=200)
    dob = models.DateField(null=True, blank=True)
    gender = models.CharField(max_length=20, blank=True)

    def __str__(self):
        return f"{self.name} ({self.user.username})"


class PatientReport(models.Model):
    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="reports",
        null=True, blank=True,      # <- allows old rows to exist during migration
    )
    name = models.CharField(max_length=200)
    date = models.DateField()
    dob = models.DateField()
    age = models.IntegerField(default=0)

    gender = models.CharField(max_length=20)
    diagnosis = models.CharField(max_length=255)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.diagnosis})"
class PlanProgress(models.Model):
    report = models.ForeignKey(PatientReport, on_delete=models.CASCADE, related_name="progress")
    day = models.IntegerField()                               # day number in the plan
    completed = models.BooleanField(default=False)            # track if done
    updated_at = models.DateTimeField(auto_now=True)          # last update

    def __str__(self):
        return f"{self.report.name} - Day {self.day} ({'Done' if self.completed else 'Pending'})"
    
# ✅ New Task model
class Task(models.Model):
    report = models.ForeignKey(PatientReport, on_delete=models.CASCADE, related_name="tasks")
    day = models.IntegerField()  # Day number in the plan
    description = models.TextField()
    completed = models.BooleanField(default=False)

    def __str__(self):
     return f"Task for {self.report.name} - Day {self.day}"