# account/ml_model.py
import joblib
import os

# Build path to your model
MODEL_PATH = os.path.join(os.path.dirname(__file__), "FinalModel.pkl")

# Load model once when Django starts
model = joblib.load(MODEL_PATH)

def predict(features):
    """Take input features (list of numbers) and return prediction."""
    prediction = model.predict([features])  # needs 2D array
    return prediction[0]
