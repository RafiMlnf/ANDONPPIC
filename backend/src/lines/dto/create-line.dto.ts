export class CreateLineDto {
  code: string;
  name?: string;
  area?: string;
  metricLabel: string;
  value: string;
  change: string;
  subMetricLabel: string;
  subMetricValue: string;
  status: 'RED' | 'YELLOW' | 'GREEN';
  order?: number;
}
