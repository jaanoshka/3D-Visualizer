from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)  # CORS für die gesamte App aktivieren

@app.route('/')
def home():
    return "Backend ist erfolgreich gestartet!"

@app.route('/receive-data', methods=['POST'])
def receive_data():
    data = request.get_json()
    print("Empfangene Daten:", data)
    return jsonify({"message": "Daten erfolgreich empfangen!", "receivedData": data}), 200

if __name__ == '__main__':
    app.run(debug=True)
