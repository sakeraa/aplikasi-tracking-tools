// scripts/updator.js

document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('update-form');
    const statusMessage = document.getElementById('status-message');
    const allImpacts = [];

    // Fungsi untuk menghitung status berdasarkan pulsa
    function updateImpactStatus(current_pulse) {
        if (current_pulse <= 16) return "Service";
        if (current_pulse <= 261) return "Low";
        if (current_pulse <= 523) return "Medium";
        return "Full";
    }

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const impactId = document.getElementById('impact-id').value;
        const newLocation = document.getElementById('new-location').value;
        const newPulse = parseInt(document.getElementById('new-pulse').value, 10);
        const newStatus = updateImpactStatus(newPulse);

        try {
            const response = await fetch('https://gtr.pythonanywhere.com/update_impact', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    id: impactId,
                    current_pulse: newPulse,
                    status: newStatus,
                    location: newLocation
                }),
            });
            const result = await response.json();
            statusMessage.textContent = result.message;
            statusMessage.className = result.success ? 'message-success' : 'message-error';
            if (result.success) {
                updateForm.reset();
            }
        } catch (error) {
            statusMessage.textContent = `Error: Tidak dapat terhubung ke server. ${error}`;
            statusMessage.className = 'message-error';
        }
    });

    // --- Logika untuk form Non-aktifkan ---
    const deactivateForm = document.getElementById('deactivate-form');
    const deactivateStatusMessage = document.getElementById('deactivate-status-message');

    deactivateForm.addEventListener('submit', async (event) => {
        event.preventDefault();
        const impactId = document.getElementById('deactivate-id').value;

        if (!confirm(`Apakah Anda yakin ingin menonaktifkan impact ${impactId}? Tindakan ini akan mengubah status dan lokasinya.`)) {
            return;
        }

        try {
            const response = await fetch('https://gtr.pythonanywhere.com/deactivate_impact', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ id: impactId }),
            });
            const result = await response.json();
            
            deactivateStatusMessage.textContent = result.message;
            deactivateStatusMessage.className = result.success ? 'message-success' : 'message-error';
            if (result.success) {
                deactivateForm.reset();
            }
        } catch (error) {
            deactivateStatusMessage.textContent = `Error: ${error}`;
            deactivateStatusMessage.className = 'message-error';
        }
    });
});