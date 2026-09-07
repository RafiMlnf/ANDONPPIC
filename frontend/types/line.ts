export type StatusColor = 'RED' | 'YELLOW' | 'GREEN' | 'GRAY';

export interface LineCardData {
  id: string;
  code: string;
  name?: string;
  area?: string;
  metricLabel: string;
  value: string;
  change: string;
  subMetricLabel: string;
  subMetricValue: string;
  status: StatusColor;
  order: number;
}

export interface SystemOverviewData {
  title: string;
  subtitle: string;
  dashboardName: string;
  shift: string;
  overallQuality: {
    label: string;
    changePercent: string;
    changeAbsolute: string;
    trend: 'up' | 'down';
  };
  metrics: {
    totalLines?: string;
    totalProducedParts?: string;
    overallAchievement?: string;
  };
}
