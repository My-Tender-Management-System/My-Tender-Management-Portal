import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { BidBondDto, IBidBond } from "../dto/BidBond.dto";

type EntityResponseType = HttpResponse<BidBondDto>;
type EntityArrayResponseType = HttpResponse<BidBondDto[]>;

// @ts-ignore
@Injectable()
export class BidBondService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createBidBond(bidbond: IBidBond): Observable<HttpResponse<BidBondDto>> {
        return this.http.post<BidBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/create/bidbond`,
            bidbond,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/payment-app1261/upload/bidbond`,
            formData,
            { observe: "response" }
        );
    }

    updateBidBond(bidbond: IBidBond): Observable<HttpResponse<BidBondDto>> {
        return this.http.put<BidBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/update/bidbond`,
            bidbond,
            { observe: "response", headers: this.headers }
        );
    }

    deleteBidBond(req?: any): Observable<HttpResponse<IBidBond>> {
        return this.http.delete<BidBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/delete/bidbond`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findBidBond(req?: any): Observable<HttpResponse<IBidBond>> {
        return this.http.get<BidBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/find/bidbond`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllBidBond(params: any): Observable<HttpResponse<BidBondDto[]>> {
        return this.http.get<BidBondDto[]>(
            `${this.resourceUrl}/gateway/payment-app1261/findall/bidbond`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/payment-app1261/download/bidbond`,
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

    findIfBidBondByTenderId(params: any): Observable<HttpResponse<BidBondDto>> {
        return this.http.get<BidBondDto>(
            `${this.resourceUrl}/gateway/payment-app1261/findif/bidbondbytenderid/tenderid`,
            { params, observe: "response", headers: this.headers }
        );
    }
}
