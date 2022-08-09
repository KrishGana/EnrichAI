import { Inject } from '@angular/core';
import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Data } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';

export class Library {
  OriginalText: string
  NewText: string
}
export class LibraryList {
  data: Library[];
}



@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss'],
})

export class LibraryComponent implements OnInit {

  // Form Variables
  LibraryForm: FormGroup;

  Createlibrary: Library[] = [];

  constructor(private dialogRef: MatDialogRef<LibraryComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Data,
    private service: EnrichServiceService,
    private _snackBar: MatSnackBar, private fb: FormBuilder) {
    this.LibraryForm = this.fb.group({
      Originaltext: new FormControl(null, Validators.required),
      formtext: new FormControl(null, Validators.required),
      Library: this.fb.array([])
    });
  }

  ngOnInit(): void {
  }

  CreateLibrary() {
    this.Createlibrary = [];
    if (this.LibraryForm.valid) {
      const obj = new Library();
      obj.OriginalText = this.LibraryForm.value.Originaltext;
      obj.NewText = this.LibraryForm.value.formtext;
      this.Createlibrary.push(obj);

      if (this.LibraryForm.value.Library) {
        for (let i = 0; i < this.LibraryForm.value.Library.length; i++) {
          const obj = new Library();
          obj.OriginalText = this.LibraryForm.value.Originaltext;
          obj.NewText = this.LibraryForm.value.Library[i];
          this.Createlibrary.push(obj);
        }
      }
      var libcreate = new LibraryList();
      libcreate.data = this.Createlibrary;
      console.log(JSON.stringify(libcreate));

      this.service.GetNewText(JSON.stringify(libcreate)).subscribe(data => {
        console.log(data)
        if(data!=undefined){
          this.LibraryForm = this.fb.group({
            Originaltext: new FormControl(null, Validators.required),
            formtext: new FormControl(null, Validators.required),
            Library: this.fb.array([])
          });
          this._snackBar.open('Library has been created successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle'] 
          });
        }
     },
      (err) => {
        this._snackBar.open('you have entered already created stopwords.Check again', '', {
          duration: 4000,
          panelClass: ['snackbarstyle']
        });
      }
     )
    }
    else{
      this.LibraryForm.controls['Originaltext'].markAsTouched();
      this.LibraryForm.controls['formtext'].markAsTouched();
      this.LibraryForm.controls['Library']['controls'].forEach(element => {
        element.markAsTouched()
      });
    }
  }

  addnewtextlib() {
    (this.LibraryForm.get('Library') as FormArray).push(
      this.fb.control(null, Validators.required)
    );
  }

  getLibraryFormControls() {
    return (this.LibraryForm.get('Library') as FormArray).controls
  }

  remove(index: number) {
    (this.LibraryForm.get('Library') as FormArray).removeAt(index);
  }
}
