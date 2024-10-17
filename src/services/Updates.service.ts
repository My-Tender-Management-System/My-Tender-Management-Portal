import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { UpdatesDto, IUpdates } from "../dto/Updates.dto";

type EntityResponseType = HttpResponse<UpdatesDto>;
type EntityArrayResponseType = HttpResponse<UpdatesDto[]>;

// @ts-ignore
@Injectable()
export class UpdatesService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createUpdates(updates: IUpdates): Observable<HttpResponse<UpdatesDto>> {
        return this.http.post<UpdatesDto>(
            `${this.resourceUrl}/gateway/tender-app1256/create/updates`,
            updates,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tender-app1256/upload/updates`,
            formData,
            { observe: "response" }
        );
    }

    updateUpdates(updates: IUpdates): Observable<HttpResponse<UpdatesDto>> {
        return this.http.put<UpdatesDto>(
            `${this.resourceUrl}/gateway/tender-app1256/update/updates`,
            updates,
            { observe: "response", headers: this.headers }
        );
    }

    deleteUpdates(req?: any): Observable<HttpResponse<IUpdates>> {
        return this.http.delete<UpdatesDto>(
            `${this.resourceUrl}/gateway/tender-app1256/delete/updates`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findUpdates(req?: any): Observable<HttpResponse<IUpdates>> {
        return this.http.get<UpdatesDto>(
            `${this.resourceUrl}/gateway/tender-app1256/find/updates`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllUpdates(params: any): Observable<HttpResponse<UpdatesDto[]>> {
        return this.http.get<UpdatesDto[]>(
            `${this.resourceUrl}/gateway/tender-app1256/findall/updates`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tender-app1256/download/updates`,
            { observe: "response", responseType: "blob" }
        );
    }

    fileUpload(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal`,
            formData,
            { observe: "response" }
        );
    }

    findIfUpdatesByTenderId(params: any): Observable<HttpResponse<UpdatesDto>> {
        return this.http.get<UpdatesDto>(
            `${this.resourceUrl}/gateway/tender-app1256/findif/updatesbytenderid/tenderid`,
            { params, observe: "response", headers: this.headers }
        );
    }
}
