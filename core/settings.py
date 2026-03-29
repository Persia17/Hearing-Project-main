from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-change-this-to-a-secret-key"

# DEVELOPMENT SETTINGS
DEBUG = True
ALLOWED_HOSTS = []  # Empty list means allow all in debug mode

# Installed apps
from pathlib import Path

# Base directory of the project
BASE_DIR = Path(__file__).resolve().parent.parent

# SECURITY WARNING: keep the secret key used in production secret!
SECRET_KEY = "django-insecure-change-this-to-a-secret-key"

# DEVELOPMENT SETTINGS
DEBUG = True
ALLOWED_HOSTS = []  # Empty list means allow all in debug mode

# Installed apps
INSTALLED_APPS = [
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",
    "account",  # your authentication app
]

# Middleware configuration
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# URL configuration
ROOT_URLCONF = "core.urls"

# Templates settings
TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [BASE_DIR / "templates"],  # your global templates folder
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.debug",
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

# WSGI application
WSGI_APPLICATION = "core.wsgi.application"

# Database configuration (SQLite for local development)
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.sqlite3",
        "NAME": BASE_DIR / "db.sqlite3",
    }
}
AUTHENTICATION_BACKENDS = [
    'django.contrib.auth.backends.ModelBackend',
]

# Password validation
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator"},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# Internationalization
LANGUAGE_CODE = "en-us"
TIME_ZONE = "UTC"
USE_I18N = True
USE_TZ = True

# Static files (CSS, JS, images)

DEBUG = True  # important for dev

STATIC_URL = '/static/'
import os
STATICFILES_DIRS = [
    os.path.join(BASE_DIR, 'static'),
]


# Media files (if needed later)
MEDIA_URL = "/media/"
MEDIA_ROOT = BASE_DIR / "media"

# Authentication redirects
LOGIN_REDIRECT_URL = "home"
LOGOUT_REDIRECT_URL = "index"
LOGIN_URL = 'login'


# Default primary key field type
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# Keep session active for 2 weeks (default is until browser closes)


# Make session persistent
SESSION_EXPIRE_AT_BROWSER_CLOSE = False


SESSION_COOKIE_AGE = 60 * 60 * 24 * 30  # 30 days
