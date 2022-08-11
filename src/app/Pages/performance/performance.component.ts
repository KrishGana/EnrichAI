import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { LoginServiceService } from 'src/app/Services/login-service.service';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import {
  ApexAxisChartSeries,
  ApexChart,
  ChartComponent,
  ApexDataLabels,
  ApexXAxis,
  ApexPlotOptions,
  ApexNonAxisChartSeries,
  ApexResponsive,
  ApexLegend,
  ApexYAxis,
  ApexGrid,
  ApexFill,
} from "ng-apexcharts";
import { FormControl } from '@angular/forms';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { LibraryComponent } from '../library/library.component';
import { StopwordsComponent } from '../stopwords/stopwords.component';
import { element } from 'protractor';
import { Router } from '@angular/router';
import { data_enrich1 } from 'src/app/Models/project-model';
import { MatTableDataSource } from '@angular/material/table';

export type ChartOptions = {
  series: ApexAxisChartSeries;
  chart: ApexChart;
  dataLabels: ApexDataLabels;
  plotOptions: ApexPlotOptions;
  xaxis: ApexXAxis;
  yaxis: ApexYAxis | ApexYAxis[];
  grid: ApexGrid;
  colors: string[];
  fill: ApexFill;
  responsive: ApexResponsive[];
};

export type DounutchartOptions = {
  series: ApexNonAxisChartSeries;
  chart: ApexChart;
  responsive: ApexResponsive[];
  plotOptions: ApexPlotOptions;
  dataLabels: ApexDataLabels;
  labels: any;
  legend: ApexLegend;
  colors: string[];
};

export class details {
  open: string
  validate: string
  completed: string
  rejected: string
}

export class matgroupsmatch {
  MName: string
  MGroup: string
}

const ELEMENT_DATA: details[] = [];

@Component({
  selector: 'app-performance',
  templateUrl: './performance.component.html',
  styleUrls: ['./performance.component.scss'],
  encapsulation: ViewEncapsulation.None
})

export class PerformanceComponent implements OnInit {
  @ViewChild("chart") chart: ChartComponent;
  public ChartOptions: Partial<ChartOptions>;
  @ViewChild("charts") charts: ChartComponent;
  public DounutchartOptions: Partial<DounutchartOptions>;

  projectname = new FormControl()
  Isloading = true;
  isclicked = false;

  // Global Variables
  ProjectsArray: data_enrich1[] = [];
  items = [];
  name: string;
  MaterialTypes: string[] = [];
  MaterialGroups: string[] = [];
  ListofUsed: details[] = [];
  barchrt = [0, 0, 0, 0];
  dounutchrt = [0, 0, 0, 0];
  AllDetails = [];
  OArr = [];
  VArr = [];
  CArr = [];
  RArr = [];

  // Form Controls 
  MType = new FormControl()
  MGroup = new FormControl()

  // Table Variables
  displayedColumns: string[] = ['Open', 'Validated', 'Completed', 'Rejected'];

  constructor(public nav: LoginServiceService, public dialog: MatDialog, private service: EnrichServiceService, private router: Router) {
    this.nav.islogin(true);
  }

  ngOnInit(): void {
    this.getProject().then(result => {
      this.ProjectsArray = result.details;
      this.ProjectsArray.forEach(element => {
        this.items.push({ "Name": element.ProjectName, "Value": element.ProjectName.concat(" : ".toString()).concat(element.Projectid.toString()) })
      });
      if (this.ProjectsArray.length > 0) {
        this.name = this.ProjectsArray[0].ProjectName;
        this.projectname.setValue(this.name);
      }
      this.selectproject(this.name)
    })
  }

  getProject(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.service.GetAllData().subscribe(
        (response: any) => {
          resolve(response);
        },
        (err: any) => {
          reject(err)
        });
    })
  }

  getRequiredDetails(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.service.GetRequiredProjectDetails(this.name).subscribe(
        (response: any) => {
          resolve(response);
        },
        (err: any) => {
          reject(err);
        }
      )
    })
  }

  filterItem(event: any) {
    console.log(event);
    if (!event) {
      this.items = [];
      this.ProjectsArray.forEach(element => {
        this.items.push({ "Name": element.ProjectName, "Value": element.ProjectName.concat(" : ".toString()).concat(element.Projectid.toString()) })
      });
    }

    if (typeof event === 'string' && event != "") {
      this.items = [];
      this.items = this.items.filter((a: string) => a["Name"].toLowerCase().startsWith(event.toLowerCase()));
    }
    else {
      this.items = [];
      this.ProjectsArray.forEach(element => {
        this.items.push({ "Name": element.ProjectName, "Value": element.ProjectName.concat(" : ".toString()).concat(element.Projectid.toString()) })
      });
    }

  }

  selectproject(name: string) {
    this.name = name;
    this.barchrt = [0, 0, 0, 0];
    this.Isloading = true;
    if (this.name != undefined) {
      this.getRequiredDetails().then(data => {
        this.AllDetails = data;
        for (let index = 0; index < data.length; index++) {
          data[index].MatGroup != "" && !this.MaterialGroups.includes(data[index].MatGroup) ? this.MaterialGroups.push(data[index].MatGroup) : {};
          data[index].MatType != "" && !this.MaterialTypes.includes(data[index].MatType) ? this.MaterialTypes.push(data[index].MatType) : {};
          data[index].Status == 20 || data[index].Status == 30 ? this.barchrt[0]++ : {};
          data[index].Status == 40 ? this.barchrt[1]++ : {};
          data[index].Status == 50 ? this.barchrt[2]++ : {};
          data[index].Status == 60 ? this.barchrt[3]++ : {};
        }
        this.MType.setValue(this.MaterialTypes[0])
        this.MGroup.setValue(this.MaterialGroups[0])
        !this.MaterialGroups.includes('Others') ? this.MaterialGroups.push('Others') : {};
        this.AssignBarChart();
        this.donutchart();
        this.FindMaterialByGroup();
        this.items = [];
        this.ProjectsArray.forEach(element => {
          this.items.push({ "Name": element.ProjectName, "Value": element.ProjectName.concat(" : ".toString()).concat(element.Projectid.toString()) })
        });
        this.Isloading = false;
      })
    }
  }

  gotoproject() {
    console.log("pas",this.projectname.value)
    this.router.navigate(['de'], { queryParams: { passingdata: this.projectname.value } });
  }

  AssignBarChart() {
    this.ChartOptions = {
      series: [
        {
          name: "Status Count",
          data: this.barchrt
        }
      ],
      chart: {
        type: "bar",
        height: 165,
        width: 800,
        toolbar: {
          show: false
        }
      },
      plotOptions: {
        bar: {
          horizontal: true,
          barHeight: '50%',
          borderRadius: 6,
          distributed: true,
        }
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: [
          "OPEN",
          "VALIDATE",
          "COMPLETED",
          "REJECTED",
        ],
        axisBorder: { show: false },
      },
      yaxis: {
        labels: {
          style: {
            fontSize: '12px',
            fontFamily: "poppins",
            colors: '#1e3e67',
          }
        },
      },
      grid: {
        yaxis: {
          lines: {
            show: false
          }
        },
      },
      responsive: [
        {
          breakpoint: 1100,
          options: {
            chart: {
              height: 165,
              width: 500,
              toolbar: {
                show: false
              }
            },
            plotOptions: {
              bar: {
                horizontal: true,
                barHeight: '50%',
                borderRadius: 6,
              }
            },
          }
        }
      ],
      colors: ["#2085fb", "#3030fb", "#61fd9f", "#ff9393"],

    };
  }

  AssignDounutChart() {
    this.DounutchartOptions = {
      series: this.dounutchrt,
      chart: {
        type: "donut",
        width: 200,
        height: 170
      },
      labels: ["Open", "Validate", "Completed", "Rejected"],
      plotOptions: {
        pie: {
          donut: {
            size: "60%",
            labels: {
              show: true,
              name: {
                show: true,
                fontSize: '18px',
                formatter: function (val) {
                  return val
                },
                color: '#000000',
              },
              value: {
                show: true,
                fontSize: '16px',
                fontWeight: 400,
                formatter: function (val) {
                  // var tot = this.dounutchrt[0]+this.dounutchrt[1]+this.dounutchrt[2]+this.dounutchrt[3];
                  return val
                }
              },
              total: {
                show: true,
                formatter: function (w) {
                  return w.globals.seriesTotals.reduce((a, b) => {
                    return a + b
                  }, 0)
                }
              }
            }
          },
          dataLabels: {
            offset: 20,
          },
          customScale: 0.8
        }
      },
      responsive: [
        {
          breakpoint: 1100,
          options: {
            chart: {
              width: 100,
            },
            legend: {
              position: "bottom"
            }
          }
        }
      ],
      legend: {
        show: false
      },
      dataLabels: {
        style: {
          colors: ['#ffffff'],
          fontSize: '14px',
          fontWeight: 'bold',
          // colors: ['#2085fb', '#3030fb', '#61fd9f', '#ff9393']
        },
        dropShadow: {
          enabled: false
        },
        background: {
          enabled: true,
          foreColor: '#000000',
          padding: 4,
          borderRadius: 2,
          borderWidth: 1,
          borderColor: '#fff',
        }
      },
      colors: ['#2085fb', '#3030fb', '#61fd9f', '#ff9393']
    };
  }

  donutchart() {
    this.dounutchrt = [0, 0, 0, 0];
    for (let indx = 0; indx < this.AllDetails.length; indx++) {
      (this.AllDetails[indx].Status == 20 || this.AllDetails[indx].Status == 30) && this.AllDetails[indx].MatType === this.MType.value ? this.dounutchrt[0]++ : {};
      this.AllDetails[indx].Status == 40 && this.AllDetails[indx].MatType === this.MType.value ? this.dounutchrt[1]++ : {};
      this.AllDetails[indx].Status == 50 && this.AllDetails[indx].MatType === this.MType.value ? this.dounutchrt[2]++ : {};
      this.AllDetails[indx].Status == 60 && this.AllDetails[indx].MatType === this.MType.value ? this.dounutchrt[3]++ : {};
    }
    this.AssignDounutChart();
  }

  openDialog(checkstr: string): void {
    if (checkstr === 'Library') {
      const dialogRef = this.dialog.open(LibraryComponent, {
        height: '63%',
        width: '60%',
        disableClose: true,
        autoFocus: true,
        panelClass:'custom-stopwordsLibrary'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }
    if (checkstr === 'Stopwords') {
      const dialogRef = this.dialog.open(StopwordsComponent, {
        height: '68%',
        width: '60%',
        disableClose: true,
        autoFocus: true,
        panelClass:'custom-stopwordsLibrary'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }

  }

  FindMaterialByGroup() {
    this.OArr = [];
    this.VArr = [];
    this.CArr = [];
    this.RArr = [];
    for (let ind = 0; ind < this.AllDetails.length; ind++) {
      (this.AllDetails[ind].Status == 20 || this.AllDetails[ind].Status == 30) && this.MGroup.value === this.AllDetails[ind].MatGroup ? this.OArr.push(this.AllDetails[ind].Material) : {};
      this.AllDetails[ind].Status == 40 && this.MGroup.value === this.AllDetails[ind].MatGroup ? this.VArr.push(this.AllDetails[ind].Material) : {};
      this.AllDetails[ind].Status == 50 && this.MGroup.value === this.AllDetails[ind].MatGroup ? this.CArr.push(this.AllDetails[ind].Material) : {};
      this.AllDetails[ind].Status == 60 && this.MGroup.value === this.AllDetails[ind].MatGroup ? this.RArr.push(this.AllDetails[ind].Material) : {};
    }
  }
}
