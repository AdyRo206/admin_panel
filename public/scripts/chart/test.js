// Configurăm contextul pentru graficul mare
const ctxMainChart = document.getElementById('latestUpdatesChart').getContext('2d');

// Datele pentru graficul mare
const latestUpdatesData = {
    labels: ['Ianuarie', 'Februarie', 'Martie', 'Aprilie', 'Mai', 'Iunie'],
    datasets: [
        {
            label: 'Produse adăugate',
            data: [40, 60, 80, 50, 70, 90],
            backgroundColor: 'rgba(75, 192, 192, 0.7)', // Culoarea barelor
            borderColor: 'rgba(75, 192, 192, 1)',
            borderWidth: 1
        },
        {
            label: 'Comenzi plasate',
            data: [30, 50, 70, 40, 60, 85],
            backgroundColor: 'rgba(255, 99, 132, 0.7)', // Culoarea barelor
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 1
        }
    ]
};

// Configurăm opțiunile graficului mare
const latestUpdatesConfig = {
    type: 'bar',
    data: latestUpdatesData,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Ultimele actualizări'
            },
            legend: {
                display: true,
                position: 'top'
            }
        },
        scales: {
            x: {
                beginAtZero: true
            },
            y: {
                beginAtZero: true
            }
        }
    }
};

// Inițializăm graficul mare
new Chart(ctxMainChart, latestUpdatesConfig);
