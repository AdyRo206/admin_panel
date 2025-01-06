const ctx1 = document.getElementById('salesPointLineChart1').getContext('2d');

const salesData1 = {
    labels: ['Luni', 'Marti', 'Miercuri', 'Joi', 'Vineri', 'Sambata', 'Duminica'],
    datasets: [{
        label: 'Vânzări săptămânale',
        data: [45, 78, 56, 89, 91, 60, 30], 
        borderColor: 'rgba(75, 192, 192, 1)', 
        backgroundColor: 'rgba(75, 192, 192, 0.2)', 
        pointStyle: 'circle', 
        pointRadius: 10, 
        pointHoverRadius: 15 
    }]
};

const config1 = {
    type: 'line',
    data: salesData1,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Vânzări pe săptămână'
            },
            legend:{
                display: true,
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const salesPointLineChart1 = new Chart(ctx1, config1);


