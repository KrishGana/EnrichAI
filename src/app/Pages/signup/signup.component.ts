import { Component, OnInit } from '@angular/core';
import { FormGroup , Validators , FormBuilder, FormControl} from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';

export class Sign{
  UserName : string
  EmailId : string
  Mobile : number
  Password : string
}

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss']
})
export class SignupComponent implements OnInit {
  SignupGroup : FormGroup;
  ForgotPassword = new FormControl()
  signup : Sign;
  Email : string = undefined
  constructor(private fb : FormBuilder,
    private Service : EnrichServiceService,
    public nav: LoginServiceService,
    private router:Router, private _snackBar:MatSnackBar,private route: ActivatedRoute) { 
      this.nav.islogin(false);
    }

  ngOnInit(): void {
     this.InitializeForm()
  }

  backtologin(){
    this.router.navigate(['login']);
  }

  InitializeForm(){
     this.SignupGroup = this.fb.group({
        UserName : ['',Validators.required],
        EmailId : ['',[Validators.required,Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")]],
        Mobile : ['',[Validators.required,Validators.pattern('^((\\+91-?)|0)?[0-9]{10}$')]],
        Password :['',[Validators.required,Validators.pattern('(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[$@$!%*?&])[A-Za-z\d$@$!%*?&].{8,}')]]
     })
  }

  SignUp(){
      if(this.SignupGroup.valid){
            const val =  new Sign()
            val.UserName = this.SignupGroup.get('UserName').value
            val.EmailId = this.SignupGroup.get('EmailId').value
            val.Mobile = this.SignupGroup.get('Mobile').value
            val.Password = this.SignupGroup.get('Password').value
            this.signup = val;
           console.log( this.signup )
           this.router.navigate(['login'])
      }
      else{
        this.showvalidationerror()
      }
  }

  showvalidationerror(){
    this.SignupGroup.get('UserName').markAsTouched();
    this.SignupGroup.get('EmailId').markAsTouched();
    this.SignupGroup.get('Mobile').markAsTouched();
    this.SignupGroup.get('Password').markAsTouched();
  }

}
