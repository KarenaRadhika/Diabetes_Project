"""
server.py
Backend API server for Diabetes Prediction.
Serves the best performing classification model (highest test accuracy) via REST API.
"""

import os
import json
import joblib
import numpy as np
import pandas as pd
from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
FRONTEND_DIST = os.path.join(BASE_DIR, 'diabetes_project', 'dist')

app = Flask(__name__, static_folder=FRONTEND_DIST, static_url_path='')
CORS(app)

MODEL_PATH = os.path.join(BASE_DIR, 'best_model.pkl')
SUMMARY_PATH = os.path.join(BASE_DIR, 'models_summary.json')

FEATURE_COLS = [
    'Pregnancies',
    'Glucose',
    'BloodPressure',
    'SkinThickness',
    'Insulin',
    'BMI',
    'DiabetesPedigreeFunction',
    'Age'
]

# Clinical population medians for risk factor analysis
MEDIANS = {
    'Pregnancies': 3,
    'Glucose': 117.0,
    'BloodPressure': 72.0,
    'SkinThickness': 23.0,
    'Insulin': 30.5,
    'BMI': 32.0,
    'DiabetesPedigreeFunction': 0.3725,
    'Age': 29.0
}

# Load model and summary at startup
print("[INFO] Loading best model pipeline from:", MODEL_PATH)
try:
    model_pipeline = joblib.load(MODEL_PATH)
    print("[OK] Model pipeline loaded successfully.")
except Exception as e:
    model_pipeline = None
    print("[ERROR] Could not load model pipeline:", e)

try:
    with open(SUMMARY_PATH, 'r', encoding='utf-8') as f:
        models_summary = json.load(f)
    print("[OK] Models summary loaded.")
except Exception as e:
    models_summary = {}
    print("[WARN] Could not load models summary:", e)


@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check and active model status."""
    best_info = models_summary.get('best_model', {})
    return jsonify({
        'status': 'healthy' if model_pipeline is not None else 'degraded',
        'active_model': best_info.get('name', 'Best Classification Model'),
        'test_accuracy': best_info.get('accuracy', 77.27),
        'total_models_evaluated': len(models_summary.get('leaderboard', []))
    })


@app.route('/api/models', methods=['GET'])
def get_models():
    """Returns leaderboard of all evaluated classification models and their metrics."""
    return jsonify(models_summary)


@app.route('/api/predict', methods=['POST'])
def predict():
    """
    Accepts clinical features, runs inference with the best model pipeline,
    and returns probability, diagnosis, risk level, and contributing factors.
    """
    if model_pipeline is None:
        return jsonify({'error': 'Model pipeline is not loaded on server.'}), 500

    data = request.get_json(force=True, silent=True)
    if not data:
        return jsonify({'error': 'No input JSON provided.'}), 400

    try:
        # Normalize keys (handle both camelCase and TitleCase)
        raw_vals = {
            'Pregnancies': float(data.get('pregnancies', data.get('Pregnancies', 1))),
            'Glucose': float(data.get('glucose', data.get('Glucose', 110))),
            'BloodPressure': float(data.get('bloodPressure', data.get('BloodPressure', 70))),
            'SkinThickness': float(data.get('skinThickness', data.get('SkinThickness', 20))),
            'Insulin': float(data.get('insulin', data.get('Insulin', 79))),
            'BMI': float(data.get('bmi', data.get('BMI', 27.0))),
            'DiabetesPedigreeFunction': float(data.get('dpf', data.get('DiabetesPedigreeFunction', 0.47))),
            'Age': float(data.get('age', data.get('Age', 33)))
        }

        # Convert biological 0 values (except pregnancies) to NaN for the pipeline imputer
        clean_vals = dict(raw_vals)
        for col in ['Glucose', 'BloodPressure', 'SkinThickness', 'Insulin', 'BMI']:
            if clean_vals[col] <= 0:
                clean_vals[col] = np.nan

        input_df = pd.DataFrame([clean_vals], columns=FEATURE_COLS)

        # Inference
        pred = int(model_pipeline.predict(input_df)[0])

        if hasattr(model_pipeline, 'predict_proba'):
            probs = model_pipeline.predict_proba(input_df)[0]
            prob_diabetic = float(probs[1])
        else:
            prob_diabetic = float(pred)

        prob_diabetic = max(0.0, min(1.0, prob_diabetic))
        pct = round(prob_diabetic * 100, 1)

        # Risk classification
        if prob_diabetic < 0.33:
            risk_level = 'Low'
            risk_band = 'low'
        elif prob_diabetic < 0.66:
            risk_level = 'Moderate'
            risk_band = 'moderate'
        else:
            risk_level = 'High'
            risk_band = 'high'

        # Analyze patient risk drivers relative to clinical norms
        key_factors = []
        if raw_vals['Glucose'] >= 140:
            key_factors.append(f"High Glucose: {raw_vals['Glucose']} mg/dL (Normal is < 140)")
        elif raw_vals['Glucose'] >= 120:
            key_factors.append(f"Elevated Glucose: {raw_vals['Glucose']} mg/dL")

        if raw_vals['BMI'] >= 30:
            key_factors.append(f"Obese BMI range: {raw_vals['BMI']} kg/m² (Normal is 18.5 - 24.9)")
        elif raw_vals['BMI'] >= 25:
            key_factors.append(f"Overweight BMI: {raw_vals['BMI']} kg/m²")

        if raw_vals['Age'] >= 45:
            key_factors.append(f"Higher risk age bracket: {int(raw_vals['Age'])} yrs")

        if raw_vals['DiabetesPedigreeFunction'] >= 0.6:
            key_factors.append(f"High genetic risk (DPF: {raw_vals['DiabetesPedigreeFunction']:.2f})")

        if raw_vals['BloodPressure'] >= 80:
            key_factors.append(f"Elevated Blood Pressure: {raw_vals['BloodPressure']} mmHg")

        best_info = models_summary.get('best_model', {})

        return jsonify({
            'success': True,
            'prediction': pred,
            'diagnosis': 'Diabetic' if pred == 1 else 'Non-Diabetic',
            'probability': prob_diabetic,
            'percentage': pct,
            'risk_level': risk_level,
            'risk_band': risk_band,
            'active_model': {
                'name': best_info.get('name', 'XGBoost'),
                'accuracy': best_info.get('accuracy', 77.27),
                'f1_score': best_info.get('f1_score', 0.6602),
                'roc_auc': best_info.get('roc_auc', 0.8207)
            },
            'contributing_factors': key_factors,
            'input_values': raw_vals
        })

    except Exception as ex:
        print("[ERROR] Prediction failed:", ex)
        return jsonify({'error': str(ex)}), 500


@app.route('/', defaults={'path': ''})
@app.route('/<path:path>')
def serve(path):
    """Serves the compiled React frontend, or API info if frontend is not built."""
    if path != "" and os.path.exists(os.path.join(app.static_folder, path)):
        return send_from_directory(app.static_folder, path)
    if os.path.exists(os.path.join(app.static_folder, 'index.html')):
        return send_from_directory(app.static_folder, 'index.html')
    return jsonify({
        'status': 'online',
        'project': 'Diabetes Prediction Machine Learning System',
        'message': 'API is active. Build the frontend or query /api endpoints.',
        'endpoints': {
            'health': '/api/health',
            'models': '/api/models',
            'predict': 'POST /api/predict'
        }
    })


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 5000))
    print(f"[READY] Diabetes Prediction API running on http://0.0.0.0:{port}")
    app.run(host='0.0.0.0', port=port, debug=False)

