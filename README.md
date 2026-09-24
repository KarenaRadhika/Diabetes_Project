# 🩺 Diabetes Prediction System & Risk Assessment Platform

An end-to-end Machine Learning web application that predicts diabetes risk with clinical risk stratification, contributing factor analysis, and interactive real-time telemetry.

Built with **Python**, **Scikit-Learn**, **XGBoost**, **Flask**, and **React (Vite + TailwindCSS + Lucide Icons + Recharts)**.

---

## 🌟 Key Highlights

- **Top-Performing Model Pipeline**: Evaluated 10 classification models on the Pima Indians Diabetes Dataset; **XGBoost** achieved the highest test accuracy (**77.27%**) with an ROC-AUC of **0.8207**.
- **Full Scikit-Learn Pipeline**: Integrated preprocessing with `SimpleImputer(strategy='median')` and `StandardScaler` for robust clinical inference handling biological zero values.
- **Explainable Clinical Insights**: Identifies key patient risk drivers (elevated glucose, BMI thresholds, maternal/genetic history, age bracket).
- **Modern Responsive UI**: Interactive sliders, dynamic risk gauge, live visual charts, patient risk profile comparison, and prediction history log.
- **Zero-Downtime Resilience**: Seamless dual-mode execution — queries the Python Flask REST API or automatically activates a calibrated client estimator if the backend is offline.

---

## 📊 Model Leaderboard Summary

| Rank | Model | Test Accuracy | Precision | Recall | F1 Score | ROC-AUC | 5-Fold CV Mean |
|:---:|:---|:---:|:---:|:---:|:---:|:---:|:---:|
| 🥇 | **XGBoost** (Active Model) | **77.27%** | **69.39%** | **62.96%** | **0.6602** | **0.8207** | **73.29%** |
| 🥈 | Decision Tree | 75.97% | 63.93% | 72.22% | 0.6783 | 0.7622 | 72.96% |
| 🥉 | Logistic Regression | 75.32% | 66.67% | 59.26% | 0.6275 | 0.8194 | 74.43% |
| 4 | Support Vector Machine (SVM) | 75.32% | 68.18% | 55.56% | 0.6122 | 0.7831 | 74.59% |
| 5 | Random Forest | 74.68% | 63.83% | 61.11% | 0.6244 | 0.8037 | 73.13% |
| 6 | AdaBoost | 74.03% | 63.04% | 53.70% | 0.5800 | 0.8063 | 73.78% |
| 7 | Gradient Boosting | 74.03% | 62.50% | 55.56% | 0.5882 | 0.8093 | 73.29% |
| 8 | Multi-Layer Perceptron (MLP) | 73.38% | 62.22% | 51.85% | 0.5657 | 0.8030 | 73.13% |
| 9 | K-Nearest Neighbors (KNN) | 72.73% | 60.47% | 48.15% | 0.5361 | 0.7672 | 72.96% |
| 10 | Naive Bayes | 72.08% | 58.70% | 50.00% | 0.5400 | 0.7885 | 71.82% |

---

## 🏗️ Architecture

```
├── best_model.pkl              # Serialized Scikit-Learn Pipeline (Imputer + Scaler + XGBoost)
├── models_summary.json         # Leaderboard metrics, confusion matrices, and ROC curves data
├── diabetes.csv                # Pima Indians Diabetes Dataset (768 records, 8 clinical features)
├── diabetes_prediction.ipynb   # Exploratory Data Analysis & baseline experiments
├── diabetes_prediction2.ipynb  # Advanced pipeline, hyperparameter tuning & export
├── server.py                   # Production Flask REST API & static web host
├── requirements.txt            # Python dependencies
├── Procfile                    # Cloud WSGI runner entrypoint
├── render.yaml                 # Render cloud deployment blueprint
├── run_project.bat             # 1-click Windows runner script
└── diabetes_project/           # Modern React + Vite Frontend
    ├── src/
    │   ├── components/         # PredictionForm, ResultGauge, ModelLeaderboard, HistoryPanel
    │   ├── pages/              # HomePage, PredictorPage, AboutPage
    │   └── lib/model.js        # API connector with calibrated offline client fallback
    └── vercel.json             # Vercel deployment rewrite rules
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Clone & Set Up Backend
```bash
# Clone the repository
git clone https://github.com/<your-username>/<your-repo-name>.git
cd Diabetes_Project

# Create and activate Python virtual environment
python -m venv venv
# On Windows:
.\venv\Scripts\activate
# On Linux/macOS:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Start Flask API
python server.py
```
Backend API will be active at `http://127.0.0.1:5000`.

### 2. Set Up & Run Frontend
In a new terminal:
```bash
cd diabetes_project
npm install
npm run dev
```
Open `http://localhost:5173` in your browser.

*(Windows users can simply double-click `run_project.bat` to launch both servers simultaneously).*

---

## 🌐 Deployment Guide

### Option 1: Full-Stack on Render (Recommended)
1. Push this repository to GitHub.
2. Log into [Render](https://render.com) and create a **New Web Service**.
3. Connect your GitHub repository.
4. Set:
   - **Environment**: `Python 3`
   - **Build Command**: `cd diabetes_project && npm install && npm run build && cd .. && pip install -r requirements.txt`
   - **Start Command**: `gunicorn server:app`
5. Click **Deploy**. Both the React UI and the Flask ML backend will run on your live URL.

### Option 2: Frontend on Vercel + Backend on Render
- **Frontend (Vercel)**:
  1. Import the repository on [Vercel](https://vercel.com).
  2. Set Root Directory to `diabetes_project`.
  3. Set Framework Preset to `Vite`.
  4. (Optional) Set Environment Variable `VITE_API_URL` to your backend URL.
  5. Click **Deploy**.
- **Backend (Render / Railway / Hugging Face Spaces)**:
  1. Deploy root with `gunicorn server:app`.

---

## 🔒 Clinical Feature Reference

| Feature | Description | Clinical Unit | Median Value |
|:---|:---|:---:|:---:|
| `Pregnancies` | Number of times pregnant | Count | 3 |
| `Glucose` | Plasma glucose concentration (2 hours in OGTT) | mg/dL | 117.0 |
| `BloodPressure` | Diastolic blood pressure | mmHg | 72.0 |
| `SkinThickness` | Triceps skin fold thickness | mm | 23.0 |
| `Insulin` | 2-Hour serum insulin | μU/mL | 30.5 |
| `BMI` | Body mass index (weight in kg / (height in m)²) | kg/m² | 32.0 |
| `DiabetesPedigreeFunction` | Genetic pedigree risk score | Ratio | 0.3725 |
| `Age` | Age in years | Years | 29.0 |

---

## 📄 License
This project is licensed under the MIT License.
