from django.urls import path
from . import views

urlpatterns = [
    path('api/signup/', views.api_signup, name='api_signup'),
    path('api/login/', views.api_login, name='api_login'),
    path("api/generate-plan/", views.api_generate_plan, name="api_generate_plan"),
    path("api/audio-predict/", views.api_audio_predict, name="api_audio_predict"),
    path("api/report/<int:report_id>/", views.api_get_report, name="api_get_report"),
    path("api/reports/", views.api_get_reports, name="api_get_reports"),
    path("api/report/delete/<int:report_id>/", views.api_delete_report, name="api_delete_report"),
    path("api/plan/<int:report_id>/", views.api_get_plan, name="api_get_plan"),
    path("api/profile/", views.api_get_profile, name="api_get_profile"),
    path("api/chat/", views.api_chat, name="api_chat"),
]
