from flask import Flask, jsonify
from model import predict_expense
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 🧠 ML Prediction Route
@app.route("/predict", methods=["GET"])
def predict():
    result = predict_expense()
    return jsonify({
        "predicted_expense": result
    })

# 🧠 Health check
@app.route("/")
def home():
    return "ML Service Running 🚀"

if __name__ == "__main__":
    app.run(port=8000, debug=True)