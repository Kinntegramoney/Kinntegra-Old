import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgbModule, NgbDropdownModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { AppStorageService } from '../../services/app-storage.service';
import { HeaderRightTemplateComponent } from '../../templates/header-right-template/header-right-template.component';
import { Router } from '@angular/router';
import { AppGlobalService } from '../../services/app-global.service';
import { NotificationService } from '../../services/notification.service';
import { DashboardService } from '../../services/dashboard.service';
import { Chart, LinearScale, CategoryScale, BarController, BarElement, Title } from 'chart.js';
import { VennDiagramController, ArcSlice, extractSets } from 'chartjs-chart-venn';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [FormsModule, CommonModule, NgSelectModule, NgbModule, NgbDropdownModule,
    HeaderRightTemplateComponent, HttpClientModule],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
  providers: [
    AppStorageService, DashboardService
  ]
})
export class DashboardComponent {
  associateId: any;
  userDisplayName: string = '';
  userInitial: string = '';
  clientCount: any = [];

  constructor(
    private router: Router,
    private appStorageService: AppStorageService,
    private notificationService: NotificationService,
    private dashboardService: DashboardService,
  ) {
  }

  ngOnInit() {
    this.associateId = AppGlobalService.CurrentAssociate;
    this.userDisplayName = AppGlobalService.CurrentUserDisplayName;
    if (this.userDisplayName != null && this.userDisplayName != '' && this.userDisplayName != undefined) {
      this.userInitial = this.userDisplayName.charAt(0);
    }

    Chart.register(VennDiagramController, ArcSlice, LinearScale, CategoryScale, BarController, BarElement, Title);

    this.getClientCount();
    this.getClientChartData();
  }

  getClientCount() {
    this.dashboardService.GetClientCountData().subscribe((result) => {
      if (result.Status) {
        this.clientCount = result.Data;
      }
    });
  }

  getClientChartData() {
    this.dashboardService.GetClientChartDataCount().subscribe((result) => {
      var dataSet = [
        { sets: ['Introduction'], value: 0 },
        { sets: ['Comprehensive Analysis'], value: 0 },
        { sets: ['Account Opening'], value: 0 },
        { sets: ['Introduction', 'Comprehensive Analysis'], value: 0 },
        { sets: ['Introduction', 'Account Opening'], value: 0 },
        { sets: ['Comprehensive Analysis', 'Account Opening'], value: 0 },
        { sets: ['Introduction', 'Comprehensive Analysis', 'Account Opening'], value: 0 }
      ];

      if (result.Status) {
        var dataList = result.Data;

        dataSet = [];

        for (let i = 0; i < dataList.length; i++) {
          var item = dataList[i];

          switch (item.DataCode) {
            case 'I':
              dataSet.push({ sets: ['Introduction'], value: item.DataValue });
              break;
            case 'C':
              dataSet.push({ sets: ['Comprehensive Analysis'], value: item.DataValue });
              break;
            case 'A':
              dataSet.push({ sets: ['Account Opening'], value: item.DataValue });
              break;
            case 'IC':
              dataSet.push({ sets: ['Introduction', 'Comprehensive Analysis'], value: item.DataValue });
              break;
            case 'IA':
              dataSet.push({ sets: ['Introduction', 'Account Opening'], value: item.DataValue });
              break;
            case 'CA':
              dataSet.push({ sets: ['Comprehensive Analysis', 'Account Opening'], value: item.DataValue });
              break;
            case 'ICA':
              dataSet.push({ sets: ['Introduction', 'Comprehensive Analysis', 'Account Opening'], value: item.DataValue });
              break;
          }
        }
      }

      const data = {
        labels: [
          'Introduction',
          'Comprehensive',
          'Account Opening',
          'Introduction ~ Comprehensive Analysis',
          'Introduction ~ Account Opening',
          'Comprehensive Analysis ~ Account Opening',
          'Introduction ~ Comprehensive Analysis ~ Account Opening',
        ],
        datasets: [
          {
            label: 'Clients',
            data: dataSet,
            backgroundColor: [
              '#548989',
              '#28a7c7',
              '#edcda6',
              '#4dafc0',
              '#8dcac8',
              '#b1bea5',
              '#87c0be'
            ],
            borderColor: '#ffffff'
          },
        ],
      };

      var vennChartClient = document.getElementById('vennChartClient') as HTMLCanvasElement;
      if (vennChartClient != null) {
        const ctx = vennChartClient.getContext('2d');

        if (ctx) {
          const chart = new Chart(ctx, {
            type: 'venn',
            data: data,
            options: {
              plugins: {
                title: {
                  display: false,
                  text: '',
                },
                legend: {
                  display: false,
                  // fontsize: 1
                },
                // tooltip: { enabled: true },
              },
              layout: {
                padding: {
                  left: 0,
                  right: 0,
                  top: 0,
                  bottom: 0
                }
              }
            },
          });
        }
      }
    });
  }
}
