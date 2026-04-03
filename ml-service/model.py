import numpy as np
from sklearn.linear_model import LinearRegression

# 🔥 Dummy past expense data (can be replaced with DB later)
# months (1–6)
months = np.array([1, 2, 3, 4, 5, 6]).reshape(-1, 1)

# expenses in ₹
expenses = np.array([5000, 7000, 6500, 8000, 9000, 10000])

# train model
model = LinearRegression()
model.fit(months, expenses)

def predict_expense():
    # predict for next month (7)
    next_month = np.array([[7]])
    prediction = model.predict(next_month)

    return int(prediction[0])