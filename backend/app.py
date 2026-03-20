from flask import Flask, request, jsonify
import json
import os

app = Flask(__name__)

# File path (safe way)
FILE = os.path.join(os.path.dirname(__file__), "../data/expenses.json")


# Load data
def load_data():
    if not os.path.exists(FILE):
        return []
    with open(FILE, "r") as f:
        try:
            return json.load(f)
        except:
            return []


# Save data
def save_data(data):
    with open(FILE, "w") as f:
        json.dump(data, f, indent=4)


# Home route (IMPORTANT FIX)
@app.route("/")
def home():
    return "OptiBudget Backend Running 🚀"


# Add expense (POST)
@app.route("/add", methods=["POST"])
def add_expense():
    data = load_data()

    new_expense = request.json

    # basic validation
    if not new_expense or "group" not in new_expense or "amount" not in new_expense:
        return jsonify({"error": "Invalid data"}), 400

    data.append(new_expense)
    save_data(data)

    return jsonify({"message": "Expense added successfully!"})


# Get all expenses
@app.route("/expenses", methods=["GET"])
def get_expenses():
    data = load_data()
    return jsonify(data)


# Run server
if __name__ == "__main__":
    app.run(debug=True)