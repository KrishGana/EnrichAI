import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup , Validators , FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';
export class LoginInto{
  UserName  : string
  Password  : string
}
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class LoginComponent implements OnInit {
  hide = true;
  LoginFormGroup : FormGroup

  constructor(private fb : FormBuilder,
    private Service : EnrichServiceService,
    public nav: LoginServiceService,
    private router:Router, private _snackBar:MatSnackBar) {
      this.nav.islogin(false);
     }

  ngOnInit(): void {
    this.InitializeFormGroup();
  }
 
  InitializeFormGroup():void{
    this.LoginFormGroup = this.fb.group({
       Username : ['',Validators.required],
       Password : ['',Validators.required]
    })
  }

  forgotpass(){
    this.router.navigate(['forgotpassword']);
  }
  SignIn() {
    let user = this.LoginFormGroup.get('Username').value
    localStorage.setItem('User', user);
    const log = new LoginInto()
    log.UserName = this.LoginFormGroup.get('Username').value
    log.Password = this.LoginFormGroup.get('Password').value
    if (this.LoginFormGroup.valid) {
      this.Service.LoginIntoEnrichAI(log).subscribe(data => {
        console.log("Login Data",data,typeof(data))
        if (data) {
          this.router.navigate(['projects']);
          this._snackBar.open('Logged in successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle'],
            verticalPosition: 'bottom',
            horizontalPosition: 'right',
          });
        }
      },
        (err) => {
          this._snackBar.open('Username or Password is incorrect, check again.', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
    }
    else {
      this.showerros()
    }
  }

  SignUp(){
    this.router.navigate(['signup'])
  }

  showerros(){
    this.LoginFormGroup.get('Username').markAsTouched();
    this.LoginFormGroup.get('Password').markAsTouched();
  }
}
