import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { SelectionModel } from '@angular/cdk/collections';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { AfterViewInit, ViewChild } from '@angular/core';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { Noun } from 'src/app/Models/project-model';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LoginServiceService } from 'src/app/Services/login-service.service';
import { FormControl } from '@angular/forms';
import { element } from 'protractor';

export interface Nounmodifier {
  nounmodifier: string;
  noun: string;
  modifier: string;
  codenm: string;
}
export interface Attributes {
  Attribute: string;
  Type: string;
  AttrId: number;
}


@Component({
  selector: 'app-noun-modifier',
  templateUrl: './noun-modifier.component.html',
  styleUrls: ['./noun-modifier.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class NounModifierComponent implements OnInit {
  @ViewChild(MatPaginator) paginator: MatPaginator;

  // Boolean Variables 
  Isloading = true;
  IsSelected: boolean = false;

  // Table Variables
  dataSource = new MatTableDataSource<Nounmodifier>();
  selection = new SelectionModel<Nounmodifier>(false, []);
  displayedColumns: string[] = ['radiobutton', 'nounmodifier', 'noun', 'modifier', 'editable'];

  dataSourceatt = new MatTableDataSource<Attributes>();
  displayedColumns_att: string[] = ['attributes', 'values', 'add'];


  // Number Variables 
  editRow: number = -1;
  NewNMCount: number = 0;

  // Other Variables 
  NounModifier: string;
  NounVal: string;
  ModifierVal: string;
  Reference: any;


  constructor(private noundataservice: EnrichServiceService, private _snackBar: MatSnackBar, public nav: LoginServiceService) {
    this.nav.islogin(true);
  }

  ngOnInit(): void {
    this.GetAllDatas().then(data => {
      console.log("data : ", data)
      this.dataSource = new MatTableDataSource(data);
      const cls = new Noun()
      cls.CodeNM = data[0].codenm;
      this.GetAttributesDatas(cls).then(data => {
        console.log("att", data)
        this.dataSourceatt = new MatTableDataSource(data);
        this.Isloading = false;
      })
    });

  }

  GetAllDatas(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.noundataservice.GetAllData1().subscribe(
        (response: any) => {
          console.log("Length", response.length)
          resolve(response);
        },
        (err: any) => {
          reject(err);
        })
    })
  }

  GetAttributesDatas(cls): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.noundataservice.GetAttributesData(cls).subscribe(
        (response: any) => {
          resolve(response);
        },
        (err: any) => {
          reject(err);
        })
    })
  }

  UpdateDatas(dat): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.noundataservice.UpdateNoun(JSON.stringify(dat)).subscribe(
        (response: any) => {
          if (dat != undefined) {
            resolve(response)
          }
        },
        (err: any) => {
          reject(err);
        })
    })
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();
    console.log("fil", this.dataSource)
  }

  splitData(text: string) {
    return text.split(',');
  }

  spaceNM(text: string) {
    let newLst = [];
    text.split(',').forEach(element => {
      newLst.push(element.trim())
    });
    return newLst.join(', ')
  }

  Addnew() {
    this.dataSource.data.unshift({
      nounmodifier: '',
      noun: '',
      modifier: '',
      codenm: '',
    });
    this.dataSource.filter = '';
    this.selection.toggle(this.dataSource.data[0]);
    this.dataSourceatt = new MatTableDataSource();
    this.editRow = 0;
    this.NewNMCount++;
  }

  Addreference() {
    this.dataSource.data.unshift({
      nounmodifier: this.Reference.nounmodifier,
      noun: this.Reference.noun,
      modifier: this.Reference.modifier,
      codenm: this.Reference.codenm,
    });
    this.dataSource.filter = '';
    this.selection.toggle(this.dataSource.data[0]);
    const cls = new Noun()
    cls.CodeNM = this.Reference.codenm;
    this.GetAttributesDatas(cls).then(data => {
      this.dataSourceatt = new MatTableDataSource(data);
    })
    this.editRow = 0;
    this.NewNMCount++
  }

  save() {
    if (this.NewNMCount > 0) {
      this.Isloading = true;
      for (let i = 0; i < this.NewNMCount; i++) {
        const dat = new Noun();
        dat.CodeNM = '';
        dat.NounModifier = this.dataSource.data[i].nounmodifier;
        dat.Noun = this.dataSource.data[i].noun;
        dat.Modifier = this.dataSource.data[i].modifier;
        dat.attridata = this.dataSourceatt.data;
        dat.ref = "2";
        console.log("Att", JSON.stringify(dat))
        this.UpdateDatas(dat).then(
          (data) => {
            if (data != "CodeNM is not Defined") {
              this._snackBar.open('Saved successfully', '', {
                duration: 4000,
                panelClass: ['snackbarstyle']
              });
            }
            else {
              this._snackBar.open('CodeNM is not Defined', '', {
                duration: 4000,
                panelClass: ['doesnotwork']
              })
            }

          }
        ).catch(
          (err) => {
            this._snackBar.open('Something went wrong, Try again', '', {
              duration: 4000,
              panelClass: ['doesnotwork']
            })
          }
        )
      }
      this.Isloading = false;
    }
    else {
      if (this.Reference) {
        const dat = new Noun();
        dat.CodeNM = this.Reference.codenm;
        this.NounModifier ? dat.NounModifier = this.NounModifier : dat.NounModifier = this.Reference.nounmodifier;
        this.NounVal ? dat.Noun = this.NounVal : dat.Noun = this.Reference.noun;
        this.ModifierVal ? dat.Modifier = this.ModifierVal : dat.Modifier = this.Reference.modifier;
        dat.attridata = this.dataSourceatt.data;
        dat.ref = "2";
        console.log("Att", JSON.stringify(dat))
        this.UpdateDatas(dat).then(
          (data) => {
            if (data != "CodeNM is not Defined") {
              this._snackBar.open('Saved successfully', '', {
                duration: 4000,
                panelClass: ['snackbarstyle']
              });
            }
            else {
              this._snackBar.open('CodeNM is not Defined', '', {
                duration: 4000,
                panelClass: ['doesnotwork']
              })
            }

          }
        ).catch(
          (err) => {
            this._snackBar.open('Something went wrong, Try again', '', {
              duration: 4000,
              panelClass: ['doesnotwork']
            })
          }
        )

      }
      else {
        this._snackBar.open('Please Create or Edit Something to save.', '', {
          duration: 4000,
          panelClass: ['snackbarstyle']
        })
      }

    }
  }

  NounModifier_Input(val: string) {
    console.log(val);
    this.NounModifier = val;
    this.dataSource.data[0].nounmodifier = val;
    console.log(this.dataSource.data[0])
  }

  radioclick(row: any) {
    console.log('Row ',row)
    this.Reference = row;
    const cls = new Noun()
    cls.CodeNM = row.codenm;
    this.noundataservice.GetAttributesData(cls).subscribe(
      (data) => {
        this.dataSourceatt = new MatTableDataSource(data);
      },
      (err) => {
        console.error(err);
      }
    )
  }

  rowclicked(ind: number) {
    if (ind == this.editRow) {
      this.editRow = ind;
    }
    else {
      this.editRow = -1;
    }
    this.selection.select(this.dataSource.filteredData[ind]);
    this.radioclick(this.dataSource.filteredData[ind]);
  }

  editrow(i: number) {
    this.editRow = i;
  }

  Addattribute() {
    if (this.dataSourceatt.data.length) {
      this.dataSourceatt.data.forEach(element => {
        element.AttrId += 1;
      });
    }
    this.dataSourceatt.data.unshift({
      Attribute: 'Enter an Attribute',
      Type: 'Enter a Value',
      AttrId: 1
    });

    this.dataSourceatt.filter = '';
  }

  Removeattribute(ind: number) {
    this.dataSourceatt.data.splice(ind, 1);
    this.dataSourceatt.filter = '';
  }
}
