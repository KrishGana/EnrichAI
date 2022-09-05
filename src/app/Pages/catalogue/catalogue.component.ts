import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginServiceService } from 'src/app/Services/login-service.service';
import { SafePipe } from '../../filter/Safepipe';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { MatTableDataSource } from '@angular/material/table';
import { Searxuser } from 'searx-api';
import { FormControl, Validators } from '@angular/forms';
import { ExcelService } from 'src/app/Services/excel.service';
import { HttpClient } from '@angular/common/http';
import * as XLSX from 'xlsx';

export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

export class recentmaterials {
  Material: string;
  Description: string;
  ProjectName: string;
}

export class suggested {
  Image: any;
  Material: string;
  Cost: number;
}

export interface catalogue {
  Name: string;
  Description: string;
  Item: string;
  Commodity: string;
  Model: string;
  CPage: number;
  FullText: string;
  Image: string;
}

const ELEMENT_DATA: catalogue[] = [
  // {
  //   Image: './assets/images/catelogue/waterBottle.jpg', Name: 'Water Bottle', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
  //   CPage: 98, FullText: 'A set screw can be used...'
  // },
  // {
  //   Image: 'https://m.media-amazon.com/images/I/51+9dm50prL._SX466_.jpg', Name: 'DC Drive Motor', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
  //   CPage: 98, FullText: 'A set screw can be used...'
  // },
  // {
  //   Image: 'https://m.media-amazon.com/images/I/21RWTKu96SL._AC_UL320_.jpg', Name: 'Halogen Lamp', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
  //   CPage: 98, FullText: 'A set screw can be used...'
  // },
  // {
  //   Image: './assets/images/catelogue/capacitor.jpg', Name: 'Capacitor', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
  //   CPage: 98, FullText: 'A set screw can be used...'
  // },
];


@Component({
  selector: 'app-catalogue',
  templateUrl: './catalogue.component.html',
  styleUrls: ['./catalogue.component.scss'],
  encapsulation: ViewEncapsulation.None,
})

export class CatalogueComponent implements OnInit {

  // Table Details 
  displayedColumns: string[] = ['Image', 'Name', 'Description', 'Item', 'Commodity', 'Model', 'CPage', 'FullText'];
  dataSource = new MatTableDataSource(ELEMENT_DATA);

  // Tooltip Variables
  Des = '';
  Ft = '';

  // Boolean Variables 
  Isloading: Boolean = true;

  // Global Variables
  Recents: recentmaterials[] = [];
  Suggested: suggested[] = [];
  image: string = '';
  LinkList = [];
  ImageList = [];
  PriceList = [];
  Url: string;
  array: any = [];
  items: any = [];
  arrayBuffer: any;

  // FormControls 
  ProjectNameControl = new FormControl();

  constructor(public nav: LoginServiceService, private httpClient: HttpClient, private _snackBar: MatSnackBar, public EnrichService: EnrichServiceService, private domSanitizer: DomSanitizer, private safe: SafePipe, public excelService: ExcelService) {
    this.nav.islogin(true);
  }

  ngOnInit(): void {
    this.EnrichService.GetAllData().subscribe((data) => {
      this.array = data.details;
      for (var i = 0; i < this.array.length; i++) {
        this.items.push({ Name: this.array[i].ProjectName, Value: this.array[i].ProjectName.concat(" : ".toString()).concat(this.array[i].Projectid.toString()) });
      }
      this.ProjectNameControl = new FormControl(this.array[0].ProjectName);
    })
    for (let i = 0; i < 2; i++) {
      const val = new recentmaterials();
      val.Material = 'T-FR-A820-22K-1';
      val.Description = 'ENERGY ABSORBER 44MM WIDE - KARAM MAKE';
      val.ProjectName = 'Bridgestones';
      this.Recents.push(val);
    }
    this.Isloading = false;
    this.excelService.excelCatalogue().then(response => {
      const ExcelData = response;
      this.dataSource = new MatTableDataSource<catalogue>(ExcelData);
    });


  }


  display(e: MouseEvent, ele): void {
    console.log("E ", e)
    const card = document.getElementById('HoverZoom') as HTMLDivElement;
    const imag = document.getElementById('image') as HTMLImageElement;
    if ((e.clientY + e.view.innerHeight / 2) > e.view.innerHeight) {
      var top = e.clientY - e.view.innerHeight / 2 + 'px';
    }
    else {
      var top = e.clientY + 'px';
    }
    var left = e.clientX + 50 + 'px';

    if (card != null) {
      card.style.visibility = 'visible';
      card.style.transition = '0.8s'
      card.style.opacity = '1';
      card.style.top = top;
      card.style.left = left;
      imag.style.visibility = 'visible';
      imag.style.transition = '0.4s'
      imag.style.opacity = '1';
      this.image = ele.Image;
    }
  }

  hide(): void {
    const card = document.getElementById('HoverZoom') as HTMLDivElement;
    const imag = document.getElementById('image') as HTMLImageElement;
    if (card != null) {
      card.style.visibility = 'hidden';
      card.style.opacity = '0';
      imag.style.visibility = 'hidden';
      imag.style.opacity = '0';
    }
  }

  filterItem(event: any) {
    if (!event) { }

    if (typeof event === 'string' && event != "") {
      this.items = [];
      this.items = this.items.filter((a: string) => a["Name"].toLowerCase().startsWith(event.toLowerCase()));
    }
    else {
      this.items = [];
      for (var i = 0; i < this.array.length; i++) {
        this.items.push({ "Name": this.array[i].ProjectName, "Value": this.array[i].ProjectName.concat(" : ".toString()).concat(this.array[i].Projectid.toString()) });
      }
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  GetProjMatrial() {

  }

  WebSearch(searchData: any): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.EnrichService.SearchData(searchData).subscribe(
        (response: any) => {
          resolve(response)
        },
        (err: any) => {
          reject(err)
        });
    })
  }

  // SearchMaterial(row) {
  //   this.Isloading = true;
  //   this.Suggested = [];
  //   this.WebSearch({ "SearchString": row.Name }).then(
  //     (data: any) => {
  //       for (let i = 0; i < data["LinkList"].length; i++) {
  //         const val = new suggested();
  //         val.Material = data["LinkList"][i];
  //         val.Cost = data["PriceList"][i];
  //         val.Image = data["ImageLinks"][i];
  //         this.Suggested.push(val);
  //       }
  //       this.Url = data["Url"];
  //       this.Isloading = false;
  //     }
  //   ).catch(
  //     (err: any) => {
  //       this.Isloading = false;
  //       this.Suggested = [];
  //       this.Url = '';
  //       this._snackBar.open('Something went wrong, Try again', '', {
  //         duration: 4000,
  //         panelClass: ['doesnotwork']
  //       })
  //     }
  //   )
  // }

  SearchMaterial(row) {

  }

}
