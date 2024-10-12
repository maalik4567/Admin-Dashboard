import { Injectable } from '@angular/core';
import { CoffeeService,CoffeeMachineSales } from '../../coffee.service';
import {
  ChartData,
  ChartDataset,
  ChartOptions,
  ChartType,
  PluginOptionsByType,
  ScaleOptions,
  TooltipLabelStyle
} from 'chart.js';
import { DeepPartial } from 'chart.js/dist/types/utils';
import { getStyle, hexToRgba } from '@coreui/utils';

export interface IChartProps {
  data?: ChartData;
  labels?: any;
  options?: ChartOptions;
  colors?: any;
  type: ChartType;
  legend?: any;

  [propName: string]: any;
}

@Injectable({
  providedIn: 'any'
})
export class DashboardChartsData {
  constructor(private coffeeService: CoffeeService) {
    this.initMainChart();
  }

  public mainChart: IChartProps = { type: 'line' };

  public random(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  initMainChart(period: string = 'Month') {
    const brandSuccess = getStyle('--cui-success') ?? '#4dbd74';
    const brandInfo = getStyle('--cui-info') ?? '#20a8d8';
    const brandInfoBg = hexToRgba(getStyle('--cui-info') ?? '#20a8d8', 10);
    const brandDanger = getStyle('--cui-danger') ?? '#f86c6b';
    
    this.coffeeService.getAllData().subscribe((data: CoffeeMachineSales[]) => {
      // Process the data to create the chart
      const labels: string[] = data.map(item => item.MonthName);
      const data1: number[] = data.map(item => item.StandardSales);
      const data2: number[] = data.map(item => item.PremiumSales);
  
      // mainChart
      this.mainChart['elements'] = labels.length;
      this.mainChart['Data1'] = data1;
      this.mainChart['Data2'] = data2;
      this.mainChart['Data3'] = Array(labels.length).fill(65);
  
      const colors = [
        {
          // brandInfo
          backgroundColor: brandInfoBg,
          borderColor: brandInfo,
          pointHoverBackgroundColor: brandInfo,
          borderWidth: 2,
          fill: true
        },
        {
          // brandSuccess
          backgroundColor: 'transparent',
          borderColor: brandSuccess || '#4dbd74',
          pointHoverBackgroundColor: '#fff'
        },
        {
          // brandDanger
          backgroundColor: 'transparent',
          borderColor: brandDanger || '#f86c6b',
          pointHoverBackgroundColor: brandDanger,
          borderWidth: 1,
          borderDash: [8, 5]
        }
      ];
  
      const datasets: ChartDataset[] = [
        {
          data: this.mainChart['Data1'],
          label: 'Standard Sales',
          ...colors[0]
        },
        {
          data: this.mainChart['Data2'],
          label: 'Premium Sales',
          ...colors[1]
        },
        {
          data: this.mainChart['Data3'],
          label: 'BEP',
          ...colors[2]
        }
      ];
  
      const plugins: DeepPartial<PluginOptionsByType<any>> = {
        legend: {
          display: true
        },
        tooltip: {
          callbacks: {
            labelColor: (context) => ({ backgroundColor: context.dataset.borderColor } as TooltipLabelStyle)
          }
        }
      };
  
      const scales = this.getScales();
  
      const options: ChartOptions = {
        maintainAspectRatio: false,
        plugins,
        scales,
        elements: {
          line: {
            tension: 0.4
          },
          point: {
            radius: 0,
            hitRadius: 10,
            hoverRadius: 4,
            hoverBorderWidth: 3
          }
        }
      };
  
      this.mainChart.type = 'line';
      this.mainChart.options = options;
      this.mainChart.data = {
        datasets,
        labels
      };
    });
  }

  getScales() {
    const colorBorderTranslucent = getStyle('--cui-border-color-translucent');
    const colorBody = getStyle('--cui-body-color');

    const scales: ScaleOptions<any> = {
      x: {
        grid: {
          color: colorBorderTranslucent,
          drawOnChartArea: false
        },
        ticks: {
          color: colorBody
        }
      },
      y: {
        border: {
          color: colorBorderTranslucent
        },
        grid: {
          color: colorBorderTranslucent
        },
        max: 250,
        beginAtZero: true,
        ticks: {
          color: colorBody,
          maxTicksLimit: 5,
          stepSize: Math.ceil(250 / 5)
        }
      }
    };
    return scales;
  }
}