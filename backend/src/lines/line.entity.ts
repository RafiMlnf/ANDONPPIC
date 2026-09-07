export type LineStatus = 'RED' | 'YELLOW' | 'GREEN';

export class LineCard {
  id: string;
  code: string;
  name?: string;
  area?: string;
  metricLabel: string;
  value: string;
  change: string;
  subMetricLabel: string;
  subMetricValue: string;
  status: LineStatus;
  order: number;
}
