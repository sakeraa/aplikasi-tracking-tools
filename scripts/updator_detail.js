// scripts/updator_detail.js

document.addEventListener('DOMContentLoaded', () => {
    const searchBtn = document.getElementById('search-btn');
    const updateArea = document.getElementById('update-area');
    const currentImpactIdEl = document.getElementById('current-impact-id');
    const statusMessage = document.getElementById('status-message');

    let currentImpactId = null; // Untuk menyimpan ID yang sedang diedit

    searchBtn.addEventListener('click', async () => {
        const impactIdInput = document.getElementById('impact-id-search').value;
        if (!impactIdInput) {
            showMessage('Silakan masukkan ID Impact.', 'error');
            return;
        }

        // Cek apakah impact ada
        const response = await fetch('http://127.0.0.1:5000/impacts');
        const impacts = await response.json();
        const foundImpact = impacts.find(impact => impact.id.toLowerCase() === impactIdInput.toLowerCase());

        if (foundImpact) {
            currentImpactId = foundImpact.id;
            currentImpactIdEl.textContent = `Mengedit: ${currentImpactId}`;
            document.getElementById('new-condition').value = foundImpact.condition || 'Old';
            updateArea.classList.remove('hidden');
            showMessage('', 'clear'); // Hapus pesan status
        } else {
            updateArea.classList.add('hidden');
            showMessage('ID Impact tidak ditemukan.', 'error');
            currentImpactId = null;
        }
    });

    // Event listener untuk form kondisi
    const conditionForm = document.getElementById('condition-form');
    conditionForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!currentImpactId) return;

        const newCondition = document.getElementById('new-condition').value;
        const response = await fetch('http://127.0.0.1:5000/update_condition', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentImpactId, condition: newCondition }),
        });
        const result = await response.json();
        showMessage(result.message, result.success ? 'success' : 'error');
    });

    // Event listener untuk form riwayat servis
    const serviceHistoryForm = document.getElementById('service-history-form');
    serviceHistoryForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        if (!currentImpactId) return;

        const serviceDate = document.getElementById('service-date').value;
        const serviceNotes = document.getElementById('service-notes').value;
        
        const response = await fetch('http://127.0.0.1:5000/add_service_history', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ id: currentImpactId, date: serviceDate, notes: serviceNotes }),
        });
        const result = await response.json();
        showMessage(result.message, result.success ? 'success' : 'error');
        if(result.success) {
            serviceHistoryForm.reset();
        }
    });

    function showMessage(message, type) {
        statusMessage.textContent = message;
        if (type === 'success') {
            statusMessage.className = 'message-success';
        } else if (type === 'error') {
            statusMessage.className = 'message-error';
        } else {
            statusMessage.className = '';
        }
    }
});