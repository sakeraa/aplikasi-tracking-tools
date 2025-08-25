# app.py

import json
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# --- KONFIGURASI FILE DATA ---
IMPACT_DATA_FILE = 'data/impack_data.json'
SPARE_PARTS_FILE = 'data/spare_parts_stock.json'

# --- FUNGSI BANTU UNTUK IMPACT TOOLS ---
def load_impact_data():
    with open(IMPACT_DATA_FILE, 'r') as file:
        return json.load(file)

def save_impact_data(data):
    with open(IMPACT_DATA_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# --- FUNGSI BANTU UNTUK SPARE PARTS ---
def load_spare_parts_data():
    with open(SPARE_PARTS_FILE, 'r') as file:
        return json.load(file)

def save_spare_parts_data(data):
    with open(SPARE_PARTS_FILE, 'w') as file:
        json.dump(data, file, indent=4)

# --- ENDPOINTS / ROUTES UNTUK IMPACT TOOLS ---
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

@app.route('/add_spare_part', methods=['POST'])
def add_spare_part():
    try:
        data_to_add = request.json
        impacts = load_impact_data()
        impact_found = False
        for impact in impacts:
            if impact['id'] == data_to_add['id']:
                if 'spare_parts' not in impact:
                    impact['spare_parts'] = []
                part_exists = False
                for part in impact['spare_parts']:
                    if part['name'].lower() == data_to_add['part_name'].lower():
                        part['quantity'] += int(data_to_add['quantity'])
                        part_exists = True
                        break
                if not part_exists:
                    impact['spare_parts'].append({
                        "name": data_to_add['part_name'],
                        "quantity": int(data_to_add['quantity'])
                    })
                impact_found = True
                break
        if impact_found:
            save_impact_data(impacts)
            return jsonify({"success": True, "message": "Stok spare part berhasil ditambahkan."})
        else:
            return jsonify({"success": False, "message": "ID Impact tidak ditemukan."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- ENDPOINTS / ROUTES UNTUK SPARE PARTS ---
@app.route('/spare_parts', methods=['GET'])
def get_spare_parts():
    try:
        spare_parts = load_spare_parts_data()
        return jsonify(spare_parts)
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/update_spare_part_stock', methods=['POST'])
def update_spare_part_stock():
    try:
        data_to_update = request.json
        parts = load_spare_parts_data()
        part_found = False
        for part in parts:
            if part['part_id'].lower() == data_to_update['part_id'].lower():
                part['stock'] = data_to_update['stock']
                part_found = True
                break
        if not part_found:
            new_part = {
                "part_id": data_to_update['part_id'].upper(),
                "part_name": data_to_update['part_name'],
                "type": data_to_update['type'],
                "stock": int(data_to_update['stock'])
            }
            parts.append(new_part)
        save_spare_parts_data(parts)
        message = "Stok berhasil diperbarui." if part_found else "Spare part baru berhasil ditambahkan."
        return jsonify({"success": True, "message": message})
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- ENDPOINTS BARU UNTUK UPDATE DETAIL ---
@app.route('/update_condition', methods=['POST'])
def update_condition():
    try:
        data = request.json
        impact_id = data['id']
        new_condition = data['condition']
        impacts = load_impact_data()
        impact_found = False
        for impact in impacts:
            if impact['id'] == impact_id:
                impact['condition'] = new_condition
                impact_found = True
                break
        if impact_found:
            save_impact_data(impacts)
            return jsonify({"success": True, "message": "Kondisi berhasil diperbarui."})
        else:
            return jsonify({"success": False, "message": "ID Impact tidak ditemukan."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

@app.route('/add_service_history', methods=['POST'])
def add_service_history():
    try:
        data = request.json
        impact_id = data['id']
        history_entry = {
            "date": data['date'],
            "notes": data['notes']
        }
        impacts = load_impact_data()
        impact_found = False
        for impact in impacts:
            if impact['id'] == impact_id:
                if 'service_history' not in impact:
                    impact['service_history'] = []
                impact['service_history'].insert(0, history_entry)
                impact_found = True
                break
        if impact_found:
            save_impact_data(impacts)
            return jsonify({"success": True, "message": "Riwayat servis berhasil ditambahkan."})
        else:
            return jsonify({"success": False, "message": "ID Impact tidak ditemukan."}), 404
    except Exception as e:
        return jsonify({"success": False, "message": str(e)}), 500

# --- Menjalankan Aplikasi ---
if __name__ == '__main__':
    app.run(debug=True, port=5000)