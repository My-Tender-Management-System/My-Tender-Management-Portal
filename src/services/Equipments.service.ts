import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { EquipmentsDto, IEquipments } from "../dto/Equipments.dto";

type EntityResponseType = HttpResponse<EquipmentsDto>;
type EntityArrayResponseType = HttpResponse<EquipmentsDto[]>;

// @ts-ignore
@Injectable()
export class EquipmentsService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createEquipments(
        equipments: IEquipments
    ): Observable<HttpResponse<EquipmentsDto>> {
        return this.http.post<EquipmentsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/create/equipments`,
            equipments,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/upload/equipments`,
            formData,
            { observe: "response" }
        );
    }

    updateEquipments(
        equipments: IEquipments
    ): Observable<HttpResponse<EquipmentsDto>> {
        return this.http.put<EquipmentsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/update/equipments`,
            equipments,
            { observe: "response", headers: this.headers }
        );
    }

    deleteEquipments(req?: any): Observable<HttpResponse<IEquipments>> {
        return this.http.delete<EquipmentsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/delete/equipments`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findEquipments(req?: any): Observable<HttpResponse<IEquipments>> {
        return this.http.get<EquipmentsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/find/equipments`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllEquipments(params: any): Observable<HttpResponse<EquipmentsDto[]>> {
        return this.http.get<EquipmentsDto[]>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/findall/equipments`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/download/equipments`,
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
