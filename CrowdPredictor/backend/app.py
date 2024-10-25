# app.py
from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Dummy data for training
X = np.array([[i] for i in range(24)])  # Hours of the day
y = np.random.randint(0, 100, size=(24,))  # Random busyness levels

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

@app.route('/busyness', methods=['GET'])
def get_busyness():
    place_id = request.args.get('placeId')
    if not place_id:
        return jsonify({'error': 'placeId is required'}), 400

    # Generate dummy busyness data for the example
    busyness_levels = np.random.randint(0, 100, size=(24,)).tolist()
    labels = [f'{i}:00' for i in range(24)]

    return jsonify({'busynessLevels': busyness_levels, 'labels': labels})

if __name__ == '__main__':
    app.run(debug=True, port=5001)


"""

# app.py
from flask import Flask, request, jsonify
import numpy as np
from sklearn.linear_model import LinearRegression

app = Flask(__name__)

# Dummy data for training
X = np.array([[i] for i in range(24)])  # Hours of the day
y = np.random.randint(0, 100, size=(24,))  # Random busyness levels

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

@app.route('/busyness', methods=['GET'])
def get_busyness():
    place_id = request.args.get('placeId')
    hour = int(request.args.get('hour', 12))  # Default to noon if hour is not provided

    if not place_id:
        return jsonify({'error': 'placeId is required'}), 400

    # Use the model to predict busyness
    prediction = model.predict(np.array([[hour]]))[0]

    # Determine busyness level
    if prediction > 66:
        busyness_level = 'High'
    elif prediction > 33:
        busyness_level = 'Medium'
    else:
        busyness_level = 'Low'

    return jsonify({'busyness': busyness_level})

if __name__ == '__main__':
    app.run(debug=True, port=5001)

    """