from flask import Flask, request, jsonify
import requests
import numpy as np
from sklearn.linear_model import LinearRegression
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # Enable CORS to handle cross-origin requests

API_KEY = 'AIzaSyCiCkWkPsSdROJxggT-NtJ1Z9OeP75LuSo'

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
    if not data or 'hour' not in data:
        return jsonify({'error': 'Hour is required'}), 400

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

# New route to handle search queries and call Google Places API
@app.route('/search', methods=['POST'])
def search_place():
    data = request.json
    query = data.get('query', '')

    # Check if query is provided
    if not query:
        print("No query provided")  # Log the error
        return jsonify({'error': 'No query provided'}), 400

    print(f"Received query: {query}")

    # Call Google Places API with the search query
    url = f'https://maps.googleapis.com/maps/api/place/textsearch/json?query={query}&key={API_KEY}'
    print(f"Requesting URL: {url}")  # Log the URL being called

    response = requests.get(url)

    # Log API response status
    if response.status_code != 200:
        print(f"Google API Error: {response.status_code} - {response.text}")
        return jsonify({'error': 'Failed to fetch data from Google Places API'}), 500

    search_results = response.json().get('results', [])
    print(f"Google API returned {len(search_results)} results")

    return jsonify({'results': search_results})

if __name__ == '__main__':
    app.run(debug=True, port=5001)