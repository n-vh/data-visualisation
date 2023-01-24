import { ChartConfiguration, ChartDataset, ChartOptions } from 'chart.js';
import Chart from 'chart.js/auto';
import { createStore } from './store';
import { TargetType } from './types';

const chartOptions: ChartOptions = {
  animation: {
    duration: 100,
  },
  aspectRatio: 5 / 4,
  elements: {
    line: {
      tension: 0.5,
      borderWidth: 2,
    },
  },
  responsive: true,
  scales: {
    x: {
      offset: true,
    },
    y: {
      type: 'logarithmic',
    },
  },
};

function getTarget<T extends Element>(selector: string): TargetType<T> {
  const target = document.querySelector(selector) as T;
  const canvas = document.createElement('canvas');
  return {
    target,
    insertChart: (where: InsertPosition, options: ChartConfiguration) => {
      target.insertAdjacentElement(where, canvas);
      return new Chart(canvas, options);
    },
  };
}

function insertCrimesChart() {
  const { target, insertChart } = getTarget('#table1');
  const headers = target.querySelectorAll('tbody th');
  const cells = target.querySelectorAll('tbody td');

  const defaultValues = {
    labels: [] as string[],
    datasets: [] as ChartDataset[],
  };

  const store = createStore(defaultValues, ({ update }) => ({
    addYear: (year: string) =>
      update((values) => {
        values.labels.push(year);
        return values;
      }),
    addCountry: (country: string) =>
      update((values) => {
        values.datasets.push({
          label: country,
          data: [],
        });
        return values;
      }),
    addCountryData: (index: number, value: number) =>
      update((values) => {
        values.datasets[index].data.push(value);
        return values;
      }),
  }));

  for (let i = 0; i < headers.length; i++) {
    const header = headers[i].textContent!;

    if (header.length === 4) {
      store.addYear(header);
    }
  }

  let rowIndex = -1;

  for (let i = 0; i < cells.length; i++) {
    const columnIndex = i % 12;
    const cellText = cells[i].textContent!.replace(/\([⁰¹²³⁴⁵⁶⁷⁸⁹]\)/, '');

    if (columnIndex === 0) {
      rowIndex += 1;
      store.addCountry(cellText);
    } else {
      const number = cellText.replace(',', '.');
      store.addCountryData(rowIndex, Number(number));
    }
  }

  const { labels, datasets } = store.get();

  insertChart('beforebegin', {
    type: 'line',
    data: {
      labels,
      datasets,
    },
    options: chartOptions,
  });
}

function insertHomicidesChart() {
  const { target, insertChart } = getTarget('#table2');
  const headers = target.querySelectorAll('thead th');
  const cells = target.querySelectorAll('tbody td');

  const defaultValues = {
    labels: [] as string[],
    datasets: [] as ChartDataset[],
  };

  const store = createStore(defaultValues, (store) => ({
    addYear: (year: string) =>
      store.update((values) => {
        values.datasets.push({
          label: year,
          data: [],
          categoryPercentage: 0.5,
          barThickness: 8,
          minBarLength: 10,
        });
        return values;
      }),
    addCountry: (country: string) =>
      store.update((values) => {
        values.labels.push(country);
        return values;
      }),
    addCountryData: (index: number, value: number) =>
      store.update((values) => {
        values.datasets[index].data.push(value);
        return values;
      }),
  }));

  for (let i = 0; i < headers.length; i++) {
    const headerIndex = i % 4;
    const header = headers[i];

    switch (headerIndex) {
      case 2:
      case 3:
        store.addYear(header.textContent!);
    }
  }

  for (let i = 0; i < cells.length; i++) {
    const columnIndex = i % 3;
    const cell = cells[i];

    switch (columnIndex) {
      case 0:
        store.addCountry(cell.textContent!);
        continue;
      case 1:
      case 2:
        const number = cell.textContent!;
        store.addCountryData(columnIndex - 1, Number(number));
    }
  }

  const { labels, datasets } = store.get();

  insertChart('beforebegin', {
    type: 'bar',
    data: {
      labels,
      datasets,
    },
    options: chartOptions,
  });
}
insertCrimesChart();
insertHomicidesChart();
