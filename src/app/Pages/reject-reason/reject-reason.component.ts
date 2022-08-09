import { Component, Inject, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DialogData } from '../data-enrich/de.component';

@Component({
  selector: 'app-reject-reason',
  templateUrl: './reject-reason.component.html',
  styleUrls: ['./reject-reason.component.scss']
})
export class RejectReasonComponent implements OnInit {

  Rejectreason = new FormControl()


  constructor(public dialogRef: MatDialogRef<RejectReasonComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData,private _snackBar: MatSnackBar) {
    console.log(data)
  }

  ngOnInit(): void {
  }

  Close(val: string) {
    if (val == 'Close') {
      this.dialogRef.close('CloseClicked');
    }
    else{
      if(this.Rejectreason.value){
        this.dialogRef.close(this.Rejectreason.value);
      }
      else{
        this._snackBar.open('You must enter the reson for rejection.', '', {
          duration: 8000,
          panelClass: ['doesnotwork']
        });
      }
    }
  }
}
