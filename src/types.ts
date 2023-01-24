import { Chart, ChartConfiguration } from 'chart.js';

export type TargetType<T> = {
  target: T;
  insertChart: (where: InsertPosition, options: ChartConfiguration) => Chart;
};

export type FetchData = number[][];
