// scripts/sparepart_stock.js

document.addEventListener('DOMContentLoaded', () => {
    fetchSparePartsData();
});

async function fetchSparePartsData() {
    const tbody = document.getElementById('sparepart-data-body');
    tbody.innerHTML = '<tr><td colspan="4">Memuat data...</td></tr>';

    try {
        const response = await fetch('http://127.0.0.1:5000/spare_parts');
        const spareParts = await response.json();

        tbody.innerHTML = ''; // Kosongkan tabel

        if (spareParts.length === 0) {
            tbody.innerHTML = '<tr><td colspan="4">Tidak ada data untuk ditampilkan.</td></tr>';
            return;
        }

        spareParts.forEach(part => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${part.part_id}</td>
                <td>${part.part_name}</td>
                <td>${part.type}</td>
                <td><b>${part.stock}</b> pcs</td>
            `;
            tbody.appendChild(row);
        });

    } catch (error) {
        tbody.innerHTML = `<tr><td colspan="4">Gagal memuat data: ${error}</td></tr>`;
    }
}