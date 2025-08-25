// scripts/updator.js

async function fetchImpactData() {
    try {
        const response = await fetch('http://localhost:5000/impacts'); // URL diperbarui
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Gagal mengambil data impact:', error); // Teks diperbarui
        return [];
    }
}

async function saveImpactData(data) {
    try {
        const response = await fetch('http://localhost:5000/update_impact', { // URL diperbarui
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const result = await response.json();
        return result.success;
    } catch (error) {
        console.error('Gagal menyimpan data ke API:', error);
        return false;
    }
}

function displayStatusMessage(message, type) {
    const statusMessageDiv = document.getElementById('status-message');
    statusMessageDiv.textContent = message;
    statusMessageDiv.className = '';
    statusMessageDiv.classList.add('message-' + type);
}

document.getElementById('update-form').addEventListener('submit', async function(event) {
    event.preventDefault();

    const impactIdInput = document.getElementById('impact-id').value.trim().toUpperCase(); // ID elemen diperbarui
    const newStatus = document.getElementById('new-status').value;
    const newLocation = document.getElementById('new-location').value;

    let impacts = await fetchImpactData();
    let impactFound = false;

    if (impacts.length > 0) {
        const targetImpact = impacts.find(impact => impact.id === impactIdInput);
        if (targetImpact) {
            impactFound = true;
            targetImpact.status = newStatus;
            targetImpact.location = newLocation;

            if (newStatus === 'Full') {
                targetImpact.current_pulse = 800;
            } else if (newStatus === 'Service') {
                targetImpact.current_pulse = 0;
            }

            const success = await saveImpactData(targetImpact);
            if (success) {
                displayStatusMessage(`Data untuk ${impactIdInput} berhasil diperbarui.`, 'success');
            } else {
                displayStatusMessage('Gagal memperbarui data di server.', 'error');
            }
        }
    }
    if (!impactFound) {
        displayStatusMessage(`ID Impact "${impactIdInput}" tidak ditemukan.`, 'error'); // Teks diperbarui
    }
});// scripts/dashboard.js

// ... (fungsi fetchImpactData yang sudah ada)

        impacts.forEach(impact => {
            const row = document.createElement('tr');

            // --- Format Spare Parts ---
            let sparePartsHtml = '<ul>';
            if (impact.spare_parts && impact.spare_parts.length > 0) {
                impact.spare_parts.forEach(part => {
                    sparePartsHtml += `<li>${part.name}: ${part.quantity} pcs</li>`;
                });
            } else {
                sparePartsHtml = '<li>Belum ada data</li>';
            }
            sparePartsHtml += '</ul>';
            // --- Akhir Format ---

            row.innerHTML = `
                <td>${impact.id}</td>
                <td>${impact.location}</td>
                <td>${impact.current_pulse}</td>
                <td><div class="status-cell ${impact.status.toLowerCase()}">${impact.status}</div></td>
                <td>${sparePartsHtml}</td> `;
            tbody.appendChild(row);
        });
// ... (sisa kode biarkan saja)// scripts/updator.js

document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('update-form');
    const statusMessage = document.getElementById('status-message');
    
    // ... (kode untuk updateForm biarkan saja)
    updateForm.addEventListener('submit', async (event) => {
        // ... (kode di dalam fungsi ini tidak perlu diubah)
    });

    // --- TAMBAHKAN KODE BARU DI BAWAH INI ---
    const addSparepartForm = document.getElementById('add-sparepart-form');
    const statusMessageSparepart = document.getElementById('status-message-sparepart');

    addSparepartForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const impactId = document.getElementById('impact-id-sparepart').value;
        const partName = document.getElementById('part-name').value;
        const quantity = parseInt(document.getElementById('part-quantity').value, 10);

        try {
            const response = await fetch('http://127.0.0.1:5000/add_spare_part', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: impactId,
                    part_name: partName,
                    quantity: quantity
                }),
            });

            const result = await response.json();

            if (result.success) {
                statusMessageSparepart.textContent = result.message;
                statusMessageSparepart.className = 'message-success';
                addSparepartForm.reset();
            } else {
                statusMessageSparepart.textContent = `Error: ${result.message}`;
                statusMessageSparepart.className = 'message-error';
            }

        } catch (error) {
            statusMessageSparepart.textContent = `Error: Tidak bisa terhubung ke server. ${error}`;
            statusMessageSparepart.className = 'message-error';
        }
    });
});