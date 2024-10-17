import { HttpClient, HttpResponse } from "@angular/common/http";

import { Injectable } from "@angular/core";

import { Observable } from "rxjs";

import { environment } from "../environments/environment";

import { OtherPaymentsDto, IOtherPayments } from "../dto/OtherPayments.dto";

type EntityResponseType = HttpResponse<OtherPaymentsDto>;

type EntityArrayResponseType = HttpResponse<OtherPaymentsDto[]>;

// @ts-ignore

@Injectable()
export class OtherPaymentsService {
    resourceUrl = environment.serverUrl;

    resourceUrl1 = environment.paymentUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) { }

    createOtherPayments(

        otherpayments: IOtherPayments

    ): Observable<HttpResponse<OtherPaymentsDto>> {

        return this.http.post<OtherPaymentsDto>(

            `${this.resourceUrl}/gateway/payment-app1261/api/CreateOtherPayments`,

            otherpayments,

            { observe: "response", headers: this.headers }

        );

    }

    // createOtherPayments(
    //     otherpayments: IOtherPayments
    // ): Observable<HttpResponse<OtherPaymentsDto>> {
    //     return this.http.post<OtherPaymentsDto>(
    //         `${this.resourceUrl1}/Payment/api/CreateOtherPayments`,

    //         otherpayments,

    //         { observe: "response", headers: this.headers }
    //     );
    // }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {

        return this.http.post(

            `${this.resourceUrl}/gateway/payment-app1261/api/UploadOtherPayments`,

            formData,

            { observe: "response" }

        );

    }

    // uploadFile(formData: FormData): Observable<HttpResponse<any>> {
    //     return this.http.post(
    //         `${this.resourceUrl1}/Payment/api/UploadOtherPayments`,

    //         formData,

    //         { observe: "response" }
    //     );
    // }

    updateOtherPayments(

        otherpayments: IOtherPayments

    ): Observable<HttpResponse<OtherPaymentsDto>> {

        return this.http.put<OtherPaymentsDto>(

            `${this.resourceUrl}/gateway/payment-app1261/api/UpdateOtherPayments`,

            otherpayments,

            { observe: "response", headers: this.headers }

        );

    }

    // updateOtherPayments(
    //     otherpayments: IOtherPayments
    // ): Observable<HttpResponse<OtherPaymentsDto>> {
    //     return this.http.put<OtherPaymentsDto>(
    //         `${this.resourceUrl1}/Payment/api/UpdateOtherPayments`,

    //         otherpayments,

    //         { observe: "response", headers: this.headers }
    //     );
    // }

    deleteOtherPayments(req?: any): Observable<HttpResponse<IOtherPayments>> {
        return this.http.delete<OtherPaymentsDto>(
            `${this.resourceUrl}/gateway/payment-app1261/api/DeleteOtherPayments`,

            { params: req, observe: "response", headers: this.headers }
        );
    }

    // deleteOtherPayments(req?: any): Observable<HttpResponse<IOtherPayments>> {

    //     return this.http.delete<OtherPaymentsDto>(

    //         `${this.resourceUrl1}/Payment/api/DeleteOtherPayments`,

    //         { params: req, observe: "response", headers: this.headers }

    //     );

    // }

    findOtherPayments(req?: any): Observable<HttpResponse<IOtherPayments>> {
        return this.http.get<OtherPaymentsDto>(
            `${this.resourceUrl}/gateway/payment-app1261/api/find/otherpayments`,

            { params: req, observe: "response", headers: this.headers }
        );
    }

    // findOtherPayments(req?: any): Observable<HttpResponse<IOtherPayments>> {

    //     return this.http.get<OtherPaymentsDto>(

    //         `${this.resourceUrl1}/Payment/api/FindOtherPayments`,

    //         { params: req, observe: "response", headers: this.headers }

    //     );

    // }

    findAllOtherPayments(
        params: any
    ): Observable<HttpResponse<OtherPaymentsDto[]>> {
        return this.http.get<OtherPaymentsDto[]>(
            `${this.resourceUrl}/gateway/payment-app1261/api/findall/otherpayments`,

            { params, observe: "response", headers: this.headers }
        );
    }

    // findAllOtherPayments(

    //     params: any

    // ): Observable<HttpResponse<OtherPaymentsDto[]>> {

    //     return this.http.get<OtherPaymentsDto[]>(

    //         `${this.resourceUrl1}/Payment/api/FindallOtherPayments`,

    //         { params, observe: "response", headers: this.headers }

    //     );

    // }

    downloadFile(): Observable<HttpResponse<Blob>> {

        return this.http.get(

            `${this.resourceUrl}/gateway/payment-app1261/api/DownloadOtherPayments`,

            { observe: "response", responseType: "blob" }

        );

    }

    // downloadFile(): Observable<HttpResponse<Blob>> {
    //     return this.http.get(
    //         `${this.resourceUrl1}/Payment/api/DownloadOtherPayments`,

    //         { observe: "response", responseType: "blob" }
    //     );
    // }

    fileUpload(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `https://filedrop.cgaas.ai/FileMangerService/api/UploadToLocal`,

            formData,

            { observe: "response" }
        );
    }

    findAllIfOtherPaymentsByTenderId(
        params: any
    ): Observable<HttpResponse<OtherPaymentsDto[]>> {
        return this.http.get<OtherPaymentsDto[]>(
            `${this.resourceUrl}/gateway/payment-app1261/api/findallif/otherpaymentsbytenderid/tenderid`,

            { params, observe: "response", headers: this.headers }
        );
    }

    // findAllIfOtherPaymentsByTenderId(

    //     params: any

    // ): Observable<HttpResponse<OtherPaymentsDto[]>> {

    //     return this.http.get<OtherPaymentsDto[]>(

    //         ` http://127.0.0.1:8882/Payment/api/FindallifOtherPaymentsByTenderId/TenderId`,

    //         { params, observe: "response", headers: this.headers }

    //     );

    // }
}
