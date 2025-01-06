const ctx = document.getElementById('ageCategoryDoughnut').getContext('2d');

const data = {
    labels: ['0-18 ani', '19-30 ani', '31-50 ani', '51+ ani'],
    datasets: [{
        label: 'Distribuție pe categorii de vârstă (%)',
        data: [25, 35, 30, 10], 
        backgroundColor: [
            'rgba(255, 99, 132, 0.7)',
            'rgba(54, 162, 235, 0.7)',
            'rgba(255, 206, 86, 0.7)',
            'rgba(75, 192, 192, 0.7)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)'
        ],
        borderWidth: 1
    }]
};

const options = {
    responsive: true,
    indexAxis: 'y', 
    plugins: {
        legend: {
            display: false 
        },
        tooltip: {
            callbacks: {
                label: function(tooltipItem) {
                    return `${tooltipItem.raw}%`; 
                }
            }
        },
        title: {
            display: true,
            text: 'Distribuție pe categorii de vârstă (%)'
        }
    },
    scales: {
        x: {
            beginAtZero: true,
            ticks: {
                callback: function(value) {
                    return value + '%'; 
                }
            }
        }
    }
};

new Chart(ctx, {
    type: 'bar',
    data: data,
    options: options
});