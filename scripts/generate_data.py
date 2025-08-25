# scripts/generate_data.py

import json
import random
import os

def update_impact_status(current_pulse):
    if current_pulse <= 16:
        return "Service"
    elif current_pulse <= 261:
        return "Low"
    elif current_pulse <= 523:
        return "Medium"
    else:
        return "Full"

def generate_random_impacts(count):
    """
    Menghasilkan list data impact baru secara acak.
    """
    new_impacts = []
    locations = ["Area Utara", "Area Selatan", "Gudang Utama", "Ruang Kontrol", "Bengkel 1", "Bengkel 2"]
    
    for i in range(1, count + 1):
        impact_id = f"IM-{i:03d}"
        random_pulse = random.randint(10, 800)
        
        impact = {
            "id": impact_id,
            "location": random.choice(locations),
            "current_pulse": random_pulse
        }
        
        impact["status"] = update_impact_status(impact["current_pulse"])
        new_impacts.append(impact)
        
    return new_impacts

def main():
    """
    Fungsi utama untuk menghasilkan data dan menyimpannya.
    """
    print("--- Membuat 20 data impact baru ---")
    
    new_data = generate_random_impacts(20)
    
    current_dir = os.path.dirname(__file__)
    file_path = os.path.join(current_dir, '..', 'data', 'impack_data.json')
    
    with open(file_path, 'w') as file:
        json.dump(new_data, file, indent=4)
    
    print(f"Berhasil! 20 data impact baru telah disimpan di {file_path}.")
    print("---------------------------------------")
    print("Berikut adalah data yang baru dibuat:")
    for impact in new_data:
        print(f"ID: {impact['id']:<10} | Lokasi: {impact['location']:<20} | Pulsa: {impact['current_pulse']:<5} | Status: {impact['status']}")

if __name__ == "__main__":
    main()