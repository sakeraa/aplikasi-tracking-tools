// scripts/station.js

let allImpactsData = [];
const widget = document.getElementById('info-widget');
const widgetTitle = document.getElementById('widget-title');
const widgetCondition = document.getElementById('widget-condition');
const widgetHistory = document.getElementById('widget-history');
const closeButton = document.querySelector('.widget-close');

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const stationName = params.get('station');

    const stationTitle = document.getElementById('station-title');
    const stationDataTitle = document.getElementById('station-data-title');
    if (stationName) {
        stationTitle.textContent = `Dashboard Stasiun ${stationName}`;
        stationDataTitle.textContent = `Data Impact di ${stationName}`;
    }

    initDashboard(stationName);

    if (closeButton) {
        closeButton.addEventListener('click', (event) => {
            event.stopPropagation();
            widget.classList.add('hidden');
        });
    }

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

async function fetchImpactData(station) {
    try {
        const response = await fetch(`https://gtr.pythonanywhere.com/impacts`);
        const allData = await response.json();
        
        // Filter data HANYA untuk stasiun yang relevan
        const filteredData = allData.filter(impact => impact.location === station);
        
        allImpactsData = filteredData;
        displayImpactData(allImpactsData);
    } catch (error) {
        const tbody = document.getElementById('impact-data-body');
        if (tbody) {
            tbody.innerHTML = `<tr><td colspan="5">Gagal memuat data: ${error}</td></tr>`;
        }
    }
}

function displayImpactData(impacts) {
    const tbody = document.getElementById('impact-data-body');
    if (!tbody) return;
    tbody.innerHTML = '';

    impacts.forEach(impact => {
        const row = document.createElement('tr');
        row.setAttribute('data-id', impact.id);
        row.innerHTML = `
            <td>${impact.id}</td>
            <td>${impact.jenis || '-'}</td>
            <td>${impact.merk || '-'}</td>
            <td>${impact.current_pulse} jam</td>
            <td><div class="status-cell ${impact.status.toLowerCase()}">${impact.status}</div></td>
        `;
        tbody.appendChild(row);
    });

    tbody.removeEventListener('click', handleRowClick);
    tbody.addEventListener('click', handleRowClick);
}

function handleRowClick(event) {
    event.stopPropagation();
    const row = event.target.closest('tr');
    if (!row) return;

    const impactId = row.dataset.id;
    const selectedImpact = allImpactsData.find(impact => impact.id === impactId);

    if (selectedImpact) {
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

        const rowRect = row.getBoundingClientRect();
        widget.style.top = `${rowRect.bottom + window.scrollY}px`;
        widget.style.left = `${rowRect.left + window.scrollX}px`;

        widget.classList.remove('hidden');
    }
}

function initDashboard(station) {
    fetchImpactData(station);
    setInterval(() => fetchImpactData(station), 30000);
}