import { Component, OnInit } from '@angular/core';
import { FormGroup , Validators , FormBuilder, FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';
export class Mail{
  Email : string
}
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss']
})
export class ForgotpasswordComponent implements OnInit {
  ForgotPassword = new FormControl()
  Emails : Mail;
  Email : string = undefined
  constructor(private fb : FormBuilder,
    private Service : EnrichServiceService,
    public nav: LoginServiceService,
    private router:Router, private _snackBar:MatSnackBar,private route: ActivatedRoute) {
      this.nav.islogin(false);
     }

  ngOnInit(): void {
  // this.InitializeForm()
  }

  backtologin(){
    this.router.navigate(['login']);
  }
  InitializeForm(){
    this.ForgotPassword.setValidators([Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
  }

  SendMail(){
    this.Email = this.ForgotPassword.value
    const m = new Mail()
    m.Email = this.ForgotPassword.value
    console.log(m)
    if (this.ForgotPassword.valid) {
      this.Service.EmailPassword(m).subscribe(data => {
        console.log(data)
        if (data) {
         // this.router.navigate(['projects']);
          this._snackBar.open('Mail has been sent successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle'],
          });
        }
      },
        (err) => {
          this._snackBar.open('Something went wrong,Please check your Email Id.', '', {
            duration: 4000,
            panelClass: ['doesnotwork'] 
          });
        })
      this.reset()
    }
    else {
      this.showvalidationerror()
    }
  }

  showvalidationerror(){
    this.ForgotPassword.markAsTouched()
    if(this.Email){
    this._snackBar.open('Please enter the valid Email Id', '', {
      duration: 4000,
      panelClass: ['snackbarstyle'],
    });
   }
  }

  reset(){
    this.ForgotPassword.reset()
  }
}
