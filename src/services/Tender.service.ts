import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { TenderDto, ITender } from "../dto/Tender.dto";

type EntityResponseType = HttpResponse<TenderDto>;
type EntityArrayResponseType = HttpResponse<TenderDto[]>;

export interface CompletionPercentageResponse {
    completionPercentage: number;
}

export interface CompletionPercentageForTenderIdResponse {
    CompletionPercentageForTenderIdResponse: number;
}

// @ts-ignore
@Injectable()
export class TenderService {
    resourceUrl = environment.serverUrl;
    // resourceUrl1 = environment.TenderserverUrl1

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createTender(tender: ITender): Observable<HttpResponse<TenderDto>> {
        return this.http.post<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/create/tender`,
            tender,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/tender-app1256/upload/tender`,
            formData,
            { observe: "response" }
        );
    }

    updateTender(tender: ITender): Observable<HttpResponse<TenderDto>> {
        return this.http.put<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/update/tender`,
            tender,
            { observe: "response", headers: this.headers }
        );
    }

    deleteTender(req?: any): Observable<HttpResponse<ITender>> {
        return this.http.delete<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/delete/tender`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findTender(req?: any): Observable<HttpResponse<ITender>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/find/tender`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllTender(params: any): Observable<HttpResponse<TenderDto[]>> {
        return this.http.get<TenderDto[]>(
            `${this.resourceUrl}/gateway/tender-app1256/findall/tender`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/tender-app1256/download/tender`,
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

    findIfTenderByUpdatesId(params: any): Observable<HttpResponse<TenderDto>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/findif/tenderbyupdatesid/updatesid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    findIfGlobalTenderByBidBondId(
        params: any
    ): Observable<HttpResponse<TenderDto>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/payment-app1261/findif_global/tenderbybidbondid/bidbondid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    findIfTenderByBidBondId(params: any): Observable<HttpResponse<TenderDto>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/findif/tenderbybidbondid/bidbondid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    findIfGlobalTenderByPerfomanceBondId(
        params: any
    ): Observable<HttpResponse<TenderDto>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/payment-app1261/findif_global/tenderbyperfomancebondid/perfomancebondid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    findIfTenderByPerfomanceBondId(
        params: any
    ): Observable<HttpResponse<TenderDto>> {
        return this.http.get<TenderDto>(
            `${this.resourceUrl}/gateway/tender-app1256/findif/tenderbyperfomancebondid/perfomancebondid`,
            { params, observe: "response", headers: this.headers }
        );
    }

    GetTenderNotification(
        tenderId: string
    ): Observable<HttpResponse<CompletionPercentageResponse>> {
        // Pass the tenderId in the params as an object
        const params = { TenderId: tenderId }; // Correct way to pass query parameter
        return this.http.get<CompletionPercentageResponse>(
            `http://localhost:8881/TenderRequirement/api/GetNotifications`,
            { params, observe: "response", headers: this.headers }
        );

        // ?TenderId=Ten-018
    }

    GetTenderCompletionPercentageByTenderId(
        tenderId: string
      ): Observable<HttpResponse<{ CompletionPercentageForTenderIdResponse: number }>> {
        const params = { TenderId: tenderId };
        return this.http.get<{ CompletionPercentageForTenderIdResponse: number }>(
          `http://localhost:8881/TenderRequirement/api/CalculatePercentage`,
          {
            params,
            observe: "response",
            headers: this.headers,
          }
        );
      }

      generateTenderPDF(tenderId: string): Observable<HttpResponse<Blob>> {
        const params = { tenderid: tenderId };
        return this.http.get<Blob>(
            `http://localhost:8888/Tender/api/CreateTenderIndividualReport`, 
            {
                params,
                observe: 'response',
                headers: this.headers,
                responseType: 'blob' as 'json' 
            }
        );
    }
    
    }
    
    
      

