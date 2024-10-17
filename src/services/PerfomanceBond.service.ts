import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { PerfomanceBondDto, IPerfomanceBond } from "../dto/PerfomanceBond.dto";

type EntityResponseType = HttpResponse<PerfomanceBondDto>;
type EntityArrayResponseType = HttpResponse<PerfomanceBondDto[]>;

// @ts-ignore
@Injectable()
export class PerfomanceBondService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createPerfomanceBond(
        perfomancebond: IPerfomanceBond
    ): Observable<HttpResponse<PerfomanceBondDto>> {
        return this.http.post<PerfomanceBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/create/perfomancebond`,
            perfomancebond,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/payment-app1261/upload/perfomancebond`,
            formData,
            { observe: "response" }
        );
    }

    updatePerfomanceBond(
        perfomancebond: IPerfomanceBond
    ): Observable<HttpResponse<PerfomanceBondDto>> {
        return this.http.put<PerfomanceBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/update/perfomancebond`,
            perfomancebond,
            { observe: "response", headers: this.headers }
        );
    }

    deletePerfomanceBond(req?: any): Observable<HttpResponse<IPerfomanceBond>> {
        return this.http.delete<PerfomanceBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/delete/perfomancebond`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findPerfomanceBond(req?: any): Observable<HttpResponse<IPerfomanceBond>> {
        return this.http.get<PerfomanceBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/find/perfomancebond`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllPerfomanceBond(
        params: any
    ): Observable<HttpResponse<PerfomanceBondDto[]>> {
        return this.http.get<PerfomanceBondDto[]>(
            `${this.resourceUrl}/gateway/payment-app1261/findall/perfomancebond`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/payment-app1261/download/perfomancebond`,
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

    findIfPerfomanceBondByTenderId(
        params: any
    ): Observable<HttpResponse<PerfomanceBondDto>> {
        return this.http.get<PerfomanceBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/findif/perfomancebondbytenderid/tenderid`,
            { params, observe: "response", headers: this.headers }
        );
    }
}
