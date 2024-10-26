# CrowdPredictAI


Setup Instructions for the App

Step 1: Clone the Repository
First, open your terminal and clone the repository from GitHub:
git clone <repository_url>

Step 2: Navigate to the Project Directory
Move into the directory of the cloned repository:
cd <project_directory>

Step 3: Install Backend Requirements (Flask, TensorFlow, etc.)
Make sure you have Python installed. Then, create a virtual environment (optional but recommended) and install the requirements:
# Create and activate virtual environment (optional)
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install required Python packages
pip install -r requirements.txt

Step 4: Install Frontend Dependencies
Navigate to the frontend directory (if applicable) and install the required dependencies using npm or yarn:
# Install npm dependencies
npm install

Step 5: Run the Backend (Flask)
Start the Flask backend by running the following command:
cd backend
python3 app.py

Step 6: Run the Frontend (React)
In a new terminal window, start the frontend using npm:
npm run dev

Step 7: Access the App
Open your web browser and go to:
http://localhost:3000

Step 8: Additional Notes
- Ensure you have the correct API keys (e.g., for Google Places) and that they are properly set in the project.
- Ensure both the backend and frontend are running simultaneously for the app to work.
