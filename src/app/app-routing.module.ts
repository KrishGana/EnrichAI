import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CatalogueComponent } from './Pages/catalogue/catalogue.component';
import { DeComponent } from './Pages/data-enrich/de.component';
import { DeselectComponent } from './Pages/deselect/deselect.component';
import { ForgotpasswordComponent } from './Pages/forgotpassword/forgotpassword.component';
import { LibraryComponent } from './Pages/library/library.component';
import { LoginComponent } from './Pages/login/login.component';
import { NewpasswordComponent } from './Pages/newpassword/newpassword.component';
import { NounModifierComponent } from './Pages/noun-modifier/noun-modifier.component';
import { PerformanceComponent } from './Pages/performance/performance.component';
import { ProjectsComponent } from './Pages/projects/projects.component';
import { SignupComponent } from './Pages/signup/signup.component';
import { StopwordsComponent } from './Pages/stopwords/stopwords.component';

const routes: Routes = [
  {
    path:'login',
    component:LoginComponent
  },
  {
    path:'projects',
    component:ProjectsComponent
  },
  {
    path:'de',
    component:DeComponent
  },
  {
    path:'library',
    component:LibraryComponent
  },
  {
    path:'stopwords',
    component:StopwordsComponent
  },
  {
    path:'deselect',
    component:DeselectComponent
  },
  {
    path:'noun-modifier',
    component:NounModifierComponent
  },
  {
    path:'forgotpassword',
    component:ForgotpasswordComponent
  },
  {
    path:'newpassword',
    component:NewpasswordComponent
  },
  {
    path:'signup',
    component:SignupComponent
  },
  {
    path:'performance',
    component:PerformanceComponent
  },
  {
    path:'catalogue',
    component:CatalogueComponent
  },
  {
    path:'**',
    redirectTo:'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ useHash: true })],
  exports: [RouterModule]
})
export class AppRoutingModule { }
