# scripts/tracking_tools.py

import json
import datetime
import os

def update_impact_status(current_pulse):
    """
    Menentukan dan mengembalikan status impact berdasarkan sisa pulsa.
    """
    if current_pulse <= 16:
        return "Service"
    elif current_pulse <= 261:
        return "Low"
    elif current_pulse <= 523:
        return "Medium"
    else:
        return "Full"

def is_working_hours():
    """
    Memeriksa apakah waktu saat ini berada dalam jam kerja (7:30 - 16:30, Senin-Jumat).
    """
    now = datetime.datetime.now()
    is_weekday = 0 <= now.weekday() <= 4
    start_time = datetime.time(7, 30)
    end_time = datetime.time(16, 30)
    return is_weekday and start_time <= now.time() <= end_time

def load_data(file_path):
    """
    Membaca data impact dari file JSON.
    """
    current_dir = os.path.dirname(__file__)
    full_path = os.path.join(current_dir, '..', 'data', file_path)
    
    with open(full_path, 'r') as file:
        return json.load(file)

def save_data(data, file_path):
    """
    Menyimpan data impact ke file JSON.
    """
    current_dir = os.path.dirname(__file__)
    full_path = os.path.join(current_dir, '..', 'data', file_path)
    
    with open(full_path, 'w') as file:
        json.dump(data, file, indent=4)
        
def main():
    """
    Fungsi utama untuk menjalankan simulasi tracking tools.
    """
    print("--- Memulai Simulasi Tracking Tools ---")
    file_data = 'impack_data.json'
    
    impacts = load_data(file_data)
    
    if is_working_hours():
        print("Status: Saat ini berada di dalam jam kerja. Pulsa akan dihitung.")
        pulse_to_deduct = 8
        
        for impact in impacts:
            if impact['current_pulse'] > 0:
                impact['current_pulse'] -= pulse_to_deduct
            
            impact['status'] = update_impact_status(impact['current_pulse'])
        
        save_data(impacts, file_data)
        
    else:
        print("Status: Saat ini di luar jam kerja. Pulsa tidak dihitung.")
    
    print("\n--- Hasil Akhir ---")
    
    for impact in impacts:
        print(f"ID: {impact['id']:<10} | Lokasi: {impact['location']:<30} | Sisa Pulsa: {impact['current_pulse']:<5} jam | Status: {impact['status']}")

if __name__ == "__main__":
    main()