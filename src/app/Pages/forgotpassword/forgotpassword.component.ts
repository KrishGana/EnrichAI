import { trigger, transition, style, animate, keyframes } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormGroup, Validators, FormBuilder, FormControl } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { LoginServiceService } from 'src/app/Services/login-service.service';
export class Mail {
  Email: string
}
@Component({
  selector: 'app-forgotpassword',
  templateUrl: './forgotpassword.component.html',
  styleUrls: ['./forgotpassword.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [
    trigger('fade', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate(200, style({ opacity: 1 })),
        animate('450ms ease-out', keyframes([
          style({ transform: 'translateX(0px)', offset: 0 }),
          style({ transform: 'translateX(3.5px)', offset: 0.2 }),
          style({ transform: 'translateX(-2.25px)', offset: 0.4 }),
          style({ transform: 'translateX(1.25px)', offset: 0.6 }),
          style({ transform: 'translateX(-.5px)', offset: 0.8 }),
          style({ transform: 'translateX(0px)', offset: 1.0 }),
        ]))
      ]),
    ])
  ]
})
export class ForgotpasswordComponent implements OnInit {
  ForgotPassword = new FormControl()
  Emails: Mail;
  Email: string = undefined
  constructor(private fb: FormBuilder,
    private Service: EnrichServiceService,
    public nav: LoginServiceService,
    private router: Router, private _snackBar: MatSnackBar, private route: ActivatedRoute) {
    this.nav.islogin(false);
  }

  ngOnInit(): void {
    this.ForgotPassword.setValidators([Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$")])
  }

  backtologin() {
    this.router.navigate(['login']);
  }
 
  SendMail() {
    this.Email = this.ForgotPassword.value
    const m = new Mail()
    m.Email = this.ForgotPassword.value
    console.log(m)
    if (this.ForgotPassword.valid) {
      this.Service.EmailPassword(m).subscribe(data => {
        console.log(data)
        if (data) {
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

  showvalidationerror() {
    this.ForgotPassword.markAsTouched()
    if (this.Email) {
      this._snackBar.open('Please enter the valid Email Id', '', {
        duration: 4000,
        panelClass: ['snackbarstyle'],
      });
    }
  }

  reset() {
    this.ForgotPassword.reset()
  }
}
