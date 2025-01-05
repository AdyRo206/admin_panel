const ctx2 = document.getElementById('salesPointLineChart2').getContext('2d');

const salesData2 = {
    labels: ['Ian', 'Feb', 'Mar', 'Apr', 'Mai', 'Iun', 'Iul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'],
    datasets: [{
        label: 'Utilizatori noi',
        data: [30, 60, 45, 60, 70, 55, 35, 32, 52, 85, 92, 72], 
        borderColor: 'rgba(255, 99, 132, 1)', 
        backgroundColor: 'rgba(255, 99, 132, 0.2)', 
        pointStyle: 'star', 
        pointRadius: 10, 
        pointHoverRadius: 15 
    }]
};

const config2 = {
    type: 'line',
    data: salesData2,
    options: {
        responsive: true,
        plugins: {
            title: {
                display: false,
                text: 'Conturi noi'
            }
        },
        scales: {
            y: {
                beginAtZero: true
            }
        }
    }
};

const salesPointLineChart2 = new Chart(ctx2, config2);
