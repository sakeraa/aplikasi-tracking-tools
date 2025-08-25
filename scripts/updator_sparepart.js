// scripts/updator_sparepart.js

document.addEventListener('DOMContentLoaded', () => {
    const updateForm = document.getElementById('sparepart-update-form');
    const statusMessage = document.getElementById('status-message');

    updateForm.addEventListener('submit', async (event) => {
        event.preventDefault();

        const partId = document.getElementById('part-id').value;
        const partName = document.getElementById('part-name').value;
        const partType = document.getElementById('part-type').value;
        const stock = parseInt(document.getElementById('part-stock').value, 10);

        // Validasi sederhana: jika ID belum ada, nama dan tipe harus diisi
        // Ini bisa dipercanggih dengan mengecek dulu ke server
        if ( (partName === '' || partType === '') && !partId.toLowerCase().startsWith('air') && !partId.toLowerCase().startsWith('bat') ) {
             statusMessage.textContent = 'Error: Untuk part baru, Nama dan Tipe harus diisi.';
             statusMessage.className = 'message-error';
             return;
        }

        try {
            const response = await fetch('http://127.0.0.1:5000/update_spare_part_stock', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    part_id: partId,
                    part_name: partName,
                    type: partType,
                    stock: stock
                }),
            });

            const result = await response.json();

            if (result.success) {
                statusMessage.textContent = result.message;
                statusMessage.className = 'message-success';
                updateForm.reset();
            } else {
                statusMessage.textContent = `Error: ${result.message}`;
                statusMessage.className = 'message-error';
            }

        } catch (error) {
            statusMessage.textContent = `Error: Tidak dapat terhubung ke server. ${error}`;
            statusMessage.className = 'message-error';
        }
    });
});