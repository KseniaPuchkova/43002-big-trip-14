import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatDuration} from '../utils/date.js';
import {BAR_HEIGHT, getTypesUnique, getSpentMoney, getSpentTime, getCountTypes} from '../utils/statistics.js';
import {ChartName} from '../utils/const.js';

const renderChart = (nameOfCtx, titles, data, typesUnique, dataFormat) => {
  return new Chart(nameOfCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: typesUnique,
      datasets: [{
        data: data,
        backgroundColor: '#ffffff',
        hoverBackgroundColor: '#ffffff',
        anchor: 'start',
      }],
    },
    options: {
      plugins: {
        datalabels: {
          font: {
            size: 13,
          },
          color: '#000000',
          anchor: 'end',
          align: 'start',
          formatter: dataFormat,
        },
      },
      title: {
        display: true,
        text: titles,
        fontColor: '#00000',
        fontSize: 23,
        position: 'left',
      },
      scales: {
        yAxes: [{
          ticks: {
            fontColor: '#000000',
            padding: 5,
            fontSize: 13,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          barThickness: 44,
        }],
        xAxes: [{
          ticks: {
            display: false,
            beginAtZero: true,
          },
          gridLines: {
            display: false,
            drawBorder: false,
          },
          minBarLength: 50,
        }],
      },
      legend: {
        display: false,
      },
      tooltips: {
        enabled: false,
      },
    },
  });
};

const createChartNamesTemplate = (name) => {
  return (
    `<div class="statistics__item statistics__item--${name}">
      <canvas class="statistics__chart  statistics__chart--${name}" width="900"></canvas>
    </div>`
  );
};

const createStatisticsTemplate = () => {
  const chartNamesList = Object.values(ChartName).map((chartName) => createChartNamesTemplate(chartName)).join('');

  return (
    `<section class="statistics">
     <h2 class="visually-hidden">Trip statistics</h2>
       ${chartNamesList}
     </section>`
  );
};

export default class Statistics extends SmartView {
  constructor(points) {
    super();
    this._points = points;
    this._typesUnique = null;
    this._timeSpendChart = null;
    this._moneyChart = null;
    this._transportChart = null;

    this.renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  renderCharts() {
    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--transport');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time-spend');

    this._typesUnique = getTypesUnique(this._points);

    moneyCtx.height = BAR_HEIGHT * this._typesUnique.length;
    typeCtx.height = BAR_HEIGHT * this._typesUnique.length;
    timeSpendCtx.height = BAR_HEIGHT * this._typesUnique.length;

    const spentMoney = getSpentMoney(this._points, this._typesUnique);
    const spentTime = getSpentTime(this._points, this._typesUnique);
    const countTypes = getCountTypes(this._points, this._typesUnique);

    this._resetCharts();

    this._moneyChart = renderChart(moneyCtx, 'MONEY', spentMoney, this._typesUnique, ((val) => `€ ${val}`));
    this._typeChart = renderChart(typeCtx, 'TYPE', countTypes, this._typesUnique, ((val) => `${val}x`));
    this._timeSpendChart = renderChart(timeSpendCtx, 'TIME-SPEND', spentTime, this._typesUnique, ((val) => `${formatDuration(val)}`));
  }

  removeElement() {
    super.removeElement();
  }

  _restoreHandlers() {
    this.renderCharts();
  }

  _resetCharts() {
    if (this._timeSpendChart || this._moneyChart || this._typeChart) {
      this._timeSpendChart = null;
      this._moneyChart = null;
      this._typeChart = null;
    }
  }
}
