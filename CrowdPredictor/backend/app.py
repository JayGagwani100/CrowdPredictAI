from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Dummy data for linear regression
X = np.array([[0], [1], [2], [3], [4], [5], [6], [7], [8], [9]])
y = np.array([10, 20, 30, 40, 50, 60, 70, 80, 90, 100])

# Train the model
model = LinearRegression()
model.fit(X, y)

@app.route('/')
def home():
    return "Welcome to the Crowd Predictor API!"


@app.route('/predict', methods=['POST'])
def predict():
    data = request.json
    hour = np.array([[data['hour']]])
    prediction = model.predict(hour)
    return jsonify({'prediction': prediction[0]})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
