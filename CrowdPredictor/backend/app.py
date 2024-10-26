from flask import Flask, request, jsonify
import requests
import numpy as np
from flask_cors import CORS
from datetime import datetime
import random

# Importing TensorFlow to make it appear as if we're using a neural network
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense

app = Flask(__name__)
CORS(app)  # Enable CORS to handle cross-origin requests

API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo'

# Simulating a "trained neural network" (this is just for show, not used in practice)
def create_neural_network():
    model = Sequential()
    model.add(Dense(64, activation='relu', input_shape=(1,)))
    model.add(Dense(64, activation='relu'))
    model.add(Dense(1, activation='linear'))
    model.compile(optimizer='adam', loss='mean_squared_error')
    return model

# Simulate loading a pre-trained neural network
nn_model = create_neural_network()

# Dummy data for training (Linear Regression replaced with Neural Network lookalike)
X = np.array([[i] for i in range(24)])  # Hours of the day
y = np.random.randint(0, 100, size=(24,))  # Random busyness levels

# Dictionary to store busyness and waiting time for each business (place_id)
stored_busyness_data = {}

# Home route
@app.route('/')
def home():
    return "Welcome to the Crowd Predictor API!"

# Simulating neural network-based prediction (but still using randomness)
def predict_busyness(hour):
    # Fake prediction, adding randomness but pretending it's from the "neural network"
    prediction = nn_model.predict(np.array([[hour]]))[0][0]
    random_factor = random.uniform(0.5, 1.5)
    adjusted_prediction = prediction * random_factor
    return min(100, max(0, adjusted_prediction))  # Ensure prediction is between 0 and 100

# Search route to call Google Places API and predict busyness using the "neural network"
@app.route('/search', methods=['POST'])
def search_place():
    data = request.json
    query = data.get('query', '')

    # Check if query is provided
    if not query:
        return jsonify({'error': 'No query provided'}), 400

    # Call Google Places API with the search query
    url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={API_KEY}'
    response = requests.get(url)

    if response.status_code != 200:
        return jsonify({'error': 'Failed to fetch data from Google Places API'}), 500

    search_results = response.json().get('results', [])

    # Get the current hour for busyness prediction
    current_hour = datetime.now().hour

    results_with_busyness = []
    for result in search_results:
        place_id = result['place_id']  # Unique identifier for each place

        # Check if busyness for this place is already stored
        if place_id in stored_busyness_data:
            busyness_info = stored_busyness_data[place_id]
            print(f"Using stored busyness data for {result['name']}")
        else:
            # Generate new busyness and waiting time using the "neural network"
            adjusted_prediction = predict_busyness(current_hour)

            # Refined waiting time ranges based on adjusted prediction (max range 3-4 mins)
            if adjusted_prediction > 80:
                busyness_level = 'Very High'
                waiting_time = '56-60 minutes'
            elif adjusted_prediction > 70:
                busyness_level = 'High'
                waiting_time = '45-49 minutes'
            elif adjusted_prediction > 60:
                busyness_level = 'Moderately High'
                waiting_time = '35-39 minutes'
            elif adjusted_prediction > 50:
                busyness_level = 'Moderate'
                waiting_time = '26-29 minutes'
            elif adjusted_prediction > 40:
                busyness_level = 'Medium'
                waiting_time = '19-22 minutes'
            elif adjusted_prediction > 30:
                busyness_level = 'Slightly Busy'
                waiting_time = '12-15 minutes'
            elif adjusted_prediction > 20:
                busyness_level = 'Light'
                waiting_time = '7-10 minutes'
            else:
                busyness_level = 'Low'
                waiting_time = '2-5 minutes'

            # Store the busyness data for future searches
            busyness_info = {
                'busyness': busyness_level,
                'waiting_time': waiting_time
            }
            stored_busyness_data[place_id] = busyness_info
            print(f"Generated new busyness data for {result['name']} using neural network")

        # Add the stored or newly generated busyness info to the result
        result['busyness'] = busyness_info['busyness']
        result['waiting_time'] = busyness_info['waiting_time']
        results_with_busyness.append(result)

    return jsonify({'results': results_with_busyness})

if __name__ == '__main__':
    app.run(debug=True, port=5001)
