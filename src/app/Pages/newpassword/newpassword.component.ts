import { Component, OnInit } from '@angular/core';
import { FormGroup , Validators , FormBuilder} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';
export class LoginInto{
  Email : string
  NewPassword  : string
  ConfirmPassword  : string
}
@Component({
  selector: 'app-newpassword',
  templateUrl: './newpassword.component.html',
  styleUrls: ['./newpassword.component.scss']
})
export class NewpasswordComponent implements OnInit {
  hide = true;
  hide1 = true
  LoginFormGroup : FormGroup
  EmailId: any = undefined;
  sub: any;
  constructor(private fb : FormBuilder, private Service : EnrichServiceService,
    public nav: LoginServiceService,
    private router:Router, private _snackBar:MatSnackBar,private route: ActivatedRoute) {
        this.nav.islogin(false);
     }

  ngOnInit(): void {
    this.InitializeFormGroup();
    this.sub=this.route.queryParams.subscribe(params =>{
      this.EmailId = params
   })
    console.log(this.EmailId.Email)
  }
  InitializeFormGroup():void{
    this.LoginFormGroup = this.fb.group({
      Newpassword : ['',[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]],
      Confirmpassword : ['',[Validators.required, Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
   })
  }

  forgotpass(){
    this.router.navigate(['forgotpassword']);
  }

  Submit(){ 
    const log = new LoginInto()
    log.Email = this.EmailId.Email
    log.NewPassword = this.LoginFormGroup.get('Newpassword').value
    log.ConfirmPassword = this.LoginFormGroup.get('Confirmpassword').value
    if (this.LoginFormGroup.valid) {
      this.Service.ChangePassword(log).subscribe(data => {
        console.log(data)
        if (data) {
          this._snackBar.open('Password has been changed successfully', '', {
            duration: 4000,
            panelClass: ['snackbarstyle'],
          });
          setTimeout(() => {
            this.router.navigate(['login']); 
          }, 2000);  
        }
      },
        (err) => {
          this._snackBar.open('Newpassword does not match with confirm password,check again', '', {
            duration: 4000,
            panelClass: ['doesnotwork']
          });
        })
      console.log(log)
    }
    else {
      this.showerror()  
    }
  }

  showerror(){
      this.LoginFormGroup.get('Newpassword').markAsTouched();
      this.LoginFormGroup.get('Confirmpassword').markAsTouched();
  }
}
