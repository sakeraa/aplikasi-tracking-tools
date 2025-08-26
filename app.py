# app.py

import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

IMPACT_DATA_FILE = 'data/impack_data.json'
SPARE_PARTS_FILE = 'data/spare_parts_stock.json'

def load_impact_data():
    with open(IMPACT_DATA_FILE, 'r') as file:
        return json.load(file)
def save_impact_data(data):
    with open(IMPACT_DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)
def load_spare_parts_data():
    with open(SPARE_PARTS_FILE, 'r') as file:
        return json.load(file)
def save_spare_parts_data(data):
    with open(SPARE_PARTS_FILE, 'w') as file:
        json.dump(data, file, indent=4)

@app.route('/impacts', methods=['GET'])
def get_impacts():
    impacts = load_impact_data()
    return jsonify(impacts)

@app.route('/update_impact', methods=['POST'])
def update_impact():
    try:
        updated_data = request.json
        impacts = load_impact_data()
        impact_found = False
        for impact in impacts:
            if impact['id'] == updated_data['id']:
                impact['current_pulse'] = updated_data.get('current_pulse', impact['current_pulse'])
                impact['status'] = updated_data.get('status', impact['status'])
                impact['location'] = updated_data.get('location', impact['location'])
                impact_found = True
                break
        if impact_found:
            save_impact_data(impacts)
            return jsonify({"success": True, "message": "Data berhasil diperbarui."})
        else:
            return jsonify({"success": False, "message": "ID Impact tidak ditemukan."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/deactivate_impact', methods=['POST'])
def deactivate_impact():
    try:
        data = request.json
        impact_id = data['id']
        impacts = load_impact_data()
        impact_found = False
        for impact in impacts:
            if impact['id'] == impact_id:
                impact['status'] = 'Non-aktif'
                impact['location'] = 'Gudang Arsip'
                impact_found = True
                break
        if impact_found:
            save_impact_data(impacts)
            return jsonify({"success": True, "message": f"Impact {impact_id} telah dinonaktifkan."})
        else:
            return jsonify({"success": False, "message": "ID Impact tidak ditemukan."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# ... (semua route lain untuk spare part dan detail biarkan saja) ...

if __name__ == '__main__':
    app.run(debug=True, port=5000)