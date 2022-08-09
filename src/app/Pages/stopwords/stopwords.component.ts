import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class StopWords {
  Type: string
  NewText: string
}

export class StopList {
  data: StopWords[];
}

@Component({
  selector: 'app-stopwords',
  templateUrl: './stopwords.component.html',
  styleUrls: ['./stopwords.component.scss']
})

export class StopwordsComponent implements OnInit {

  // Form Variables
  FormVendor: FormGroup;
  FormAttribute: FormGroup;
  FormStop: FormGroup;
  FormMustRemove: FormGroup;


  // Test
  CreateStopwords: StopWords[] = []; // vednor
 
  constructor(private service: EnrichServiceService, private _snackBar: MatSnackBar, private fb: FormBuilder) {
    this.InitializeFormGroup();
  }

  ngOnInit(): void {

  }


  InitializeFormGroup(): void {
    this.FormVendor = this.fb.group({
      formtext: new FormControl(null, Validators.required),
      Vendor: this.fb.array([])
    });
    this.FormAttribute = this.fb.group({
      formtextattribute: new FormControl(null, Validators.required),
      Attribute: this.fb.array([])
    });
    this.FormStop = this.fb.group({
      formtextstop: new FormControl(null, Validators.required),
      Stopwords: this.fb.array([])
    });
    this.FormMustRemove = this.fb.group({
      formtextmust: new FormControl(null, Validators.required),
      MustRemove: this.fb.array([])
    });
  }

  CreateVendor(): void {
    this.CreateStopwords = [];
    if (this.FormVendor.valid) {
      const obj = new StopWords();
      obj.Type = 'Vendor';
      obj.NewText = this.FormVendor.value.formtext;
      this.CreateStopwords.push(obj);

      if (this.FormVendor.value.Vendor) {
        for (let i = 0; i < this.FormVendor.value.Vendor.length; i++) {
          const obj = new StopWords();
          obj.Type = 'Vendor';
          obj.NewText = this.FormVendor.value.Vendor[i];
          this.CreateStopwords.push(obj);
        }
      }
      var resultobj = new StopList();
      resultobj.data = this.CreateStopwords;
      console.log(JSON.stringify(resultobj));

      this.service.GetNewTextStop(JSON.stringify(resultobj)).subscribe(data => {
        console.log(data)
        if (data != undefined) {
          this.FormVendor = this.fb.group({
            formtext: new FormControl(null, Validators.required),
            Vendor: this.fb.array([])
          });
          this._snackBar.open('Stopwords has been created successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
      },
        (error => {
          this._snackBar.open('you have entered already created stopwords.Check again', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
      )

    }
    else {
      this.FormVendor.controls['formtext'].markAsTouched();
      this.FormVendor.controls['Vendor']['controls'].forEach(element => {
        element.markAsTouched()
      });
    }
  }

  CreateAttributes(): void {
    this.CreateStopwords = [];
    if (this.FormAttribute.valid) {
      const obj = new StopWords();
      obj.Type = 'Attribute';
      obj.NewText = this.FormAttribute.value.formtextattribute;
      this.CreateStopwords.push(obj);

      if (this.FormAttribute.value.Attribute) {
        for (let i = 0; i < this.FormAttribute.value.Attribute.length; i++) {
          const obj = new StopWords();
          obj.Type = 'Attribute';
          obj.NewText = this.FormAttribute.value.Attribute[i];
          this.CreateStopwords.push(obj);
        }
      }
      var resultobj = new StopList();
      resultobj.data = this.CreateStopwords;
      console.log(JSON.stringify(resultobj));

      this.service.GetNewTextStop(JSON.stringify(resultobj)).subscribe(data => {
        console.log(data)
        if (data != undefined) {
          this.FormAttribute = this.fb.group({
            formtextattribute: new FormControl(null, Validators.required),
            Attribute: this.fb.array([])
          });
          this._snackBar.open('Stopwords has been created successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
      },
        (error => {
          this._snackBar.open('you have entered already created stopwords.Check again', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
      )
    }
    else {
      this.FormAttribute.controls['formtextattribute'].markAsTouched();
      this.FormAttribute.controls['Attribute']['controls'].forEach(element => {
        element.markAsTouched()
      });
    }
  }

  CreateStops(): void {
    this.CreateStopwords = [];
    if (this.FormStop.valid) {
      const obj = new StopWords();
      obj.Type = 'Stopwords';
      obj.NewText = this.FormStop.value.formtextstop;
      this.CreateStopwords.push(obj);

      if (this.FormStop.value.StopWords) {
        for (let i = 0; i < this.FormStop.value.StopWords.length; i++) {
          const obj = new StopWords();
          obj.Type = 'Stopwords';
          obj.NewText = this.FormStop.value.StopWords[i];
          this.CreateStopwords.push(obj);
        }
      }
      var resultobj = new StopList();
      resultobj.data = this.CreateStopwords;
      console.log(JSON.stringify(resultobj));

      this.service.GetNewTextStop(JSON.stringify(resultobj)).subscribe(data => {
        console.log(data)
        if (data != undefined) {
          this.FormStop = this.fb.group({
            formtextstop: new FormControl(null, Validators.required),
            Stopwords: this.fb.array([])
          });
          this._snackBar.open('Stopwords has been created successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
      },
        (error => {
          this._snackBar.open('you have entered already created stopwords.Check again', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
      )

    }
    else {
      this.FormStop.controls['formtextstop'].markAsTouched();
      this.FormStop.controls['Stopwords']['controls'].forEach(element => {
        element.markAsTouched()
      });
    }

  }

  CreateMust(): void {
    this.CreateStopwords = [];
    if (this.FormMustRemove.valid) {
      const obj = new StopWords();
      obj.Type = 'Must be removed';
      obj.NewText = this.FormMustRemove.value.formtextmust;
      this.CreateStopwords.push(obj);

      if (this.FormMustRemove.value.MustRemove) {
        for (let i = 0; i < this.FormMustRemove.value.MustRemove.length; i++) {
          const obj = new StopWords();
          obj.Type = 'Must be removed';
          obj.NewText = this.FormMustRemove.value.MustRemove[i];
          this.CreateStopwords.push(obj);
        }
      }
      var resultobj = new StopList();
      resultobj.data = this.CreateStopwords;
      console.log(JSON.stringify(resultobj));

      this.service.GetNewTextStop(JSON.stringify(resultobj)).subscribe(data => {
        console.log(data)
        if (data != undefined) {
          this.FormMustRemove = this.fb.group({
            formtextmust: new FormControl(null, Validators.required),
            MustRemove: this.fb.array([])
          });
          this._snackBar.open('Stopwords has been created successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle']
          });
        }
      },
        (error => {
          this._snackBar.open('you have entered already created stopwords.Check again', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
      )

    }
    else {
      this.FormMustRemove.controls['formtextmust'].markAsTouched();
      this.FormMustRemove.controls['MustRemove']['controls'].forEach(element => {
        element.markAsTouched()
      });
    }

  }

  addnewtext() {
    (this.FormVendor.get('Vendor') as FormArray).push(
      this.fb.control(null, Validators.required)
    );
  }

  getVendorFormControls() {
    return (this.FormVendor.get('Vendor') as FormArray).controls
  }

  removeVendor(index: number) {
    (this.FormVendor.get('Vendor') as FormArray).removeAt(index);
  }

  addnewtextattribute() {
    (this.FormAttribute.get('Attribute') as FormArray).push(
      this.fb.control(null, Validators.required)
    );

  }

  getAttributeFormControls() {
    return (<FormArray>this.FormAttribute.get('Attribute')).controls
  }

  removeAttribute(index: number) {
    (this.FormAttribute.get('Attribute') as FormArray).removeAt(index);

  }

  addnewtextstop() {
    (this.FormStop.get('Stopwords') as FormArray).push(
      this.fb.control(null, Validators.required)
    );

  }

  getStopFormControls() {
    return (<FormArray>this.FormStop.get('Stopwords')).controls
  }

  removeStop(index: number) {
    (this.FormStop.get('Stopwords') as FormArray).removeAt(index);
  }

  addnewtextmust() {
    (this.FormMustRemove.get('MustRemove') as FormArray).push(
      this.fb.control(null, Validators.required)
    );

  }

  getRemoveFormControls() {
    return (<FormArray>this.FormMustRemove.get('MustRemove')).controls
  }

  removeMust(index: number) {
    (this.FormMustRemove.get('MustRemove') as FormArray).removeAt(index);
  }


}
