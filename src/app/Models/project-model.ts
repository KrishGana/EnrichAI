import { CommonClass } from "./common";

export class Project extends CommonClass{
    ProjectName:string;
    ProjectManager:string;
    Plan_Start:Date | string | null;
    Plan_End :Date | string | null;
    Data:number;
    DocumentName:string;
    table_data:any[];
}
export class ProjectUpdate extends Project{
    ProjectID:number;
    StartDate:Date | string | null;
    EndDate :Date | string | null;
}
export class UpdateEnrichText extends Project{
    NounModifier : string;
    EnrichText : string;
    EnrichPoText : string;
    Material : string;
    Status : string;
    RejectReason: string;
}
export class data_enrich1{ 
    Projectid!:string ;
    ProjectName!:string;
}
export class Noun {
    CodeNM : any;
    NounModifier:any;
    Noun:any;
    Modifier:any;
    attridata : any
    ref:any
}
