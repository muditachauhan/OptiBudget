from flask import Flask, jsonify

app = Flask(__name__)

@app.route("/predict")
def predict():
    return jsonify({"prediction": 12000})

app.run(port=8000)