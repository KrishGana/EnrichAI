import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { Router } from '@angular/router';
import { LoginServiceService } from 'src/app/Services/login-service.service';
@Component({
  selector: 'app-deselect',
  templateUrl: './deselect.component.html',
  styleUrls: ['./deselect.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class DeselectComponent implements OnInit {
  myControl1 = new FormControl();
  array: any = [];
  items: any = [];

  constructor(public _data_enrich: EnrichServiceService, private router: Router, public nav: LoginServiceService) {
    this.nav.islogin(true);
  }

  ngOnInit() {
    this._data_enrich.GetAllData().subscribe((data) => {
      this.array = data.details;
      for (var i = 0; i < this.array.length; i++) {
        this.items.push({ Name: this.array[i].ProjectName, Value: this.array[i].ProjectName.concat(" : ".toString()).concat(this.array[i].Projectid.toString()) });
      }
    })
  }


  filterItem(event: any) {
    if (!event) { }

    if (typeof event === 'string' && event != "") {
      this.items = [];
      this.items = this.items.filter((a: string) => a["Name"].toLowerCase().startsWith(event.toLowerCase()));
    }
    else {
      this.items = [];
      for (var i = 0; i < this.array.length; i++) {
        this.items.push({ "Name": this.array[i].ProjectName, "Value": this.array[i].ProjectName.concat(" : ".toString()).concat(this.array[i].Projectid.toString()) });
      }
    }
  }

  routetode() {
    this.router.navigate(['de'], { queryParams: { passingdata: this.myControl1.value } });
  }

  routetoproject() {
    this.router.navigate(['projects']);
  }
}
