import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { FlexLayoutModule } from '@angular/flex-layout';
import {MatSidenavModule} from '@angular/material/sidenav';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { MatListModule } from "@angular/material/list";
import { MenuListItemComponent } from './Layout/menu-list-item/menu-list-item.component';
import {NavService} from './Layout/menu-list-item/nav.service';
import { MatIconModule } from "@angular/material/icon";
import { DeComponent } from './Pages/data-enrich/de.component';
import {MatSelectModule} from '@angular/material/select';
import {MatButtonModule} from '@angular/material/button';
import {MatFormFieldModule} from '@angular/material/form-field';
import {MatInputModule} from '@angular/material/input';
import {MatDatepickerModule} from '@angular/material/datepicker';
import { MatNativeDateModule ,DateAdapter } from '@angular/material/core';
import { DateFormat } from 'src/app/Date/date-format'
import { HttpClientModule } from "@angular/common/http";
import {MatRippleModule} from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ExcelService } from './Services/excel.service';
import { DatePipe } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import {MatRadioModule} from '@angular/material/radio'
import {MatBadgeModule} from '@angular/material/badge'
import {MatCheckboxModule} from '@angular/material/checkbox'
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {MatMenuModule} from '@angular/material/menu';
import { LibraryComponent } from './Pages/library/library.component';
import {MatDialogModule} from '@angular/material/dialog';
import { StopwordsComponent } from './Pages/stopwords/stopwords.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatTabsModule} from '@angular/material/tabs';
import { DeselectComponent } from './Pages/deselect/deselect.component';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {MatAutocompleteModule} from '@angular/material/autocomplete';
import { NounModifierComponent } from './Pages/noun-modifier/noun-modifier.component';
import { FilterPipe } from 'src/app/filter/filter.pipe';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';
import {MatTooltipModule} from '@angular/material/tooltip';
import { LoginComponent } from './Pages/login/login.component';
import { BnNgIdleService } from 'bn-ng-idle';
import { ForgotpasswordComponent } from './Pages/forgotpassword/forgotpassword.component';
import { NewpasswordComponent } from './Pages/newpassword/newpassword.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { CatalogueComponent } from './Pages/catalogue/catalogue.component';
import { PerformanceComponent } from './Pages/performance/performance.component';
import { NgApexchartsModule } from "ng-apexcharts";
import { NgxImgZoomModule } from 'ngx-img-zoom';
import { SafePipe } from './filter/Safepipe';
import { RejectReasonComponent } from './Pages/reject-reason/reject-reason.component';


@NgModule({
  declarations: [
    AppComponent,
    ProjectsComponent,
    MenuListItemComponent, 
    DeComponent,
    LibraryComponent,
    StopwordsComponent,
    DeselectComponent,
    NounModifierComponent, 
    FilterPipe,
    LoginComponent,
    ForgotpasswordComponent,
    NewpasswordComponent,
    SignupComponent,
    CatalogueComponent,
    PerformanceComponent,
    SafePipe,
    RejectReasonComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule, 
    FlexLayoutModule,
    MatSidenavModule,
    MatListModule,
    MatIconModule,
    MatSelectModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatDatepickerModule,
    MatNativeDateModule,
    HttpClientModule,
    MatRippleModule,
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatRadioModule,
    MatIconModule,
    MatBadgeModule,
    MatMenuModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatProgressBarModule,
    MatTableModule,
    MatToolbarModule,
    MatPaginatorModule,
    MatDialogModule,
    MatNativeDateModule,
    MatInputModule,
    MatTabsModule,
    MatCardModule,
    MatSnackBarModule,
    MatAutocompleteModule,
    MatProgressSpinnerModule, 
    MatTooltipModule,
    NgApexchartsModule,
    NgxImgZoomModule
  ],
  providers: [NavService,ExcelService,DatePipe,{ provide: DateAdapter, useClass: DateFormat },BnNgIdleService, SafePipe],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(private dateAdapter: DateAdapter<Date>) {
    dateAdapter.setLocale("en-in"); // DD/MM/YYYY
  }
}
