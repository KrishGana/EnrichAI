import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ValidatorFn, } from '@angular/forms';
import { Router } from '@angular/router';
import { Project, ProjectUpdate } from 'src/app/Models/project-model';
import { EnrichServiceService } from 'src/app/Services/enrich-service.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import * as XLSX from 'xlsx';
import { DatePipe } from '@angular/common';
import { LoginServiceService } from 'src/app/Services/login-service.service';
import { element } from 'protractor';
type AOA = any[][];

@Component({
  selector: 'app-projects',
  templateUrl: './projects.component.html',
  styleUrls: ['./projects.component.scss'],
  animations: [
    trigger('openClose', [
      // ...
      state('open', style({
        transform: 'translateX(0%)'
      })),
      state('closed', style({
        transform: 'translateX(-110%)'
      })),
      transition('open => closed', [
        animate('0.3s')
      ]),
      transition('closed => open', [
        animate('0.3s')
      ]),
    ]),
    trigger('rotate', [
      // ...
      state('open', style({
        transform: 'rotate(-180deg)',
      })),
      state('closed', style({
        transform: 'rotate(0deg)'
      })),

    ]),
  ],
  encapsulation: ViewEncapsulation.None
})
export class ProjectsComponent implements OnInit {
  ProjectList: any[] = [];
  ProjectFormGroup: FormGroup;
  file: File;
  // tslint:disable-next-line:variable-name
  tl_state = true;
  ExcelData: AOA;
  selectedProject: Project;
  FileToUpload: File[] = [];
  isNewProject: boolean;
  isEdit = false;
  isReleased = true;
  // len = 23423;
  previousFile: string;
  projectid = 0;
  projectnamefilter: string[] = [];
  indexproject = 0;
  typetext = '';
  initialDate: any;
  endDate: any;
  formattedDate: Date;
  formattedDateend: Date;
  Roles: any[] = [];
  Isloading = true;
  UserName: string;
  displayselectedproject: string;
  iseditclicked = false;
  createdOn: string;
  constructor(
    private fb: FormBuilder,
    private service: EnrichServiceService,
    private router: Router,
    private _snackBar: MatSnackBar,
    private datePipe: DatePipe,
    public nav: LoginServiceService
  ) {
    this.nav.islogin(true);

  }

  ngOnInit(): void {
    this.UserName = localStorage.getItem('User');
    this.GetRoles(this.UserName);
    this.InitializeProjectFormGroup();
    this.GetAllProjects();
  }

  GetRoles(UserName): void {
    this.service.GetUserRoles(UserName).subscribe(data => {
      this.Roles = data;
      this.Roles.forEach(element1 => {
        localStorage.setItem('UserRole', element1.RoleName);
      });
      console.log(this.Roles);
    });
  }

  setvalues(): void {
    localStorage.setItem('FilterName', 'false');
    console.log(localStorage.getItem('FilterName'));
  }
  InitializeProjectFormGroup(): void {
    this.ProjectFormGroup = this.fb.group({
      ProjectName: ['', Validators.required],
      ProjectManager: ['', Validators.required],
      Plan_Start: [null, [Validators.required, this.dateRangeValidator]],
      Plan_End: [null, [Validators.required, this.dateRangeValidator]],
      Data: [null, Validators.required],
      Document: [null]
    });
  }

  private dateRangeValidator: ValidatorFn = (): {
    [key: string]: any;
  } | null => {
    let invalid = false;
    // tslint:disable-next-line:variable-name
    const Plan_Start = this.ProjectFormGroup && this.ProjectFormGroup.get('Plan_Start').value;
    // tslint:disable-next-line:variable-name
    const Plan_End = this.ProjectFormGroup && this.ProjectFormGroup.get('Plan_End').value;
    if (Plan_Start && Plan_End) {
      invalid = new Date(Plan_Start).valueOf() > new Date(Plan_End).valueOf();
    }
    return invalid ? { invalidRange: { Plan_Start, Plan_End } } : null;
  }

  GetAllProjects(): void {
    this.service.GetAllProjects().subscribe(data => {
      this.ProjectList = data.details;
      this.ProjectList.reverse();
      for (let ind = 0; ind < this.ProjectList.length; ind++) {
        this.projectnamefilter.push(this.ProjectList[ind].ProjectName);
      }
      if (this.ProjectList.length > 0) {
        this.SelectProject(this.ProjectList[0]);
      }
    });
  }

  GetAllProjectsafterupdate(): void {
    this.service.GetAllProjects().subscribe(data => {
      this.ProjectList = data.details;
      this.ProjectList.reverse();
      if (this.ProjectList.length > 0) {
        this.SelectProject(this.ProjectList[this.indexproject]);
      }
    });
  }
  timeline_toggle(): void {
    this.tl_state = !this.tl_state;
  }

  handleFileInput(evt): void {
    if (evt.target.files && evt.target.files.length > 0) {
      this.file = evt.target.files[0];
      const reader: FileReader = new FileReader();
      reader.onload = (e: any) => {
        /* read workbook */
        const bstr: string = e.target.result;
        const wb: XLSX.WorkBook = XLSX.read(bstr, { type: 'binary' });

        /* grab first sheet */
        const wsname: string = wb.SheetNames[0];
        const ws: XLSX.WorkSheet = wb.Sheets[wsname];

        /* save data */
        this.ExcelData = ((XLSX.utils.sheet_to_json(ws)) as AOA);
        this.ProjectFormGroup.get('Data').setValue(this.ExcelData.length);
        // console.log(JSON.stringify(this.ExcelData));
      };
      reader.readAsBinaryString(this.file);
    }
  }

  NewClicked(): void {
    this.isEdit = false;
    this.isReleased = false;
    this.iseditclicked = false;
    this.selectedProject = new Project();
    this.isNewProject = true;
    this.ResetProject();
    this.ProjectFormGroup.enable();
  }

  ResetProject(): void {
    this.ProjectFormGroup.reset();
    this.file = null;
    this.FileToUpload = [];
  }

  SaveClicked(): void {
    this.FileToUpload.push(this.file);
    if (this.ProjectFormGroup.valid) {
      if (this.isNewProject) {
        this.isEdit = !this.isEdit;
        const project = new Project();
        project.ProjectName = this.ProjectFormGroup.get('ProjectName').value;
        project.ProjectManager = this.ProjectFormGroup.get('ProjectManager').value;
        project.Plan_Start = this.ProjectFormGroup.get('Plan_Start').value;
        project.Plan_End = this.ProjectFormGroup.get('Plan_End').value;
        project.Data = this.ProjectFormGroup.get('Data').value;
        project.DocumentName = this.file.name;
        project.table_data = this.ExcelData;
        this.CreateProject(project);
        console.log(this.projectid);
      }
    }
    else {
      this.ShowValidationErrors();
    }
    if (!this.isNewProject) {
      this.isEdit = !this.isEdit;
      this.isReleased = true;
      console.log(this.projectid);
      const projectUpdates = new ProjectUpdate();
      projectUpdates.ProjectID = this.projectid;
      projectUpdates.ProjectName = this.ProjectFormGroup.get('ProjectName').value;
      projectUpdates.StartDate = this.ProjectFormGroup.get('Plan_Start').value;
      projectUpdates.EndDate = this.ProjectFormGroup.get('Plan_End').value;
      projectUpdates.DocumentName = this.file.name;
      projectUpdates.table_data = this.ExcelData;
      this.UpdateProject(projectUpdates);
      this._snackBar.open('Project details updated successfully', '', {
        duration: 4000,
        panelClass: ['snackbarstyle']
      });
    }
  }

  ReleaseClicked(): void {
    const ProjectName = this.ProjectFormGroup.get('ProjectName').value;
    this.router.navigate(['de'], { queryParams: { passingdata: ProjectName } });
  }

  CreateProject(project: Project): void {
    console.log(project);
    this.service.CreateProject(project).subscribe(data => {
      console.log('success', data);
      if (data !== undefined) {
        this._snackBar.open('Project saved successfully', '', {
          duration: 4000,
          panelClass: ['snackbarstyle']
        });
      }
      this.GetAllProjects();
      this.ResetProject();
    }
    );
  }

  UpdateProject(project: ProjectUpdate): void {
    this.service.UpdateProject(project).subscribe(data => {
      console.log('success', data);
      this.GetAllProjectsafterupdate();
      this.ResetProject();
    });
  }

  SelectProject(project: any): void {
    const datestr = project.Plan_Start;
    const dateend = project.Plan_End;
    this.createdOn = project.Plan_Start.split(' ')[0];
    this.isNewProject = false;
    this.iseditclicked = false;
    this.selectedProject = project;
    this.displayselectedproject = this.selectedProject.ProjectName;
    console.log(this.selectedProject);
    this.previousFile = project.DocumentName;
    if (this.isNewProject && this.isEdit) {
      this.isReleased = false;
    }
    else if (!this.isNewProject && this.isEdit) {
      this.isReleased = true;
    }
    else {
      this.isReleased = true;
    }

    for (let ind = 0; ind < this.ProjectList.length; ind++) {
      if (this.projectnamefilter[ind] === this.selectedProject.ProjectName) {
        this.indexproject = ind;
      }
    }
    // this.service.DowloandAttachment(project.ProjectName,project.DocumentName).subscribe(doc=>{
    //   if(doc){
    //     let fileType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet";
    //     const blob = new Blob([doc], { type: fileType });
    //     this.file=new File([blob],project.DocumentName);
    //   }
    // });
    this.initialDate = this.datePipe.transform(datestr, 'yyyy-MM-dd');
    this.formattedDate = this.initialDate;
    this.endDate = this.datePipe.transform(dateend, 'yyyy-MM-dd');
    this.formattedDateend = this.endDate;
    this.projectid = project.Projectid;
    this.ProjectFormGroup.get('ProjectName').setValue(project.ProjectName);
    this.ProjectFormGroup.get('ProjectManager').setValue(project.ProjectManager);
    this.ProjectFormGroup.get('Plan_Start').setValue(this.formattedDate);
    this.ProjectFormGroup.get('Plan_End').setValue(this.formattedDateend);
    // this.ProjectFormGroup.get('Data').setValue(project.Data);
    this.ProjectFormGroup.disable();
  }

  ShowValidationErrors(): void {
    Object.keys(this.ProjectFormGroup.controls).forEach(key => {
      this.ProjectFormGroup.get(key).markAsTouched();
      this.ProjectFormGroup.get(key).markAsDirty();
    });
  }

}
