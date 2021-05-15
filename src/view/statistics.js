import SmartView from './smart.js';
import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {formatDuration} from '../utils/date.js';
import {BAR_HEIGHT, getTypesUnique, getMoneySpend, getTypesCount, getTimeSpend} from '../utils/statistics.js';
import {ChartName} from '../utils/const.js';

const renderChart = (nameCtx, titles, data, types, dataFormat) => {
  return new Chart(nameCtx, {
    plugins: [ChartDataLabels],
    type: 'horizontalBar',
    data: {
      labels: types,
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
    this._typesUnique = getTypesUnique(this._points).slice();
    this._moneySpend = getMoneySpend(this._points, this._typesUnique);
    this._typesCount = getTypesCount(this._points, this._typesUnique);
    this._timeSpend = getTimeSpend(this._points, this._typesUnique);

    this._moneySpendChart = null;
    this._typeCountChart = null;
    this._timeSpendChart = null;

    this.renderCharts();
  }

  getTemplate() {
    return createStatisticsTemplate();
  }

  renderCharts() {
    this._resetCharts();

    const moneyCtx = this.getElement().querySelector('.statistics__chart--money');
    const typeCtx = this.getElement().querySelector('.statistics__chart--type');
    const timeSpendCtx = this.getElement().querySelector('.statistics__chart--time-spend');

    moneyCtx.height = BAR_HEIGHT * this._typesUnique.length;
    typeCtx.height = BAR_HEIGHT * this._typesUnique.length;
    timeSpendCtx.height = BAR_HEIGHT * this._typesUnique.length;

    const moneySpendSorted = this._moneySpend.map((moneySpend) => moneySpend.moneySpend);
    const typesByMoneySpend = this._moneySpend.map((moneySpend) => moneySpend.type);
    this._moneySpendChart = renderChart(moneyCtx, ChartName.MONEY.toUpperCase(), moneySpendSorted, typesByMoneySpend, ((val) => `€ ${val}`));

    const typesCountSorted = this._typesCount.map((typesCount) => typesCount.typesCount);
    const typesByTypesCount = this._typesCount.map((typesCount) => typesCount.type);
    this._typeCountChart = renderChart(typeCtx, ChartName.TYPE.toUpperCase(), typesCountSorted, typesByTypesCount, ((val) => `${val}x`));

    const timeSpendSorted = this._timeSpend.map((timeSpend) => timeSpend.timeSpend);
    const typesByTimeSpend = this._timeSpend.map((timeSpend) => timeSpend.type);
    this._timeSpendChart = renderChart(timeSpendCtx, ChartName.TIMESPEND.toUpperCase(), timeSpendSorted, typesByTimeSpend, ((val) => `${formatDuration(val)}`));
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
