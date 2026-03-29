# account/audio_utils.py
import librosa
import numpy as np

def extract_features_audio(y, sr=16000, n_mfcc=13):
    # MFCC
    mfcc = librosa.feature.mfcc(y=y, sr=sr, n_mfcc=n_mfcc)
    mfcc_scaled = np.mean(mfcc.T, axis=0)

    # Chroma
    chroma = librosa.feature.chroma_stft(y=y, sr=sr)
    chroma_scaled = np.mean(chroma.T, axis=0)

    # Spectral Contrast
    spec_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    spec_contrast_scaled = np.mean(spec_contrast.T, axis=0)

    # Combine features into one vector
    return np.hstack([mfcc_scaled, chroma_scaled, spec_contrast_scaled])
