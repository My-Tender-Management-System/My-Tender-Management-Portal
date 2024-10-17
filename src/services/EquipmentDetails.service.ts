import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import {
    EquipmentDetailsDto,
    IEquipmentDetails,
} from "../dto/EquipmentDetails.dto";

type EntityResponseType = HttpResponse<EquipmentDetailsDto>;
type EntityArrayResponseType = HttpResponse<EquipmentDetailsDto[]>;

// @ts-ignore
@Injectable()
export class EquipmentDetailsService {
    resourceUrl = environment.serverUrl;
    // resourceUrl1 = environment.TenderserverUrl1;


    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createEquipmentDetails(
        equipmentdetails: IEquipmentDetails
    ): Observable<HttpResponse<EquipmentDetailsDto>> {
        return this.http.post<EquipmentDetailsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/create/equipmentdetails`,
            equipmentdetails,
            { observe: "response", headers: this.headers }
        );
    }

    // createEquipmentDetails(
    //     equipmentdetails: IEquipmentDetails
    // ): Observable<HttpResponse<EquipmentDetailsDto>> {
    //     return this.http.post<EquipmentDetailsDto>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/CreateEquipmentDetails`,
    //         equipmentdetails,
    //         { observe: "response", headers: this.headers }
    //     );
    // }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/upload/equipmentdetails`,
            formData,
            { observe: "response" }
        );
    }

    updateEquipmentDetails(
        equipmentdetails: IEquipmentDetails
    ): Observable<HttpResponse<EquipmentDetailsDto>> {
        return this.http.put<EquipmentDetailsDto>(
             `${this.resourceUrl}/gateway/tenderrequirement-app1260/update/equipmentdetails`,
            equipmentdetails,
            { observe: "response", headers: this.headers }
        );
    }

    deleteEquipmentDetails(
        req?: any
    ): Observable<HttpResponse<IEquipmentDetails>> {
        return this.http.delete<EquipmentDetailsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/delete/equipmentdetails`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    // deleteEquipmentDetails(
    //     req?: any
    // ): Observable<HttpResponse<IEquipmentDetails>> {
    //     return this.http.delete<EquipmentDetailsDto>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/DeleteEquipmentDetails`,
    //         { params: req, observe: "response", headers: this.headers }
    //     );
    // }

    findEquipmentDetails(
        req?: any
    ): Observable<HttpResponse<IEquipmentDetails>> {
        return this.http.get<EquipmentDetailsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/find/equipmentdetails`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllEquipmentDetails(
        params: any
    ): Observable<HttpResponse<EquipmentDetailsDto[]>> {
        return this.http.get<EquipmentDetailsDto[]>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/findall/equipmentdetails`,
            { params, observe: "response", headers: this.headers }
        );
    }

    // findAllEquipmentDetails(
    //     params: any
    // ): Observable<HttpResponse<EquipmentDetailsDto[]>> {
    //     return this.http.get<EquipmentDetailsDto[]>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/FindallEquipmentDetails`,
    //         { params, observe: "response", headers: this.headers }
    //     );
    // }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/download/equipmentdetails`,
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

    findIfEquipmentDetailsByTenderId(
        params: any
    ): Observable<HttpResponse<EquipmentDetailsDto>> {
        return this.http.get<EquipmentDetailsDto>(
            `${this.resourceUrl}/gateway/tenderrequirement-app1260/findif/equipmentdetailsbytenderid/tenderid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    // findIfEquipmentDetailsByTenderId(
    //     params: any
    // ): Observable<HttpResponse<EquipmentDetailsDto>> {
    //     return this.http.get<EquipmentDetailsDto>(
    //         `http://127.0.0.1:8881/TenderRequirement/api/FindEquipmentDetailsByTenderId/TenderId`,
    //         { params, observe: "response", headers: this.headers }
    //     );
    // }
}
