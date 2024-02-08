const primary = localStorage.getItem('primary_color') || '#4466f2';
const secondary = localStorage.getItem('secondary_color') || '#1ea6ec';

// Sale chart
export let saleChartType = 'line';
export let saleChartLabels: Array<any> = [
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015'
];
export let saleChartData: Array<any> = [0, 2.25, 1.25, 3, 1.25, 2.25, 0];
export let saleChartOptions: any = {
  responsive: true,
  animation: false,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: '#fff',
          drawTicks: true
        }
      }
    ],
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};
export let saleChartColors: Array<any> = [
  {
    fill: false,
    borderColor: primary,
    borderWidth: 2.5,
    pointBackgroundColor: primary,
    pointBorderColor: primary
  }
];
export let saleChartLegend = false;

// Line chart
export let lineChartType1 = 'line';
export let lineChartLabels1: Array<any> = [
  '',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014'
];
export let lineChartData1: Array<any> = [20, 33, 20, 50, 20, 33, 20, 0];
export let lineChartOptions1: any = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: '#fff',
          drawTicks: true
        }
      }
    ],
    yAxes: [
      {
        display: true
      }
    ]
  }
};
export let lineChartColors1: Array<any> = [
  {
    fill: false,
    borderColor: primary,
    borderWidth: 2.5,
    pointBackgroundColor: primary,
    pointBorderColor: primary,
    lineTension: 0
  }
];
export let lineChartLegend1 = false;

// Line chart 2
export let lineChartType2 = 'line';
export let lineChartLabels2: Array<any> = [
  '',
  '2009',
  '2010',
  '2011',
  '2012',
  '2013',
  '2014',
  '2015',
  '2016'
];
export let lineChartData2: Array<any> = [5, 0, 5, 0, 15, 0, 5, 0, 5];
export let lineChartOptions2: any = {
  responsive: true,
  maintainAspectRatio: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: '#fff',
          drawTicks: true
        }
      }
    ],
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true,
          fixedStepSize: 5,
          precision: 0
        }
      }
    ]
  }
};
export let lineChartColors2: Array<any> = [
  {
    fill: false,
    borderColor: primary,
    borderWidth: 2.5,
    pointBackgroundColor: primary,
    pointBordereWidth: 5,
    pointBorderColor: primary,
    lineTension: 0
  }
];
export let lineChartLegend2 = false;

export let staticChartType = 'line';
export let staticChartLabels: Array<any> = [
  '0',
  '50',
  '100',
  '150',
  '200',
  '250',
  '300',
  '350'
];
export let staticChartData: Array<any> = [
  1.0,
  0.64278761,
  -0.173648178,
  -0.866025404,
  -0.939692621,
  -0.342020143,
  0.5,
  0.984807753
];
export let staticChartOptions: any = {
  responsive: true,
  scaleShowVerticalLines: false,
  maintainAspectRatio: false,
  animation: false,
  scales: {
    xAxes: [
      {
        display: true,
        gridLines: {
          color: '#fff',
          drawTicks: true
        }
      }
    ],
    yAxes: [
      {
        display: true,
        ticks: {
          beginAtZero: true
        }
      }
    ]
  }
};
export let staticChartColors: Array<any> = [
  {
    fill: false,
    borderColor: primary,
    borderWidth: 2.5,
    pointBackgroundColor: primary,
    pointBorderColor: primary
  }
];
export let staticChartLegend = false;
