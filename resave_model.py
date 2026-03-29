# resave_model.py
import os, sys, joblib

IN_PATH = os.path.join("account", "FinalModel.pkl")
OUT_PATH = os.path.join("account", "FinalModel_fixed.pkl")

print("Loading with joblib:", os.path.abspath(IN_PATH))
try:
    obj = joblib.load(IN_PATH)   # use joblib, not pickle
    print("Loaded object type:", type(obj).__name__)
except Exception as e:
    print("FAILED to load with joblib:", e)
    sys.exit(1)

print("Saving with joblib to:", os.path.abspath(OUT_PATH))
try:
    joblib.dump(obj, OUT_PATH, protocol=4)  # resave safely
    print("Saved OK:", os.path.abspath(OUT_PATH))
except Exception as e:
    print("FAILED to save with joblib:", e)
    sys.exit(1)
