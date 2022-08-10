import { SelectionModel } from '@angular/cdk/collections';
import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { MatTableDataSource } from '@angular/material/table';
import { MatDialog } from '@angular/material/dialog';
import { LibraryComponent } from '../library/library.component';
import { StopwordsComponent } from '../stopwords/stopwords.component';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { ExcelService } from 'src/app/Services/excel.service';
import { UpdateEnrichText } from 'src/app/Models/project-model';
import { FormArray, FormGroup, FormBuilder } from '@angular/forms';

import { LoginServiceService } from 'src/app/Services/login-service.service';
import { RejectReasonComponent } from '../reject-reason/reject-reason.component';


export class Datatable {
  Type: string;
  Material: string;
  description: string;
  Potext: string;
  UOM: string;
  Vendorname: string;
  Group: string;
  hsn: string;
  commodity: string;
  nounn: string;
  modifier: string;
  match: string;
  enrichtxt: string;
  enrichpotxt: string;
  action: any;
  status: string;
  status1: string;
  check: boolean;
  accept: boolean;
  disableinput: boolean;
  rejectreason: string;
}

export interface DialogData {
  RejectData: any;
}

// tslint:disable-next-line:class-name
export class noun_modifiers {
  Noun: string;
  Modifier: string;
}

export class PoTexts {
  PoTextBrief: string;
  PoTextWhole: string;
}

export class ObjectForMetadata {
  Material: string;
  PoTextWhole: string;
  EnrichText: string;
  EnrichPoText: string;
  Commodity: string;
}

// tslint:disable-next-line:class-name
export class potextun {
  CodeNMText: string;
  MatGroup: string;
  MatType: string;
  Material: string;
  MaterialText: string;
  POText: string;
  PropMatText: string;
  PropPOText: string;
  Status: number;
  UNSPSC: string;
  UoM: string;
  VendorName: string;
  match: number;
}

const ENRICH_DATA_OPEN: Datatable[] = [];
const ENRICH_DATA_VAL: Datatable[] = [];
const ENRICH_DATA_COM: Datatable[] = [];
const ENRICH_DATA_REJ: Datatable[] = [];


@Component({
  selector: 'app-de',
  templateUrl: './de.component.html',
  styleUrls: ['./de.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeComponent implements OnInit, OnDestroy {

  // Global Variables
  userrole: string;
  values: string;
  ProjectName: any;
  sub: any;



  // Form Group and Form Array - Details
  myControl: FormGroup;
  ValidateControl: FormGroup;
  CompletedControl: FormGroup;
  RejectedControl: FormGroup;
  EnrichFormArray: FormArray = this.fb.array([]);
  ValidateEnrichFormArray: FormArray = this.fb.array([]);
  CompletedEnrichFormArray: FormArray = this.fb.array([]);
  RejectedEnrichFormArray: FormArray = this.fb.array([]);
  OpenTempFormArry: FormArray = this.fb.array([]);
  ValidatedTempFormArry: FormArray = this.fb.array([]);
  CompletedTempFormArry: FormArray = this.fb.array([]);
  RejectedTempFormArry: FormArray = this.fb.array([]);


  // Boolean variables
  opencheck: Boolean;
  openvalidate: Boolean;
  opencompleted: Boolean;
  openrejected: Boolean;
  Isclickedaccept: boolean;
  clicked: boolean;
  allcomplete = false;
  allComplete = true;
  Isloading = true;
  checkstatuscompleted: boolean;
  checkstatusvalidated: boolean;
  checkstatusrejected: boolean;
  filtertyped: Boolean = false;
  all: Boolean;
  IsSeperated: Boolean = false;
  click1: Boolean = false;
  click2: Boolean = false;
  click3: Boolean = false;
  click4: Boolean = false;
  matchBool: Boolean = true;
  hsnBool: Boolean = true;
  grpBool: Boolean = true;
  vNameBool: Boolean = true;
  uomBool: Boolean = true;
  typeBool: Boolean = true;

  // Table data variables 
  OpenDataSource = new MatTableDataSource<Datatable>(ENRICH_DATA_OPEN);
  selectionOpen = new SelectionModel<Datatable>(true, []);   // table - open

  ValidateDataSource = new MatTableDataSource<Datatable>(ENRICH_DATA_VAL);
  selectionValidate = new SelectionModel<Datatable>(true, []);   // table - Validate

  CompletedDataSource = new MatTableDataSource<Datatable>(ENRICH_DATA_COM);
  selectionCompleted = new SelectionModel<Datatable>(true, []);   // table - Completed

  RejectedDataSource = new MatTableDataSource<Datatable>(ENRICH_DATA_REJ);
  selectionRejected = new SelectionModel<Datatable>(true, []);   // table - Rejected

  // Columns to Display in Table

  requiredcolumn: string[] = ['select', 'nounn', 'modifier', 'enrichtxt', 'enrichpotxt', 'Material', 'description', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'Potext', 'commodity', 'rejectreason', 'action'];
  columnDefinitions = [
    { def: 'Type', label: 'Type' },
    { def: 'UOM', label: 'UOM' },
    { def: 'Vendorname', label: 'Vendorname' },
    { def: 'Group', label: 'Group' },
    { def: 'hsn', label: 'HSN' },
    { def: 'match', label: 'Match' },
  ];
  columnShowHideList = [];

  // Extra Variables
  opentotal: number = 0;
  validatetotal: number = 0;
  completetotal: number = 0;
  rejecttotal: number = 0;
  filter: any[];
  Isfilterdisplay = 0;
  modifierarray: string[] = [];
  nounarray: string[] = [];
  EnrichTextsCache: any[] = [];
  enrichtexts: potextun[] = [];  // getenrichtext
  enrichtextsall: potextun[] = [];
  DownloadArrayAsXlsx: Datatable[] = [];
  AcceptArr = [];

  constructor(public dialog: MatDialog, private _snackBar: MatSnackBar, private route: ActivatedRoute, private router: Router,
    private service: EnrichServiceService, private fb: FormBuilder, private Exportasexcel: ExcelService,
    public nav: LoginServiceService) {
    this.nav.islogin(true);
  }


  ngOnInit(): void {
    this.userrole = localStorage.getItem('UserRole');
    if (this.userrole === 'User') {
      this.values = 'open';
      this.requiredcolumn = ['select', 'Material', 'description', 'Potext', 'nounn', 'modifier', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'enrichtxt', 'enrichpotxt', 'commodity', 'rejectreason', 'action'];
    }
    else if (this.userrole === 'Validator') {
      this.values = 'Validate';
    }
    else if (this.userrole === 'Project Manager') {
      this.values = 'Completed';
      if (this.values == "Completed") {
        this.requiredcolumn = ['select', 'nounn', 'modifier', 'enrichtxt', 'enrichpotxt', 'Material', 'description', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'Potext', 'commodity', 'rejectreason'];
      }
      if (this.values == 'Rejected') {
        this.requiredcolumn = ['select', 'nounn', 'modifier', 'enrichtxt', 'enrichpotxt', 'Material', 'description', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'Potext', 'commodity', 'rejectreason', 'action'];
      }
    }
    this.InitializeEnrichData();
    this.toggleColumn();
    this.sub = this.route.queryParams.subscribe(params => {
      this.ProjectName = params;
    });
    this.release_project();
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }

  // Initialize FormGroup 
  InitializeEnrichData(): void {
    this.myControl = this.fb.group({
      Noun_Modifier: this.EnrichFormArray
    });
    this.ValidateControl = this.fb.group({
      Noun_Modifier_Validate: this.ValidateEnrichFormArray
    });
    this.CompletedControl = this.fb.group({
      Noun_Modifier_Complete: this.CompletedEnrichFormArray
    });
    this.RejectedControl = this.fb.group({
      Noun_Modifier_Reject: this.RejectedEnrichFormArray
    });
  }

  InitializeFormControls(): void {
    this.EnrichFormArray = this.fb.array([]);
    this.ValidateEnrichFormArray = this.fb.array([]);
    this.CompletedEnrichFormArray = this.fb.array([]);
    this.RejectedEnrichFormArray = this.fb.array([]);
    this.InitializeEnrichData();
  }

  // GET All Datas
  GetAllDatas(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.service.GetRequiredProjectDetails(this.ProjectName.passingdata).subscribe(
        (response: any) => {
          resolve(response)
        },
        (err: any) => {
          reject(err)
        }
      )
    })
  }

  release_project() {
    if (this.ProjectName.passingdata !== undefined) {
      this.GetAllDatas().then(
        (data: any) => {
          console.log('get', data);
          this.AcceptArr = [];
          for (let index = 0; index < data.length; index++) {
            const tablevalues = new Datatable()
            tablevalues.Material = data[index].Material;
            tablevalues.Vendorname = data[index].VendorName;
            tablevalues.match = data[index].match;
            tablevalues.description = data[index].MaterialText;
            tablevalues.Type = data[index].MatType;
            tablevalues.Group = data[index].MatGroup;
            tablevalues.UOM = data[index].UoM;
            tablevalues.Potext = data[index].POText;
            tablevalues.rejectreason = data[index].RejectReason;
            tablevalues.hsn = '';
            tablevalues.commodity = '';
            tablevalues.action = '';
            tablevalues.status = '';
            tablevalues.status1 = '';
            tablevalues.check = false;
            tablevalues.accept = false;
            tablevalues.disableinput = true;
            tablevalues.nounn = data[index].CodeNMText.split(',')[0];
            tablevalues.modifier = data[index].CodeNMText.split(',')[1];
            this.nounarray[index] = data[index].CodeNMText.split(',')[0];
            this.modifierarray[index] = data[index].CodeNMText.split(',')[1];
            this.checkstatusvalidated = data[index].Status === 40;
            this.checkstatuscompleted = data[index].Status === 50;
            this.checkstatusrejected = data[index].Status === 60;
            if (data[index].Status === 20 || data[index].Status === 30) {
              this.AcceptArr.push(data[index].Status)
              this.InsertEnrichdata(tablevalues);
            }
            else if (data[index].Status === 40) {
              this.InsertEnrichdataValidate(tablevalues);
            }
            else if (data[index].Status === 50) {
              this.InsertEnrichdataCompleted(tablevalues);
            }
            else if (data[index].Status === 60) {
              this.InsertEnrichdataRejected(tablevalues);
            }
          }
          this.OpenTempFormArry = this.EnrichFormArray;
          this.ValidatedTempFormArry = this.ValidateEnrichFormArray;
          this.CompletedTempFormArry = this.CompletedEnrichFormArray;
          this.RejectedTempFormArry = this.RejectedEnrichFormArray;



          this.GetEnrichTextDetails().then(
            (data: any) => {
              this.enrichtexts = [];
              this.enrichtextsall = [];
              this.enrichtexts = data.vals;
              this.enrichtextsall = data.vals;
              this.Checkenrichtext();
            },
            (err: any) => {
              this.Isloading = false;
              console.log("There is some problem in getting Enrich texts...", err)
            }
          ).catch(
            (err: any) => {
              this.Isloading = false;
            }
          )


        }
      ).catch(
        (err: any) => {
          this.Isloading = false;
          console.log("There is some problem in getting Project data...", err)
        }
      )

    }
  }

  GetEnrichTextDetails(): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      this.service.GetEnrichTexts(this.ProjectName.passingdata).subscribe(
        (response: any) => {
          resolve(response)
        },
        (err: any) => {
          reject(err)
        }
      )
    })
  }

  Checkenrichtext(): void {
    for (let idx = 0; idx < this.AcceptArr.length; idx++) {
      if (this.AcceptArr[idx] == 30) {
        let newStr = this.EnrichFormArray.controls[idx].get('nounn').value + ',' + this.EnrichFormArray.controls[idx].get('modifier').value;
        for (let indx = 0; indx < this.enrichtexts.length; indx++) {
          if (newStr === this.enrichtexts[indx].CodeNMText) {
            this.EnrichFormArray.controls[idx].get('enrichtxt').patchValue(this.enrichtexts[indx].PropMatText);
            this.EnrichFormArray.controls[idx].get('enrichpotxt').patchValue(this.enrichtexts[indx].PropPOText);
            this.EnrichFormArray.controls[idx].get('commodity').patchValue(this.enrichtexts[indx].UNSPSC);
            this.EnrichFormArray.controls[idx].get('accept').patchValue(true);
            this.EnrichFormArray.controls[idx].get('disableinput').patchValue(false);
            break;
          }
          else {
            this.EnrichFormArray.controls[idx].get('accept').patchValue(true);
            this.EnrichFormArray.controls[idx].get('disableinput').patchValue(false);
          }
        }
      }
    }
    for (let idx = 0; idx < this.ValidateEnrichFormArray.length; idx++) {
      let newStr = this.ValidateEnrichFormArray.controls[idx].get('nounn').value + ',' + this.ValidateEnrichFormArray.controls[idx].get('modifier').value;
      for (let indx = 0; indx < this.enrichtexts.length; indx++) {
        if (newStr === this.enrichtexts[indx].CodeNMText) {
          this.ValidateEnrichFormArray.controls[idx].get('enrichtxt').patchValue(this.enrichtexts[indx].PropMatText);
          this.ValidateEnrichFormArray.controls[idx].get('enrichpotxt').patchValue(this.enrichtexts[indx].PropPOText);
          this.ValidateEnrichFormArray.controls[idx].get('commodity').patchValue(this.enrichtexts[indx].UNSPSC);
          this.ValidateEnrichFormArray.controls[idx].get('accept').patchValue(true);
          this.ValidateEnrichFormArray.controls[idx].get('disableinput').patchValue(false);
          break;
        }
      }
    }
    for (let idx = 0; idx < this.CompletedEnrichFormArray.length; idx++) {
      let newStr = this.CompletedEnrichFormArray.controls[idx].get('nounn').value + ',' + this.CompletedEnrichFormArray.controls[idx].get('modifier').value;
      for (let indx = 0; indx < this.enrichtexts.length; indx++) {
        if (newStr === this.enrichtexts[indx].CodeNMText) {
          this.CompletedEnrichFormArray.controls[idx].get('enrichtxt').patchValue(this.enrichtexts[indx].PropMatText);
          this.CompletedEnrichFormArray.controls[idx].get('enrichpotxt').patchValue(this.enrichtexts[indx].PropPOText);
          this.CompletedEnrichFormArray.controls[idx].get('commodity').patchValue(this.enrichtexts[indx].UNSPSC);
          this.CompletedEnrichFormArray.controls[idx].get('accept').patchValue(true);
          this.CompletedEnrichFormArray.controls[idx].get('disableinput').patchValue(false);
          break;
        }
      }
    }
    for (let idx = 0; idx < this.RejectedEnrichFormArray.length; idx++) {
      let newStr = this.RejectedEnrichFormArray.controls[idx].get('nounn').value + ',' + this.RejectedEnrichFormArray.controls[idx].get('modifier').value;
      for (let indx = 0; indx < this.enrichtexts.length; indx++) {
        if (newStr === this.enrichtexts[indx].CodeNMText) {
          this.RejectedEnrichFormArray.controls[idx].get('enrichtxt').patchValue(this.enrichtexts[indx].PropMatText);
          this.RejectedEnrichFormArray.controls[idx].get('enrichpotxt').patchValue(this.enrichtexts[indx].PropPOText);
          this.RejectedEnrichFormArray.controls[idx].get('commodity').patchValue(this.enrichtexts[indx].UNSPSC);
          this.RejectedEnrichFormArray.controls[idx].get('accept').patchValue(true);
          this.RejectedEnrichFormArray.controls[idx].get('disableinput').patchValue(false);
          break;
        }
      }
    }
    this.DataSourceInitializer();
  }

  DataSourceInitializer(): void {
    const ENRICH_DATA_OPEN: Datatable[] = [];
    this.EnrichFormArray.controls.forEach(element => {
      ENRICH_DATA_OPEN.push(element.value)
    });
    this.OpenDataSource = new MatTableDataSource(ENRICH_DATA_OPEN);
    const ENRICH_DATA_VAL: Datatable[] = [];
    this.ValidateEnrichFormArray.controls.forEach(element => {
      ENRICH_DATA_VAL.push(element.value)
    });
    this.ValidateDataSource = new MatTableDataSource(ENRICH_DATA_VAL);

    const ENRICH_DATA_COM: Datatable[] = [];
    this.CompletedEnrichFormArray.controls.forEach(element => {
      ENRICH_DATA_COM.push(element.value)
    });
    this.CompletedDataSource = new MatTableDataSource(ENRICH_DATA_COM);

    const ENRICH_DATA_REJ: Datatable[] = [];
    this.RejectedEnrichFormArray.controls.forEach(element => {
      ENRICH_DATA_REJ.push(element.value)
    });
    this.RejectedDataSource = new MatTableDataSource(ENRICH_DATA_REJ);

    this.Isloading = false;

    if (this.values == 'open' && this.OpenDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
    if (this.values == 'Valiadte' && this.ValidateDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
    if (this.values == 'Completed' && this.CompletedDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
    if (this.values == 'Rejected' && this.RejectedDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
  }

  EmptyDatasource() {
    this.OpenDataSource = new MatTableDataSource();
    this.ValidateDataSource = new MatTableDataSource();
    this.CompletedDataSource = new MatTableDataSource();
    this.RejectedDataSource = new MatTableDataSource();
  }


  // Insert - Main Functions 
  InsertEnrichdata(rowdata: Datatable): void {
    const row = this.fb.group({
      Type: [rowdata.Type],
      Material: [rowdata.Material],
      description: [rowdata.description],
      Potext: [rowdata.Potext],
      UOM: [rowdata.UOM],
      Vendorname: [rowdata.Vendorname],
      Group: [rowdata.Group],
      hsn: [rowdata.hsn],
      commodity: [rowdata.commodity],
      nounn: [rowdata.nounn],
      modifier: [rowdata.modifier],
      match: [rowdata.match],
      rejectreason: [rowdata.rejectreason],
      enrichtxt: [rowdata.enrichtxt],
      enrichpotxt: [rowdata.enrichpotxt],
      action: [rowdata.action],
      status: [rowdata.status],
      status1: [rowdata.status1],
      check: [rowdata.check],
      accept: [rowdata.accept],
      disableinput: [rowdata.disableinput],
    });
    this.EnrichFormArray.push(row);
  }

  InsertEnrichdataValidate(rowdata: any): void {
    const row = this.fb.group({
      Type: [rowdata.Type],
      Material: [rowdata.Material],
      description: [rowdata.description],
      Potext: [rowdata.Potext],
      UOM: [rowdata.UOM],
      Vendorname: [rowdata.Vendorname],
      Group: [rowdata.Group],
      hsn: [rowdata.hsn],
      commodity: [rowdata.commodity],
      nounn: [rowdata.nounn],
      modifier: [rowdata.modifier],
      match: [rowdata.match],
      rejectreason: [rowdata.rejectreason],
      enrichtxt: [rowdata.enrichtxt],
      enrichpotxt: [rowdata.enrichpotxt],
      action: [rowdata.action],
      status: [rowdata.status],
      status1: [rowdata.status1],
      check: [rowdata.check],
      accept: [rowdata.accept],
      disableinput: [rowdata.disableinput],
    });

    this.ValidateEnrichFormArray.push(row);

  }

  InsertEnrichdataCompleted(rowdata: any): void {
    const row = this.fb.group({
      Type: [rowdata.Type],
      Material: [rowdata.Material],
      description: [rowdata.description],
      Potext: [rowdata.Potext],
      UOM: [rowdata.UOM],
      Vendorname: [rowdata.Vendorname],
      Group: [rowdata.Group],
      hsn: [rowdata.hsn],
      commodity: [rowdata.commodity],
      nounn: [rowdata.nounn],
      modifier: [rowdata.modifier],
      match: [rowdata.match],
      rejectreason: [rowdata.rejectreason],
      enrichtxt: [rowdata.enrichtxt],
      enrichpotxt: [rowdata.enrichpotxt],
      action: [rowdata.action],
      status: [rowdata.status],
      status1: [rowdata.status1],
      check: [rowdata.check],
      accept: [rowdata.accept],
      disableinput: [rowdata.disableinput],
    });
    this.CompletedEnrichFormArray.push(row);
  }

  InsertEnrichdataRejected(rowdata: any): void {
    const row = this.fb.group({
      Type: [rowdata.Type],
      Material: [rowdata.Material],
      description: [rowdata.description],
      Potext: [rowdata.Potext],
      UOM: [rowdata.UOM],
      Vendorname: [rowdata.Vendorname],
      Group: [rowdata.Group],
      hsn: [rowdata.hsn],
      commodity: [rowdata.commodity],
      nounn: [rowdata.nounn],
      modifier: [rowdata.modifier],
      match: [rowdata.match],
      rejectreason: [rowdata.rejectreason],
      enrichtxt: [rowdata.enrichtxt],
      enrichpotxt: [rowdata.enrichpotxt],
      action: [rowdata.action],
      status: [rowdata.status],
      status1: [rowdata.status1],
      check: [rowdata.check],
      accept: [rowdata.accept],
      disableinput: [rowdata.disableinput],
    });
    this.RejectedEnrichFormArray.push(row);
  }

  InsertTempData(rowdata: any): void {
    const row = this.fb.group({
      Type: [rowdata.Type],
      Material: [rowdata.Material],
      description: [rowdata.description],
      Potext: [rowdata.Potext],
      UOM: [rowdata.UOM],
      Vendorname: [rowdata.Vendorname],
      Group: [rowdata.Group],
      hsn: [rowdata.hsn],
      commodity: [rowdata.commodity],
      nounn: [rowdata.nounn],
      modifier: [rowdata.modifier],
      match: [rowdata.match],
      rejectreason: [rowdata.rejectreason],
      enrichtxt: [rowdata.enrichtxt],
      enrichpotxt: [rowdata.enrichpotxt],
      action: [rowdata.action],
      status: [rowdata.status],
      status1: [rowdata.status1],
      check: [rowdata.check],
      accept: [rowdata.accept],
      disableinput: [rowdata.disableinput],
    });
    this.values == 'open' ? this.OpenTempFormArry.push(row) : {};
    this.values == 'Validate' ? this.ValidatedTempFormArry.push(row) : {};
    this.values == 'Completed' ? this.CompletedTempFormArry.push(row) : {};
    this.values == 'Rejected' ? this.RejectedTempFormArry.push(row) : {};
    
  }

  // Button Functions
  ClickAccept() {
    if (this.selectionOpen.selected.length === 0) {
      this._snackBar.open('Please select something to accept.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      this.Isclickedaccept = !this.Isclickedaccept;
      for (let ind = 0; ind < this.selectionOpen.selected.length; ind++) {
        this.selectacceptrow(ind);
      }
      setTimeout(() => {
        this.InitializeFormControls();
        this.release_project();
      }, 3000);
    }
  }

  ClickConfirm() {
    if (this.selectionOpen.selected.length === 0) {
      this._snackBar.open('Please select something to confirm.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      this.clicked = !this.clicked;
      for (let ind = 0; ind < this.selectionOpen.selected.length; ind++) {
        this.updatetoconfirm(ind);
      }
      setTimeout(() => {
        this.InitializeFormControls();
        this.release_project();
      }, 3000);
    }
  }

  clickvalidateConfirm() {
    if (this.selectionValidate.selected.length === 0) {
      this._snackBar.open('Please select something to confirm.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      this.click2 = !this.click2;
      for (let i = 0; i < this.selectionValidate.selected.length; i++) {
        this.ValidatedTempFormArry.controls[i].get('status').patchValue('true');
        // this.ValidateDataSource.data[i]['status'] = 'true';
      }
      for (let ind = 0; ind < this.selectionValidate.selected.length; ind++) {
        if (this.ValidatedTempFormArry.controls[ind].get('status').value === 'true') {
          this.updatetovalidate(ind);
        }
      }
      setTimeout(() => {
        this.InitializeFormControls();
        this.release_project();
      }, 3000);
    }
  }

  clickvalidateReject() {
    if (this.selectionValidate.selected.length === 0) {
      this._snackBar.open('Please select something to reject.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      this.Isloading = true;
      for (let i = 0; i < this.selectionValidate.selected.length; i++) {
        this.ValidatedTempFormArry.controls[i].get('status1').patchValue('true');
      }
      for (let ind = 0; ind < this.selectionValidate.selected.length; ind++) {
        if (this.ValidatedTempFormArry.controls[ind].get('status1').value === 'true') {
          const dialogRef = this.dialog.open(RejectReasonComponent, {
            height: '63%',
            width: '60%',
            panelClass: 'custom-dialog-container',
            disableClose: true,
            autoFocus: true,
            data: { RejectData: this.ValidateDataSource.data[ind] }
          });
          dialogRef.afterClosed().subscribe(result => {
            if (result != 'CloseClicked') {
              console.log("res", result);
              this.updatetoreject(ind, result);
              setTimeout(() => {
                this.InitializeFormControls();
                this.release_project();
              }, 3000);
            }
            else {
              setTimeout(() => {
                this.EmptyDatasource();
                this.InitializeFormControls();
                this.release_project();
              }, 3000);
            }
          });
        }
      }
    }
  }

  ClickReassign() {
    if (this.selectionRejected.selected.length === 0) {
      this._snackBar.open('Please select something to Re-Assign.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      for (let i = 0; i < this.selectionRejected.selected.length; i++) {
        this.RejectedTempFormArry.controls[i].get('status').patchValue('true');
      }
      for (let ind = 0; ind < this.selectionRejected.selected.length; ind++) {
        if (this.RejectedTempFormArry.controls[ind].get('status').value === 'true') {
          this.updatetoopen(ind);
        }
      }
      setTimeout(() => {
        this.InitializeFormControls();
        this.release_project();
      }, 3000);
    }
  }

  CickClear() {
    console.log(this.CompletedDataSource)
    if (this.selectionCompleted.selected.length === 0) {
      this._snackBar.open('Please select something to Clear/Delete.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
    else {
      for (let i = 0; i < this.selectionCompleted.selected.length; i++) {
        this.CompletedDataSource.data[i]['status'] = 'true';
      }
      for (let ind = 0; ind < this.selectionCompleted.selected.length; ind++) {
        if (this.CompletedDataSource.data[ind]['status'] === 'true') {
          let Delete = [{
            ProjName: this.ProjectName.passingdata,
            Material: this.CompletedDataSource.data[ind]['Material']
          }]
        }
      }
      setTimeout(() => {
        this.InitializeFormControls();
        this.release_project();
      }, 3000);
    }
  }

  // Table row button click functions
  selectacceptrow(ind: number) {
    if (this.ProjectName.passingdata !== undefined) {
      this.changeacceptstatus(ind);
      const UpdateEnrichTexts = new UpdateEnrichText();
      UpdateEnrichTexts.ProjectName = this.ProjectName.passingdata;
      UpdateEnrichTexts.Material = this.OpenTempFormArry.controls[ind].get('Material').value;
      UpdateEnrichTexts.NounModifier = this.OpenTempFormArry.controls[ind].get('nounn').value + ',' + this.OpenTempFormArry.controls[ind].get('modifier').value;
      UpdateEnrichTexts.EnrichText = ' ';
      UpdateEnrichTexts.EnrichPoText = ' ';
      UpdateEnrichTexts.RejectReason = '';
      UpdateEnrichTexts.Status = 'Accept';
      this.updateStatus(UpdateEnrichTexts).then(result => {
        if (result) {
          this._snackBar.open('Material is Accepted, Waiting for Confirmation', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
        else {
          this.Isloading = false;
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        }
      }).catch(err => {
        console.log("Update Error : ", err);
        this.Isloading = false;
      });
    }
  }

  selectconfirmrow(ind: number) {
    this.updatetoconfirm(ind);
    setTimeout(() => {
      this.InitializeFormControls();
      this.release_project();
    }, 3000);
  }

  async updatetoconfirm(ind: number) {
    if (this.ProjectName.passingdata !== undefined) {
      const UpdateEnrichTexts = new UpdateEnrichText();
      UpdateEnrichTexts.ProjectName = this.ProjectName.passingdata;
      UpdateEnrichTexts.Material = this.OpenTempFormArry.controls[ind].get('Material').value;
      UpdateEnrichTexts.NounModifier = this.OpenTempFormArry.controls[ind].get('nounn').value + ',' + this.OpenTempFormArry.controls[ind].get('modifier').value;
      UpdateEnrichTexts.EnrichText = this.OpenTempFormArry.controls[ind].get('enrichtxt').value;
      UpdateEnrichTexts.EnrichPoText = this.OpenTempFormArry.controls[ind].get('enrichpotxt').value;
      UpdateEnrichTexts.RejectReason = '';
      UpdateEnrichTexts.Status = 'Confirm';
      this.Isloading = true;
      this.EmptyDatasource();
      await this.updateStatus(UpdateEnrichTexts).then(result => {
        if (result) {
          this._snackBar.open('Material is confirmed and moved for validation', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
        else {
          this.Isloading = false;
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        }
      }).catch(err => {
        console.log("Update Error : ", err);
      });
    }

  }

  clickvalidateConfirmRow(ind: number) {
    this.updatetovalidate(ind);
    setTimeout(() => {
      this.InitializeFormControls();
      this.release_project();
    }, 3000);
  }

  async updatetovalidate(ind: number) {
    if (this.ProjectName.passingdata !== undefined) {
      const UpdateEnrichTexts = new UpdateEnrichText();
      UpdateEnrichTexts.ProjectName = this.ProjectName.passingdata;
      UpdateEnrichTexts.Material = this.ValidatedTempFormArry.controls[ind].get('Material').value;
      UpdateEnrichTexts.NounModifier = this.ValidatedTempFormArry.controls[ind].get('nounn').value + ',' + this.ValidatedTempFormArry.controls[ind].get('modifier').value;
      UpdateEnrichTexts.EnrichText = this.ValidatedTempFormArry.controls[ind].get('enrichtxt').value;
      UpdateEnrichTexts.EnrichPoText = this.ValidatedTempFormArry.controls[ind].get('enrichpotxt').value;
      UpdateEnrichTexts.RejectReason = '';
      UpdateEnrichTexts.Status = 'Validate';
      this.Isloading = true;
      this.EmptyDatasource();
      await this.updateStatus(UpdateEnrichTexts).then(result => {
        if (result) {
          this._snackBar.open('Material is confirmed and moved for approval', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
          this.click2 = false;
        }
        else {
          this.Isloading = false;
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        }
      }).catch(err => {
        console.log("Update Error : ", err);

      });

    }
  }

  clickvalidateRejectRow(ind: number) {
    const dialogRef = this.dialog.open(RejectReasonComponent, {
      height: '63%',
      width: '60%',
      panelClass: 'custom-dialog-container',
      disableClose: true,
      autoFocus: true,
      data: { RejectData: this.ValidateDataSource.data[ind] }
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result != 'CloseClicked') {
        console.log("res", result);
        this.updatetoreject(ind, result);
        setTimeout(() => {
          this.InitializeFormControls();
          this.release_project();
        }, 3000);
      }
      else {
        setTimeout(() => {
          this.InitializeFormControls();
          this.release_project();
        }, 3000);
      }
    });
  }

  async updatetoreject(ind: number, val: string) {
    if (this.ProjectName.passingdata !== undefined) {
      const UpdateEnrichTexts = new UpdateEnrichText();
      UpdateEnrichTexts.ProjectName = this.ProjectName.passingdata;
      UpdateEnrichTexts.Material = this.ValidatedTempFormArry.controls[ind].get('Material').value;
      UpdateEnrichTexts.NounModifier = this.ValidatedTempFormArry.controls[ind].get('nounn').value + ',' + this.ValidatedTempFormArry.controls[ind].get('modifier').value;
      UpdateEnrichTexts.EnrichText = this.ValidatedTempFormArry.controls[ind].get('enrichtxt').value;
      UpdateEnrichTexts.EnrichPoText = this.ValidatedTempFormArry.controls[ind].get('enrichpotxt').value;
      UpdateEnrichTexts.RejectReason = val;
      UpdateEnrichTexts.Status = 'Reject';
      this.Isloading = true;
      this.EmptyDatasource();
      await this.updateStatus(UpdateEnrichTexts).then(result => {
        if (result) {
          this._snackBar.open('Material is rejected and moved for re-assign', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
          this.click1 = false;
        }
        else {
          this.Isloading = false;
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        }
      }).catch(err => {
        console.log("Update Error : ", err);

      });

    }
  }

  clickReassignRow(ind: number) {
    this.updatetoopen(ind);
    setTimeout(() => {
      this.InitializeFormControls();
      this.release_project();
    }, 3000);
  }

  async updatetoopen(ind: number) {
    if (this.ProjectName.passingdata !== undefined) {
      const UpdateEnrichTexts = new UpdateEnrichText();
      UpdateEnrichTexts.ProjectName = this.ProjectName.passingdata;
      UpdateEnrichTexts.Material = this.RejectedTempFormArry.controls[ind].get('Material').value;
      UpdateEnrichTexts.NounModifier = this.RejectedTempFormArry.controls[ind].get('nounn').value + ',' + this.RejectedTempFormArry.controls[ind].get('modifier').value;
      UpdateEnrichTexts.EnrichText = this.RejectedTempFormArry.controls[ind].get('enrichtxt').value;
      UpdateEnrichTexts.EnrichPoText = this.RejectedTempFormArry.controls[ind].get('enrichpotxt').value;
      UpdateEnrichTexts.RejectReason = '';
      UpdateEnrichTexts.Status = 'Open';
      this.Isloading = true;
      this.EmptyDatasource();
      await this.updateStatus(UpdateEnrichTexts).then(result => {
        if (result) {
          this._snackBar.open('Material is Re-Assigned', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
        else {
          this.Isloading = false;
          this._snackBar.open('Something went wrong, Please try again later', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        }
      }).catch(err => {
        console.log("Update Error : ", err);
        this.Isloading = false;
      });

    }
  }

  deleteData(ind: number) {
    if (this.ProjectName.passingdata !== undefined) {
      let Delete = [{
        ProjName: this.ProjectName.passingdata,
        Material: this.CompletedTempFormArry.controls[ind].get('Material').value
      }]
      console.log(Delete)
    }
  }

  // Sub Functions
  UpdateEnrichDataText(projectupdatetext: UpdateEnrichText): void {
    this.service.UpdateEnrichDataText(projectupdatetext).subscribe(data => {
      console.log('enrichtexts-0', data);
    },
      err => {
        console.log("Err : ", err);
      });
  }

  updateStatus = (Texts: any): Promise<string> => {
    return new Promise<string>((resolve, reject) => {
      this.service.UpdateEnrichDataText(Texts).subscribe(
        (response: any) => {
          console.log("Response ", response);
          resolve(response);
        },
        (err: any) => {
          console.log("Err ", err);
          reject(err);
        }
      )
    })
  }

  changeacceptstatus(ind: number): void {
    let newStr = this.OpenDataSource.data[ind]['nounn'] + ',' + this.OpenDataSource.data[ind]['modifier'];
    for (let indx = 0; indx < this.enrichtexts.length; indx++) {
      if (newStr === this.enrichtexts[indx].CodeNMText) {
        this.OpenTempFormArry.controls[ind].get('Material').value
        this.OpenDataSource.data[ind]['enrichtxt'] = this.enrichtexts[indx].PropMatText;
        this.OpenDataSource.data[ind]['enrichpotxt'] = this.enrichtexts[indx].PropPOText;
        this.OpenDataSource.data[ind]['commodity'] = this.enrichtexts[indx].UNSPSC;
        this.OpenTempFormArry.controls[ind].get('accept').patchValue(true)
        this.OpenTempFormArry.controls[ind].get('disableinput').patchValue(false);
        break;
      }
    }
  }

  // Selecting Rows in table
  selectrows(): void {
    this.selectionOpen.clear();
    for (let index = 0; index < this.opentotal; index++) {
      this.selectionOpen.toggle(this.OpenDataSource.data[index])
    }
    if (this.opentotal > this.OpenDataSource.data.length) {
      this._snackBar.open('you are ahead of maximun rows in the table, please select items from the table', '', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
    }
    this.Isclickedaccept = false;
    this.clicked = false;
  }

  selectrowsvalidates() {
    this.selectionValidate.clear();
    for (let index = 0; index < this.validatetotal; index++) {
      this.selectionValidate.toggle(this.ValidateDataSource.data[index])
    }
    if (this.validatetotal > this.ValidateDataSource.data.length) {
      this._snackBar.open('you are ahead of maximun rows in the table, please select items from the table', '', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
    }
    this.click1 = false;
    this.click2 = false;
  }

  selectrowscompletes() {
    this.selectionCompleted.clear();
    for (let index = 0; index < this.completetotal; index++) {
      this.selectionCompleted.toggle(this.CompletedDataSource.data[index])
    }
    if (this.completetotal > this.CompletedDataSource.data.length) {
      this._snackBar.open('you are ahead of maximun rows in the table, please select items from the table', '', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
    }
    this.click3 = false;
    this.click4 = false;
  }

  selectrowsrejects() {
    this.selectionRejected.clear();
    for (let index = 0; index < this.rejecttotal; index++) {
      this.selectionRejected.toggle(this.RejectedDataSource.data[index])
    }
    if (this.rejecttotal > this.RejectedDataSource.data.length) {
      this._snackBar.open('you are ahead of maximun rows in the table, please select items from the table', '', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
    }
  }

  getincrement() {
    if (this.values === 'open') {
      this.opentotal++;
    }
    if (this.values === 'Validate') {
      this.validatetotal++;
    }
    if (this.values === 'Completed') {
      this.completetotal++;
    }
    if (this.values === 'Rejected') {
      this.rejecttotal++;
    }
  }

  getdecrement() {
    if (this.values === 'open') {
      this.opentotal--;
    }
    if (this.values === 'Validate') {
      this.validatetotal--;
    }
    if (this.values === 'Completed') {
      this.completetotal--;
    }
    if (this.values === 'Rejected') {
      this.rejecttotal--;
    }
  }

  gettotal(total) {
    if (this.values === 'open') {
      this.opentotal = Number(total);
    }
    if (this.values === 'Validate') {
      this.validatetotal = Number(total);
    }
    if (this.values === 'Completed') {
      this.completetotal = Number(total);
    }
    if (this.values === 'Rejected') {
      this.rejecttotal = Number(total);
    }
  }

  isAllSelected() {
    const numSelected = this.selectionOpen.selected.length;
    const numRows = this.OpenDataSource.data.length;
    return numSelected === numRows;
  }

  masterToggle(): void {
    if (this.isAllSelected()) {
      this.selectionOpen.clear();
      return;
    }
    this.selectionOpen.select(...this.OpenDataSource.data)
  }

  isAllValidateSelected() {
    const numSelected = this.selectionValidate.selected.length;
    const numRows = this.ValidateDataSource.data.length;
    return numSelected === numRows;
  }

  masterTogglevalidate(): void {
    if (this.isAllValidateSelected()) {
      this.selectionValidate.clear();
      return;
    }
    this.selectionValidate.select(...this.ValidateDataSource.data)
  }

  isAllCompleteSelected() {
    const numSelected = this.selectionCompleted.selected.length;
    const numRows = this.CompletedDataSource.data.length;
    return numSelected === numRows;
  }

  masterTogglecompleted(): void {
    if (this.isAllCompleteSelected()) {
      this.selectionCompleted.clear();
      return;
    }
    this.selectionCompleted.select(...this.CompletedDataSource.data)
  }

  isAllRejectSelected() {
    const numSelected = this.selectionRejected.selected.length;
    const numRows = this.RejectedDataSource.data.length;
    return numSelected === numRows;
  }

  masterTogglerejected(): void {
    if (this.isAllRejectSelected()) {
      this.selectionRejected.clear();
      return;
    }
    this.selectionRejected.select(...this.RejectedDataSource.data)
  }

  // Extra Functions
  FilterColumns(column): void {
    if (column.val == 'Type') {
      if (column.checked) {
        this.typeBool = true;
      }
      else {
        this.typeBool = false;
      }
    }

    if (column.val == 'UOM') {
      if (column.checked) {
        this.uomBool = true;
      }
      else {
        this.uomBool = false;
      }
    }
    if (column.val == 'Vendorname') {
      if (column.checked) {
        this.vNameBool = true;
      }
      else {
        this.vNameBool = false;
      }
    }
    if (column.val == 'Group') {
      if (column.checked) {
        this.grpBool = true;
      }
      else {
        this.grpBool = false;
      }
    }

    if (column.val == 'hsn') {
      if (column.checked) {
        this.hsnBool = true;
      }
      else {
        this.hsnBool = false;
      }
    }
    if (column.val == 'match') {
      if (column.checked) {
        this.matchBool = true;
      }
      else {
        this.matchBool = false;
      }
    }
  }

  toggleColumn() {

    this.columnDefinitions.forEach((element, index) => {
      this.columnShowHideList.push(
        { name: element.label, checked: true, val: element.def }
      );
    });
  }

  openDialog(checkstr: string): void {
    if (checkstr === 'Library') {
      const dialogRef = this.dialog.open(LibraryComponent, {
        height: '63%',
        width: '60%',
        disableClose: true,
        autoFocus: true,
        panelClass: 'custom-stopwordsLibrary'
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
        panelClass: 'custom-stopwordsLibrary'
      });
      dialogRef.afterClosed().subscribe(result => {
        console.log(result);
      });
    }

  }

  DownloadExcel() {
    if (this.selectionCompleted.selected.length > 0) {
      this.DownloadArrayAsXlsx = [];
      for (let i = 0; i < this.selectionCompleted.selected.length; i++) {
        const val = new Datatable();
        val.Type = this.selectionCompleted.selected[i]['Type'];
        val.Material = this.selectionCompleted.selected[i]['Material'];
        val.description = this.selectionCompleted.selected[i]['description'];
        val.Potext = this.selectionCompleted.selected[i]['Potext'];
        val.Vendorname = this.selectionCompleted.selected[i]['Vendorname'];
        val.Group = this.selectionCompleted.selected[i]['Group'];
        val.UOM = this.selectionCompleted.selected[i]['UOM'];
        val.nounn = this.selectionCompleted.selected[i]['nounn'];
        val.modifier = this.selectionCompleted.selected[i]['modifier'];
        val.commodity = this.selectionCompleted.selected[i]['commodity'];
        val.match = this.selectionCompleted.selected[i]['match'];
        val.enrichtxt = this.selectionCompleted.selected[i]['enrichtxt'];
        val.enrichpotxt = this.selectionCompleted.selected[i]['enrichpotxt'];
        this.DownloadArrayAsXlsx.push(val);
      }
      this.Exportasexcel.exportAsExcelFile(this.DownloadArrayAsXlsx, 'ExportedDataTable');
      this._snackBar.open('Download Success.', 'close', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
      return;
    }
    else {
      this._snackBar.open('Please select something to Download.', 'close', {
        duration: 4000,
        panelClass: ['doesnotwork']
      });
      return;
    }
  }

  applyFilter(event: Event): void {
    this.filtertyped = true;
    this.OpenTempFormArry = this.fb.array([]);
    this.ValidatedTempFormArry = this.fb.array([]);
    this.CompletedTempFormArry = this.fb.array([]);
    this.RejectedTempFormArry = this.fb.array([]);
    const filterValue = (event.target as HTMLInputElement).value;
    const queryLower = filterValue.trim().toLowerCase();
    console.log('let  ', queryLower)
    if (this.values == 'open') {
      const x = this.EnrichFormArray.value.filter(p => p.description.toLowerCase().includes(queryLower)).map(p => ({ ...p, index: this.EnrichFormArray.value.indexOf(p) }));
      const ENRICH_DATA_OPEN: Datatable[] = [];
      x.forEach(element => {
        this.InsertTempData(element);
        ENRICH_DATA_OPEN.push(element);
      });
      this.OpenDataSource = new MatTableDataSource(ENRICH_DATA_OPEN);
    }
    if (this.values == 'Validate') {
      const x = this.ValidateEnrichFormArray.value.filter(p => p.description.toLowerCase().includes(queryLower)).map(p => ({ ...p, index: this.EnrichFormArray.value.indexOf(p) }));
      const ENRICH_DATA_VAL: Datatable[] = [];
      x.forEach(element => {
        this.InsertTempData(element);
        ENRICH_DATA_VAL.push(element);
      });
      this.ValidateDataSource = new MatTableDataSource(ENRICH_DATA_VAL);
      console.log('ds', this.ValidateDataSource)
    }
    if (this.values == 'Completed') {
      const x = this.CompletedEnrichFormArray.value.filter(p => p.description.toLowerCase().includes(queryLower)).map(p => ({ ...p, index: this.CompletedEnrichFormArray.value.indexOf(p) }));
      const ENRICH_DATA_COM: Datatable[] = [];
      x.forEach(element => {
        this.InsertTempData(element);
        ENRICH_DATA_COM.push(element);
      });
      this.CompletedDataSource = new MatTableDataSource(ENRICH_DATA_COM);
    }
    if (this.values == 'Rejected') {
      const x = this.RejectedEnrichFormArray.value.filter(p => p.description.toLowerCase().includes(queryLower)).map(p => ({ ...p, index: this.RejectedEnrichFormArray.value.indexOf(p) }));
      const ENRICH_DATA_REJ: Datatable[] = [];
      x.forEach(element => {
        this.InsertTempData(element);
        ENRICH_DATA_REJ.push(element);
      });
      this.RejectedDataSource = new MatTableDataSource(ENRICH_DATA_REJ);
    }
  }

  open() {
    this.opencheck = true;
    this.openvalidate = false;
    this.opencompleted = false;
    this.openrejected = false;
    this.values = 'open';
  }

  validate() {
    this.openvalidate = true;
    this.opencompleted = false;
    this.openrejected = false;
    this.opencheck = false;
    this.values = 'Validate';
  }

  completed() {
    this.opencompleted = true;
    this.openrejected = false;
    this.opencheck = false;
    this.openvalidate = false;
    this.values = 'Completed';
    this.requiredcolumn = ['select', 'nounn', 'modifier', 'enrichtxt', 'enrichpotxt', 'Material', 'description', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'Potext', 'commodity', 'rejectreason'];
    this.CompletedTempFormArry = this.CompletedEnrichFormArray;
    if (this.CompletedDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
  }

  rejected() {
    this.openrejected = true;
    this.opencheck = false;
    this.openvalidate = false;
    this.opencompleted = false;
    this.values = 'Rejected';
    this.RejectedTempFormArry = this.RejectedEnrichFormArray;
    this.requiredcolumn = ['select', 'nounn', 'modifier', 'enrichtxt', 'enrichpotxt', 'Material', 'description', 'Type', 'UOM', 'Vendorname', 'Group', 'hsn', 'match', 'Potext', 'commodity', 'rejectreason', 'action'];
    if (this.RejectedDataSource.data.length == 0) {
      this._snackBar.open('There is no data to show', '', {
        duration: 8000,
        panelClass: ['snackbarstyle']
      });
    }
  }
}

