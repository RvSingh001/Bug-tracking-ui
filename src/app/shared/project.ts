import { Data } from "@angular/router";

export  class Project {
    public projectId!: string;
    public description!: String;
    public type!: String;
    public projectName!: String;
    public status!: String;
    public createdAt!: Date;
    public lastModified!: Data;
    public createdBy!: String;
}
