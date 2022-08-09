import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, throwError } from 'rxjs';
import { environment } from 'src/environments/environment';
import { Project, ProjectUpdate, data_enrich1 } from '../Models/project-model';
import { catchError } from 'rxjs/operators';
import { UpdateEnrichText, Noun } from 'src/app/Models/project-model';
import { Mail } from '../Pages/forgotpassword/forgotpassword.component';

@Injectable({
  providedIn: 'root'
})
export class EnrichServiceService {
  baseAddress = 'http://192.168.0.25';
  httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  };
  // tslint:disable-next-line:variable-name
  constructor(private _httpClient: HttpClient) {
    // this.baseAddress = environment.baseAddress;
  }
  // Error Handler
  errorHandler(error: HttpErrorResponse): Observable<string> {
    // tslint:disable-next-line:max-line-length
    return throwError(error.error instanceof Object ? error.error.Message ? error.error.Message : error.error : error.error || error.message || 'Server Error');
  }

  CreateProject(project: Project): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/mr/CREATE_PROJECT`, project, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  UpdateProject(project: ProjectUpdate): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/ProjectNameChange`, project, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  UpdateEnrichDataText(projectupdate: UpdateEnrichText): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/ProjectChangeStatus`, projectupdate, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  GetAllProjects(): Observable<any> {
    return this._httpClient.get(`${this.baseAddress}/mr/PROJECT_DETAIL`)
      .pipe(catchError(this.errorHandler));
  }
  GetAllData(): Observable<any> {
    return this._httpClient.get<any>(`${this.baseAddress}/mr/PROJECT_DETAIL`)
      .pipe(catchError(this.errorHandler)); // filter
  }
  GetRequiredProjectDetails(ProjectName: string): Observable<any> {
    return this._httpClient.get(`${this.baseAddress}/mr/RELEASE_PROJECT?ProjectName=${ProjectName}`)
      .pipe(catchError(this.errorHandler));
  }
  UploadAttachment(ProjectName: string, selectedFiles: File[], perviousFileName = null): Observable<any> {
    const formData: FormData = new FormData();
    if (selectedFiles && selectedFiles.length) {
      selectedFiles.forEach(x => {
        formData.append(x.name, x, x.name);
      });
    }
    formData.append('ProjectName', ProjectName);
    formData.append('PerviousFileName', perviousFileName);
    return this._httpClient.post<any>(`${this.baseAddress}/api/Enrich/UploadAttachment`,
      formData,
    ).pipe(catchError(this.errorHandler));
  }

  GetAllData1(): Observable<any> {
    return this._httpClient.get<any>(`${this.baseAddress}/vp/ReadNMList`);
  }
  UpdateNoun(data: any): Observable<Noun | any> {
    return this._httpClient.post<Noun>(`${this.baseAddress}/vp/NMStatusUpdate`, data, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  GetAttributesData(cdnm: Noun): Observable<Noun | any> {
    return this._httpClient.post<Noun>(`${this.baseAddress}/vp/AttributesList `, cdnm);
  }
  GetNewText(data: any): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/Library?`, data, this.httpOptions)    // library
      .pipe(catchError(this.errorHandler));
  }
  GetNewTextStop(data: any): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/STOPWORDS?`, data, this.httpOptions)  // stopwords
      .pipe(catchError(this.errorHandler));
  }

  LoginIntoEnrichAI(Login: any): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/LoginDetail`, Login, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  GetUserRoles(UserName: string): Observable<any> {
    return this._httpClient.get<any>(`${this.baseAddress}/vp/RoleDetail?UserName=${UserName}`)
      .pipe(catchError(this.errorHandler));
  }

  GetEnrichTexts(ProjectName: string): Observable<any> {
    return this._httpClient.get(`${this.baseAddress}/mr/ENRICH_MASTER?ProjectName=${ProjectName}`)
      .pipe(catchError(this.errorHandler));
  }

  EmailPassword(Email: Mail): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/Sendlink`, Email, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }

  ChangePassword(Passwords: any): Observable<any> {
    return this._httpClient.post(`${this.baseAddress}/vp/UpdatePassword`, Passwords, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  SearchData(SearchString:any):Observable<any>{
    return this._httpClient.post(`http://127.0.0.1:5000/SearchMaterial`, SearchString, this.httpOptions)
      .pipe(catchError(this.errorHandler));
  }
  // DowloandAttachment(ProjectName: string,DocumentName:string): Observable<Blob | string> {
  // tslint:disable-next-line:max-line-length
  //   return this._httpClient.get(`${this.baseAddress}api/Enrich/DowloandAttachment?ProjectName=${ProjectName}&DocumentName=${DocumentName}`, {
  //     responseType: 'blob',
  //     headers: new HttpHeaders().append('Content-Type', 'application/json')
  //   })
  //     .pipe(catchError(this.errorHandler));
  // }
}
