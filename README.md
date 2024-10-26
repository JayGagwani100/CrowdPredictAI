# CrowdPredictAI

Step 1: Clone the Repository

Open terminal and run:
git clone https://github.com/amaan2106/CrowdPredictAI

Step 2: Navigate to the Project Directory

cd CrowdPredictAI

Step 3: Install Backend Requirements

Ensure Python is installed.

Create and activate a virtual environment (optional):

python3 -m venv venv # Create a virtual environment
source venv/bin/activate # On Windows: venv\Scripts\activate

Step 4: Install Frontend Dependencies on both CROWDPREDICTAI Folder & CrowdPredictor

cd CROWDPREDICTAI
npm install

cd CrowdPredictor
npm install

Step 5: Install Python packages in backend folder:

cd Crowdpredictor
cd backend
pip install -r requirements.txt

Step 6: Run the App (Frontend & Backend)

cd CrowdPredictor
npm run dev


Missing API Keys: Ensure all keys are set up correctly.
Port Conflicts: Verify no other processes are using ports 5173 (frontend) or 5001 (backend).
Python Errors: If packages are missing, activate the virtual environment and run pip install -r requirements.txt.
