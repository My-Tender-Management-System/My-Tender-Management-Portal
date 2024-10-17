import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { TenderTeamDto, ITenderTeam } from "../dto/TenderTeam.dto";

type EntityResponseType = HttpResponse<TenderTeamDto>;
type EntityArrayResponseType = HttpResponse<TenderTeamDto[]>;

// @ts-ignore
@Injectable()
export class TenderTeamService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createTenderTeam(
        tenderteam: ITenderTeam
    ): Observable<HttpResponse<TenderTeamDto>> {
        return this.http.post<TenderTeamDto>(
            `${this.resourceUrl}/gateway/tender-app1256/create/tenderteam`,
            tenderteam,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tender-app1256/upload/tenderteam`,
            formData,
            { observe: "response" }
        );
    }

    updateTenderTeam(
        tenderteam: ITenderTeam
    ): Observable<HttpResponse<TenderTeamDto>> {
        return this.http.put<TenderTeamDto>(
            `${this.resourceUrl}/gateway/tender-app1256/update/tenderteam`,
            tenderteam,
            { observe: "response", headers: this.headers }
        );
    }

    deleteTenderTeam(req?: any): Observable<HttpResponse<ITenderTeam>> {
        return this.http.delete<TenderTeamDto>(
            `${this.resourceUrl}/gateway/tender-app1256/delete/tenderteam`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findTenderTeam(req?: any): Observable<HttpResponse<ITenderTeam>> {
        return this.http.get<TenderTeamDto>(
            `${this.resourceUrl}/gateway/tender-app1256/find/tenderteam`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllTenderTeam(params: any): Observable<HttpResponse<TenderTeamDto[]>> {
        return this.http.get<TenderTeamDto[]>(
            `${this.resourceUrl}/gateway/tender-app1256/findall/tenderteam`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tender-app1256/download/tenderteam`,
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
}
