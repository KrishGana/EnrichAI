import { AfterViewInit, Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { NavItem } from './Layout/menu-list-item/nav-item';
import { NavService } from './Layout/menu-list-item/nav.service';
import { MatIconRegistry } from "@angular/material/icon";
import { DomSanitizer } from "@angular/platform-browser";
import { LoginServiceService } from './Services/login-service.service';
import { BnNgIdleService } from 'bn-ng-idle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit,AfterViewInit {
  Isclicked = false
  islogin: any; 
  UserName : string;
  userrole: string;
  setInterval = setInterval;
  navItems: NavItem[] = [];
  
  @ViewChild("appDrawer") appDrawer: ElementRef;
  /**
   *
   */
  constructor( private navService:NavService,
    private matIconRegistry: MatIconRegistry,
    private domSanitizer: DomSanitizer,public nav: LoginServiceService,private bnIdle: BnNgIdleService,private _snackBar:MatSnackBar,private router:Router,public dialog: MatDialog) {
      this.matIconRegistry.addSvgIcon(
        "Project",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Project.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Project_active",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Project_active.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Data_enrich",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Data_enrich.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Data_enrich_active",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Data_enrich_active.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "InActive_Nounmodifier",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/InActive_Nounmodifier.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "InActive_Nounmodifier_active",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Active_Nounmodifier.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Performance",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Performance.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Performance_active",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/active_performance.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Cataloge",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Cataloge.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Cataloge_active",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/active_cataloge.svg")
      );
      this.matIconRegistry.addSvgIcon(
        "Data_enrich",
        this.domSanitizer.bypassSecurityTrustResourceUrl("/assets/images/Data_enrich.svg")
      );
    }
  
  ngOnInit(){
    setInterval(() => this.UserName =  localStorage.getItem('User'),200,1);
    this.navItems=[ 
      {
        route:'projects',
        iconName:'Project',
        isSvgIcon:true,
        displayName:"Projects"
      },
      {
        route:'deselect',
        iconName:'Data_enrich',
        isSvgIcon:true,
        displayName:"Data Enrich"
      },
      {
        route:'noun-modifier',
        iconName:'InActive_Nounmodifier',
        isSvgIcon:true,
        displayName:"Noun Modifier"
      },
      {
        route:'performance',
        iconName:'Performance',
        isSvgIcon:true,
        displayName:"Performance"
      },
      {
        route:'catalogue',
        iconName:'Cataloge',
        isSvgIcon:true,
        displayName:"Catalogue"
      }
    ];
    
    this.nav.changeEmitted$.subscribe(
      value => {
        this.islogin = value;
      });
      this.bnIdle.startWatching(600).subscribe((isTimedOut: boolean) => {
        if (isTimedOut && this.islogin) {
          this.bnIdle.stopTimer()
          this._snackBar.open('Session expired, Please login again', '', {
            duration: 4000,
            panelClass: ['snackbarstyle'],
          });
          setTimeout(() => {
            this.router.navigate(['login']); 
          }, 4000);
        }
      });
  }
  
  ngAfterViewInit() {
    this.navService.appDrawer = this.appDrawer;
  }

  logout(){
    this.Isclicked= true
    this._snackBar.open('Logged out successfully', '', {
      duration: 4000,
      panelClass: ['snackbarstyle'],
    });
    this.router.navigate(['login']); 
  }
}
