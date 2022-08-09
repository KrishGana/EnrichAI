import { Component, OnInit, ViewEncapsulation, Pipe, PipeTransform } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer } from '@angular/platform-browser';
import { LoginServiceService } from 'src/app/Services/login-service.service';
import { NgxImgZoomService } from 'ngx-img-zoom';
import { SafePipe } from '../../filter/Safepipe';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { MatTableDataSource } from '@angular/material/table';
// import * as puppeteer from 'puppeteer';

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
}

const ELEMENT_DATA: catalogue[] = [
  {
    Name: 'Water Bottle', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
    CPage: 98, FullText: 'A set screw can be used...'
  },
  {
    Name: 'DC Drive Motor', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
    CPage: 98, FullText: 'A set screw can be used...'
  },
  {
    Name: 'Halogen Lamp', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
    CPage: 98, FullText: 'A set screw can be used...'
  },
  {
    Name: 'Capacitor', Description: 'Socket Set Screw, Cup, 1/8 ', Item: '46t65ff', Commodity: '4767547', Model: '56t65ff',
    CPage: 98, FullText: 'A set screw can be used...'
  }
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
  image: string;
  LinkList = [];
  ImageList = [];
  PriceList = [];
  Url: string;

  constructor(public nav: LoginServiceService, private _snackBar: MatSnackBar, public EnrichService: EnrichServiceService, private domSanitizer: DomSanitizer, private safe: SafePipe) {
    this.nav.islogin(true);
  }

  ngOnInit(): void {
    this.Des = 'Socket Set Screw, Cup, 1/8 in Overall Length, 4-40, 18-8 Stainless  Steel, Plain, PK 100';
    this.Ft = 'A set screw can be used to prevent relational motion of permanently located parts. It is typically used in electronics and for applications where space is a key concern.';
    for (let i = 0; i < 2; i++) {
      const val = new recentmaterials();
      val.Material = 'T-FR-A820-22K-1';
      val.Description = 'ENERGY ABSORBER 44MM WIDE - KARAM MAKE';
      val.ProjectName = 'Bridgestones';
      this.Recents.push(val);
    }
    this.Isloading = false;
  }


  display(e: MouseEvent): void {
    const popupHeight = 320;
    let popupYPosition;

    if (e.clientY + popupHeight > window.innerHeight && (e.pageY - popupHeight) > 0 && (e.pageY - popupHeight) < window.innerHeight) {
      popupYPosition = e.pageY - popupHeight;
      console.log("IF", popupYPosition)
    }
    else {
      popupYPosition = e.pageY;
      console.log("Else", popupYPosition)
    }
    const card = document.getElementById('center') as HTMLDivElement;
    const imag = document.getElementById('image') as HTMLImageElement;
    if (card != null) {
      card.style.display = 'block';
      card.style.zIndex = '1000';
      imag.style.position = 'absolute';
      imag.style.top = popupYPosition + 'px';
      imag.style.left = '20%';
      imag.style.transform = "scale(2)";
      this.image = './assets/images/Component 355.png';
    }

  }

  hide(): void {
    const card = document.getElementById('center') as HTMLDivElement;
    if (card != null) {
      card.style.display = 'none';
    }
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
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

  SearchMaterial(row) {
    this.Isloading = true;
    this.Suggested = [];
    this.WebSearch({ "SearchString": row.Name }).then(
      (data: any) => {
        for (let i = 0; i < data["LinkList"].length; i++) {
          const val = new suggested();
          val.Material = data["LinkList"][i];
          val.Cost = data["PriceList"][i];
          val.Image = data["ImageLinks"][i];
          this.Suggested.push(val);
        }
        this.Url = data["Url"];
        this.Isloading = false;
      }
    ).catch(
      (err: any) => {
        this.Isloading = false;
        this.Suggested = [];
        this.Url = '';
        this._snackBar.open('Something went wrong, Try again', '', {
          duration: 4000,
          panelClass: ['doesnotwork']
        })
      }
    )
  }

  // async SearchMaterial(row) {
  //   const browser = await puppeteer.launch()
  //   const page = await browser.newPage()
  //   await page.goto("https://www.amazon.com")
  //   await page.screenshot({path:"Pictures.png"})
  //   await browser.close()
  // }
}
