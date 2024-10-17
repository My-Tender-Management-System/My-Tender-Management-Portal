import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
    OtherRequirementsDto,
    IOtherRequirements,
} from "../dto/OtherRequirements.dto";

type EntityResponseType = HttpResponse<OtherRequirementsDto>;
type EntityArrayResponseType = HttpResponse<OtherRequirementsDto[]>;

// @ts-ignore
@Injectable()
export class OtherRequirementsService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createOtherRequirements(
        otherrequirements: IOtherRequirements
    ): Observable<HttpResponse<OtherRequirementsDto>> {
        return this.http.post<OtherRequirementsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/create/otherrequirements`,
            otherrequirements,
            { observe: "response", headers: this.headers }
        );
    }

    // createOtherRequirements(
    //     otherrequirements: IOtherRequirements
    // ): Observable<HttpResponse<OtherRequirementsDto>> {
    //     return this.http.post<OtherRequirementsDto>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/CreateOtherRequirements`,
    //         otherrequirements,
    //         { observe: "response", headers: this.headers }
    //     );
    // }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/upload/otherrequirements`,
            formData,
            { observe: "response" }
        );
    }

    updateOtherRequirements(
        otherrequirements: IOtherRequirements
    ): Observable<HttpResponse<OtherRequirementsDto>> {
        return this.http.put<OtherRequirementsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/update/otherrequirements`,
            otherrequirements,
            { observe: "response", headers: this.headers }
        );
    }

    deleteOtherRequirements(
        req?: any
    ): Observable<HttpResponse<IOtherRequirements>> {
        return this.http.delete<OtherRequirementsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/delete/otherrequirements`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findOtherRequirements(
        req?: any
    ): Observable<HttpResponse<IOtherRequirements>> {
        return this.http.get<OtherRequirementsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/find/otherrequirements`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllOtherRequirements(
        params: any
    ): Observable<HttpResponse<OtherRequirementsDto[]>> {
        return this.http.get<OtherRequirementsDto[]>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/findall/otherrequirements`,
            { params, observe: "response", headers: this.headers }
        );
    }

    // findAllOtherRequirements(
    //     params: any
    // ): Observable<HttpResponse<OtherRequirementsDto[]>> {
    //     return this.http.get<OtherRequirementsDto[]>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/FindallOtherRequirements`,
    //         { params, observe: "response", headers: this.headers }
    //     );
    // }

    

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/download/otherrequirements`,
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

    findAllIfOtherRequirementsByTenderId(
        params: any
    ): Observable<HttpResponse<OtherRequirementsDto[]>> {
        return this.http.get<OtherRequirementsDto[]>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/findallif/otherrequirementsbytenderid/tenderid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    // findAllIfOtherRequirementsByTenderId(
    //     params: any
    // ): Observable<HttpResponse<OtherRequirementsDto[]>> {
    //     return this.http.get<OtherRequirementsDto[]>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/FindallifOtherRequirementsByTenderId/TenderId`,
    //         { params, observe: "response", headers: this.headers }
    //     );
    // }
}
