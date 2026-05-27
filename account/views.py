import os
import tempfile
import random
import json
from collections import Counter
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv()
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
if GEMINI_API_KEY:
    genai.configure(api_key=GEMINI_API_KEY)

try:
    import numpy as np
    import librosa
    import joblib
    AI_AVAILABLE = True
except ImportError:
    np = None
    librosa = None
    joblib = None
    AI_AVAILABLE = False

from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.contrib.auth import login, authenticate
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from .models import Profile, PatientReport

# ====================== MODEL CONFIG =========================
MODEL_PATH = os.path.join(settings.BASE_DIR, "account", "FinalModel.pkl")
SR = 16000
N_MFCC = 13

def get_model():
    """Load ML model once (cached)."""
    if not hasattr(get_model, "_model"):
        get_model._model = joblib.load(MODEL_PATH)
    return get_model._model

def extract_features_audio(y, sr=SR, n_mfcc=N_MFCC):
    """Extract MFCC + Chroma + Spectral Contrast features."""
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfcc_scaled = np.mean(mfcc.T, axis=0)

    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_scaled = np.mean(chroma.T, axis=0)

    spec_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    spec_contrast_scaled = np.mean(spec_contrast.T, axis=0)

    return np.hstack([mfcc_scaled, chroma_scaled, spec_contrast_scaled])

def augment_audio(y, sr):
    """Apply small random augmentations (noise, pitch, speed)."""
    choice = random.choice(["noise", "pitch", "speed"])
    if choice == "noise":
        noise = np.random.randn(len(y))
        y = y + 0.005 * noise
    elif choice == "pitch":
        y = librosa.effects.pitch_shift(y, sr=sr, n_steps=random.choice([-1, 1]))
    elif choice == "speed":
        rate = random.uniform(0.9, 1.1)
        y = librosa.effects.time_stretch(y, rate=rate)
    return y

def predict_audio(audio_file):
    prediction = "Error"
    if not audio_file:
        return prediction
        
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(audio_file.name)[1]) as temp_audio:
        for chunk in audio_file.chunks():
            temp_audio.write(chunk)
        temp_path = temp_audio.name

    try:
        if not AI_AVAILABLE:
            raise ImportError("AI libraries not available")
        y, sr = librosa.load(temp_path, sr=SR)
        model = get_model()

        predictions = []
        features = extract_features_audio(y, sr=sr).reshape(1, -1)
        predictions.append(model.predict(features)[0])

        for _ in range(3):
            y_aug = augment_audio(y, sr)
            features_aug = extract_features_audio(y_aug, sr=sr).reshape(1, -1)
            predictions.append(model.predict(features_aug)[0])

        prediction = Counter(predictions).most_common(1)[0][0]
    except Exception as e:
        print("Local prediction error or modules missing:", e)
        # Fallback to Gemini AI if API key is set
        if GEMINI_API_KEY:
            try:
                print("Falling back to Gemini audio API for voice analysis...")
                uploaded_file = genai.upload_file(path=temp_path)
                
                # We use gemini-1.5-flash for audio files
                model = genai.GenerativeModel("gemini-1.5-flash")
                prompt = (
                    "Analyze the speech in this audio file. Classify the speech pattern into one of these categories: "
                    "stuttering (respond with 'stut'), lisp (respond with 'lisp'), cluttering (respond with 'clut'), "
                    "or normal/healthy speech (respond with 'healthy'). "
                    "Respond with exactly one word (either 'stut', 'lisp', 'clut', or 'healthy') and nothing else."
                )
                response = model.generate_content([uploaded_file, prompt])
                result = response.text.strip().lower()
                
                # Delete the file from Gemini cloud
                try:
                    genai.delete_file(uploaded_file.name)
                except Exception:
                    pass
                
                # Extract clean tag
                if result in ['stut', 'lisp', 'clut', 'healthy']:
                    prediction = result
                else:
                    if 'lisp' in result:
                        prediction = 'lisp'
                    elif 'clut' in result:
                        prediction = 'clut'
                    elif 'stut' in result:
                        prediction = 'stut'
                    else:
                        prediction = 'healthy'
                print("Gemini analysis output:", prediction)
            except Exception as gemini_err:
                print("Gemini audio analysis failed:", gemini_err)
                prediction = "healthy"  # default safe fallback
        else:
            prediction = "healthy"  # default safe fallback
    finally:
        if os.path.exists(temp_path):
            os.remove(temp_path)
            
    return prediction

# ====================== API ENDPOINTS ========================
@csrf_exempt
def api_signup(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            full_name = data.get("name")
            email = data.get("email")
            password = data.get("password")
            confirm_password = data.get("confirmPassword")
            phone = data.get("phone")

            if password != confirm_password:
                return JsonResponse({"status": "error", "message": "Passwords do not match"}, status=400)
            
            if User.objects.filter(username=email).exists():
                return JsonResponse({"status": "error", "message": "Email already registered"}, status=400)

            user = User.objects.create_user(
                username=email,
                email=email,
                password=password,
                first_name=full_name if full_name else ""
            )
            Profile.objects.create(user=user, phone=phone, full_name=full_name)
            login(request, user)
            return JsonResponse({"status": "success", "message": "Signup successful"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)

@csrf_exempt
def api_login(request):
    if request.method == 'POST':
        try:
            data = json.loads(request.body)
            email = data.get("email")
            password = data.get("password")

            try:
                user_obj = User.objects.get(email=email)
                username = user_obj.username
            except User.DoesNotExist:
                username = email

            user = authenticate(request, username=username, password=password)
            if user is not None:
                login(request, user)
                return JsonResponse({"status": "success", "message": "Login successful", "username": user.username})
            else:
                return JsonResponse({"status": "error", "message": "Invalid credentials"}, status=401)
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)

@csrf_exempt
def api_generate_plan(request):
    """Handle API form submission, predict from audio, and save report."""
    if request.method == "POST":
        try:
            name = request.POST.get("name")
            date = request.POST.get("date")
            dob = request.POST.get("dob")
            age = request.POST.get("age")
            gender = request.POST.get("gender")
            audio_file = request.FILES.get("audio")
            diagnosis_override = request.POST.get("diagnosis", "")

            user = request.user if request.user.is_authenticated else None

            if diagnosis_override:
                prediction = diagnosis_override
            else:
                prediction = predict_audio(audio_file)

            report = PatientReport.objects.create(
                user=user,
                name=name,
                dob=dob,
                gender=gender, 
                date=date,
                age=age,
                diagnosis=prediction,
            )
            return JsonResponse({"status": "success", "report_id": report.id, "diagnosis": prediction})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)

@csrf_exempt
def api_audio_predict(request):
    """Instant prediction just from audio file."""
    if request.method == "POST":
        try:
            audio_file = request.FILES.get("audio")
            prediction = predict_audio(audio_file)
            return JsonResponse({"status": "success", "diagnosis": prediction})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)

@csrf_exempt
def api_get_report(request, report_id):
    try:
        report = get_object_or_404(PatientReport, id=report_id)
        data = {
            "id": report.id,
            "name": report.name,
            "dob": str(report.dob) if report.dob else "",
            "date": str(report.date) if report.date else "",
            "age": report.age,
            "gender": report.gender,
            "diagnosis": report.diagnosis,
        }
        return JsonResponse({"status": "success", "report": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=404)

@csrf_exempt
def api_get_plan(request, report_id):
    try:
        report = get_object_or_404(PatientReport, id=report_id)
        return JsonResponse({"status": "success", "disorder": report.diagnosis.lower(), "patient": report.name})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=404)

@csrf_exempt
def api_get_profile(request):
    if not request.user.is_authenticated:
        return JsonResponse({"status": "error", "message": "Not authenticated"}, status=401)
    try:
        profile, created = Profile.objects.get_or_create(user=request.user)
        data = {
            "name": profile.full_name or request.user.first_name or request.user.username,
            "email": profile.email or request.user.email,
            "phone": profile.phone or "Not set",
            "dob": str(profile.dob) if profile.dob else "Not set",
            "gender": profile.gender or "Not set"
        }
        return JsonResponse({"status": "success", "profile": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=400)

@csrf_exempt
def api_get_reports(request):
    if not request.user.is_authenticated:
        return JsonResponse({"status": "error", "message": "Not authenticated"}, status=401)
    try:
        reports = PatientReport.objects.filter(user=request.user).order_by('-created_at')
        data = [{
            "id": r.id,
            "name": r.name,
            "date": str(r.date) if r.date else "",
            "diagnosis": r.diagnosis,
        } for r in reports]
        return JsonResponse({"status": "success", "reports": data})
    except Exception as e:
        return JsonResponse({"status": "error", "message": str(e)}, status=500)

@csrf_exempt
def api_delete_report(request, report_id):
    if not request.user.is_authenticated:
        return JsonResponse({"status": "error", "message": "Not authenticated"}, status=401)
    if request.method == "DELETE":
        try:
            report = get_object_or_404(PatientReport, id=report_id, user=request.user)
            report.delete()
            return JsonResponse({"status": "success", "message": "Report deleted successfully"})
        except Exception as e:
            return JsonResponse({"status": "error", "message": str(e)}, status=400)
    return JsonResponse({"status": "error", "message": "Only DELETE allowed"}, status=405)

@csrf_exempt
def api_chat(request):
    if request.method == "POST":
        try:
            data = json.loads(request.body)
            message = data.get("message", "")
            
            if not GEMINI_API_KEY or GEMINI_API_KEY == "your_actual_api_key_here":
                return JsonResponse({"status": "error", "message": "Please configure your Google Gemini API Key in the .env file to use the Chatbot."}, status=400)
                
            model = genai.GenerativeModel(
                "gemini-flash-latest",
                system_instruction="You are an empathetic, specialized AI assistant for the TalkON web application. Your sole purpose is to provide accurate, helpful information regarding speech disorders (like stuttering, lisp, dysphonia, aphasia, etc.) and to answer questions about the features of this website. Do not answer questions outside of these topics. Keep your answers concise, empathetic, and encouraging."
            )
            response = model.generate_content(message)
            return JsonResponse({"status": "success", "response": response.text})
        except Exception as e:
            error_str = str(e)
            if "API key" in error_str or "leaked" in error_str or "403" in error_str or "API_KEY_INVALID" in error_str:
                fallback_msg = (
                    "⚠️ **[SYSTEM NOTICE]** It looks like the Google Gemini API Key configured in your local `.env` file has been **reported as leaked** or is invalid, and has been disabled by Google.\n\n"
                    "**To fix this and activate my full AI power:**\n"
                    "1️⃣ Go to **[Google AI Studio](https://aistudio.google.com/)** and click **Get API Key** to generate a new free key.\n"
                    "2️⃣ Open your `.env` file in the root folder and update `GEMINI_API_KEY=YOUR_NEW_KEY`.\n"
                    "3️⃣ **Restart your Django server** so the new key is loaded.\n\n"
                    "*In the meantime, I've loaded in standard fallback mode. Let me know if you want to know about stuttering, lisps, or speech therapy exercises!*"
                )
                
                # Rule-based support helper
                msg_lower = message.lower()
                if "stutter" in msg_lower:
                    fallback_msg += "\n\n💡 **About Stuttering**: Stuttering is a speech disorder characterized by sound repetitions, prolongations, or blocks. Effective strategies include light contact practices (softening the start of words) and slow, relaxed diaphragmatic breathing."
                elif "lisp" in msg_lower:
                    fallback_msg += "\n\n💡 **About Lisping**: A lisp is a speech sound error typically affecting /s/ and /z/ sounds (e.g. pronouncing /s/ as /th/). Standard exercises focus on target tongue-tip placement behind the top front teeth."
                elif "exercise" in msg_lower or "therapy" in msg_lower:
                    fallback_msg += "\n\n💡 **Speech Exercises**: Standard voice exercises include easy onset pronunciation, word pacing drills, breathing coordination exercises, and tongue positioning stretches."
                
                return JsonResponse({"status": "success", "response": fallback_msg})
            return JsonResponse({"status": "error", "message": error_str}, status=400)
    return JsonResponse({"status": "error", "message": "Only POST allowed"}, status=405)