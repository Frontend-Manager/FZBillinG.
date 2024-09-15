// Sample data for charts
const monthlySalesData = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
    datasets: [{
        label: 'Monthly Sales',
        data: [1200, 1500, 1800, 1300, 1600, 2000, 2100, 1700, 1800, 1900, 2000, 2200],
        borderColor: '#0044cc',
        backgroundColor: 'rgba(0, 68, 204, 0.2)',
        borderWidth: 2,
        fill: true,
    }]
};

const salesByCategoryData = {
    labels: ['MAINCOURSE','DESSERTS'],
    datasets: [{
        label: 'Sales by Category',
        data: [3000, 5000, 2500, 1000, 1500],
        backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)',
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)'
        ],
        borderColor: [
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
    }]
};

const revenueDistributionData = {
    labels: ['Online', 'In-Store', 'Wholesale'],
    datasets: [{
        label: 'Revenue Distribution',
        data: [60, 30, 10],
        backgroundColor: [
            'rgba(75, 192, 192, 0.2)',
            'rgba(153, 102, 255, 0.2)',
            'rgba(255, 159, 64, 0.2)'
        ],
        borderColor: [
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ],
        borderWidth: 1
    }]
};

// Create the charts
const ctxMonthlySales = document.getElementById('monthlySalesChart').getContext('2d');
const ctxSalesByCategory = document.getElementById('salesByCategoryChart').getContext('2d');
const ctxRevenueDistribution = document.getElementById('revenueDistributionChart').getContext('2d');

new Chart(ctxMonthlySales, {
    type: 'line',
    data: monthlySalesData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `₹${tooltipItem.raw.toLocaleString('en-IN')}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                },
                ticks: {
                    callback: function(value) {
                        return `₹${value.toLocaleString('en-IN')}`;
                    }
                }
            }
        }
    }
});

new Chart(ctxSalesByCategory, {
    type: 'bar',
    data: salesByCategoryData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                display: false
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `₹${tooltipItem.raw.toLocaleString('en-IN')}`;
                    }
                }
            }
        },
        scales: {
            x: {
                grid: {
                    display: false
                }
            },
            y: {
                beginAtZero: true,
                grid: {
                    color: '#e0e0e0'
                },
                ticks: {
                    callback: function(value) {
                        return `₹${value.toLocaleString('en-IN')}`;
                    }
                }
            }
        }
    }
});

new Chart(ctxRevenueDistribution, {
    type: 'pie',
    data: revenueDistributionData,
    options: {
        responsive: true,
        plugins: {
            legend: {
                position: 'bottom'
            },
            tooltip: {
                callbacks: {
                    label: function(tooltipItem) {
                        return `₹${tooltipItem.raw.toLocaleString('en-IN')}`;
                    }
                }
            }
        }
    }
});

// Export charts functionality
document.getElementById('exportCharts').addEventListener('click', () => {
    const charts = [ctxMonthlySales, ctxSalesByCategory, ctxRevenueDistribution];
    charts.forEach((ctx, index) => {
        const chart = Chart.getChart(ctx);
        if (chart) {
            const link = document.createElement('a');
            link.href = chart.toBase64Image();
            link.download = `chart-${index + 1}.png`;
            link.click();
        }
    });
});

// Example filter functionality (could be expanded)
document.getElementById('applyFilters').addEventListener('click', () => {
    const startDate = document.getElementById('startDate').value;
    const endDate = document.getElementById('endDate').value;
    // Implement data filtering logic here
    console.log(`Filtering data from ${startDate} to ${endDate}`);
});

document.getElementById('Home').addEventListener('click', () => {
    window.location.href = 'http://192.168.232.18:5500/Html.html'; // Change this URL to the path of your dashboard page
});
