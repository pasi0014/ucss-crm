export const lineChartDataTotalSpent = [
    {
        name: 'Donations',
        data: [50, 64, 48, 66, 49, 68]
    },
];

export const lineChartOptionsTotalSpent: any = {
    chart: {
        toolbar: {
            show: false
        },
        dropShadow: {
            enabled: true,
            top: 13,
            left: 0,
            blur: 10,
            opacity: 0.1,
            color: '#4318FF'
        }
    },
    colors: ['#4318FF', '#39B8FF'],
    markers: {
        size: 1,
        colors: 'white',
        strokeColors: '#7551FF',
        strokeWidth: 3,
        strokeOpacity: 0.9,
        strokeDashArray: 0,
        fillOpacity: 1,
        discrete: [],
        shape: 'circle',
        radius: 2,
        offsetX: 0,
        offsetY: 0,
        showNullDataPoints: true
    },
    tooltip: {
        theme: 'dark'
    },
    dataLabels: {
        enabled: false
    },
    stroke: {
        curve: 'smooth',
        type: 'line'
    },
    xaxis: {
        type: 'numeric',
        categories: ['SEP', 'OCT', 'NOV', 'DEC', 'JAN', 'FEB'],
        labels: {
            style: {
                colors: '#A3AED0',
                fontSize: '12px',
                fontWeight: '500'
            }
        },
        axisBorder: {
            show: false
        },
        axisTicks: {
            show: false
        }
    },
    yaxis: {
        show: true,
        theme: 'dark',
        colors: 'white',
        labels: {
            style: {
                colors: '#A3AED0',
                fontSize: '12px',
                fontWeight: '500'
            }
        },
    },
    legend: {
        show: false
    },
    grid: {
        show: false,
        column: {
            color: ['#7551FF', '#39B8FF'],
            opacity: 0.5
        }
    },
    color: ['#7551FF', '#39B8FF']
};
