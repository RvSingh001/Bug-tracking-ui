import { Data } from "@angular/router";

export  class Project {
    public projectId!: string;
    public description!: string;
    public type!: string;
    public projectName!: string;
    public status!: string;
    public createdAt!: Date;
    public lastModified!: Data;
  
}
