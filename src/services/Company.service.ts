import { HttpClient, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { environment } from "../environments/environment";
import { CompanyDto, ICompany } from "../dto/Company.dto";

type EntityResponseType = HttpResponse<CompanyDto>;
type EntityArrayResponseType = HttpResponse<CompanyDto[]>;

// @ts-ignore
@Injectable()
export class CompanyService {
    resourceUrl = environment.serverUrl;

    headers = {
        AuthToken:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYWRtaW4iLCJ1c2VybmFtZSI6ImRhbWluZHUifQ.B8BvnQhFGX7QMJzsSH8z5mJwss3YdpHpSBH7M9Zia4k",
    };

    constructor(private http: HttpClient) {}

    createCompany(company: ICompany): Observable<HttpResponse<CompanyDto>> {
        return this.http.post<CompanyDto>(
            `${this.resourceUrl}/gateway/payment-app1261/create/company`,
            company,
            { observe: "response", headers: this.headers }
        );
    }

    uploadFile(formData: FormData): Observable<HttpResponse<any>> {
        return this.http.post(
            `${this.resourceUrl}/gateway/payment-app1261/upload/company`,
            formData,
            { observe: "response" }
        );
    }

    updateCompany(company: ICompany): Observable<HttpResponse<CompanyDto>> {
        return this.http.put<CompanyDto>(
            `${this.resourceUrl}/gateway/payment-app1261/update/company`,
            company,
            { observe: "response", headers: this.headers }
        );
    }

    deleteCompany(req?: any): Observable<HttpResponse<ICompany>> {
        return this.http.delete<CompanyDto>(
            `${this.resourceUrl}/gateway/payment-app1261/delete/company`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findCompany(req?: any): Observable<HttpResponse<ICompany>> {
        return this.http.get<CompanyDto>(
            `${this.resourceUrl}/gateway/payment-app1261/find/company`,
            { params: req, observe: "response", headers: this.headers }
        );
    }

    findAllCompany(params: any): Observable<HttpResponse<CompanyDto[]>> {
        return this.http.get<CompanyDto[]>(
            `${this.resourceUrl}/gateway/payment-app1261/findall/company`,
            { params, observe: "response", headers: this.headers }
        );
    }

    downloadFile(): Observable<HttpResponse<Blob>> {
        return this.http.get(
            `${this.resourceUrl}/gateway/payment-app1261/download/company`,
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
