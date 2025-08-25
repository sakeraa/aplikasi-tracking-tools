// scripts/dashboard.js

// Variabel global
let allImpactsData = [];
const widget = document.getElementById('info-widget');
const widgetTitle = document.getElementById('widget-title');
const widgetCondition = document.getElementById('widget-condition');
const widgetHistory = document.getElementById('widget-history');
const closeButton = document.querySelector('.widget-close');

document.addEventListener('DOMContentLoaded', () => {
    initDashboard();

    // Event listener untuk tombol close pada widget
    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation(); // Mencegah event "klik di luar" aktif
            widget.classList.add('hidden');
        });
    }

    // Event listener untuk menutup widget saat mengklik di luar area widget
    document.addEventListener('click', (event) => {
        if (widget && !widget.classList.contains('hidden')) {
            const isClickInsideWidget = widget.contains(event.target);
            const isClickOnTableRow = event.target.closest('tr');
            
            if (!isClickInsideWidget && !isClickOnTableRow) {
                widget.classList.add('hidden');
            }
        }
    });
});

// Fungsi untuk mengambil data dari server
async function fetchImpactData() {
    try {
        const response = await fetch('http://127.0.0.1:5000/impacts');
        const data = await response.json();
        allImpactsData = data;
        displayImpactData(allImpactsData);
    } catch (error) {
        const tbody = document.getElementById('impact-data-body');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="4">Gagal memuat data: ${error}</td></tr>`;
        }
    }
}

// Fungsi untuk menampilkan data di tabel
function displayImpactData(impacts) {
    const tbody = document.getElementById('impact-data-body');
    if (!tbody) return;
    
    tbody.innerHTML = '';

    impacts.forEach(impact => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', impact.id);
        row.innerHTML = `
            <td>${impact.id}</td>
            <td>${impact.location}</td>
            <td>${impact.current_pulse} jam</td>
            <td><div class="status-cell ${impact.status.toLowerCase()}">${impact.status}</div></td>
        `;
        tbody.appendChild(row);
    });

    tbody.removeEventListener('click', handleRowClick);
    tbody.addEventListener('click', handleRowClick);
}

// Fungsi yang menangani saat sebuah baris di-klik
function handleRowClick(event) {
    event.stopPropagation(); // Mencegah event "klik di luar" aktif
    const row = event.target.closest('tr');
    if (!row) return;

    const impactId = row.dataset.id;
    const selectedImpact = allImpactsData.find(impact => impact.id === impactId);

    if (selectedImpact) {
        // Isi widget dengan data
        widgetTitle.textContent = `Detail untuk ${selectedImpact.id}`;
        widgetCondition.textContent = selectedImpact.condition || 'Tidak ada data';
        
        widgetHistory.innerHTML = '';
        if (selectedImpact.service_history && selectedImpact.service_history.length > 0) {
            selectedImpact.service_history.forEach(item => {
                const li = document.createElement('li');
                li.textContent = `${item.date}: ${item.notes}`;
                widgetHistory.appendChild(li);
            });
        } else {
            const li = document.createElement('li');
            li.textContent = 'Tidak ada riwayat servis.';
            widgetHistory.appendChild(li);
        }

        // Hitung posisi dan tampilkan widget
        const rowRect = row.getBoundingClientRect();
        
        // Atur posisi widget tepat di bawah baris yang diklik
        widget.style.top = `${rowRect.bottom + window.scrollY}px`;
        widget.style.left = `${rowRect.left + window.scrollX}px`;

        widget.classList.remove('hidden');
    }
}

// Inisialisasi dan refresh otomatis
function initDashboard() {
    fetchImpactData();
    setInterval(fetchImpactData, 30000);
}